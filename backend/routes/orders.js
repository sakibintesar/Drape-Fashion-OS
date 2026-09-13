const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { run, get, all, transaction } = require('../database');
const { authenticateToken, optionalAuth, requireAdmin } = require('../middleware/auth');
const logger = require('../logger');
const { ERROR_CODES, sendError } = require('../lib/errors');
const { sendOrderConfirmation } = require('../services/email');

// SECURITY: Use crypto for unpredictable order IDs
function genOrderId() {
  const year = new Date().getFullYear();
  const rand = crypto.randomBytes(4).readUInt32BE(0) % 900000 + 100000;
  return `DRP-${year}-${rand}`;
}

// POST /api/orders/validate — validate cart prices + stock against DB
router.post('/validate', optionalAuth, async (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items) || !items.length) {
    return sendError(res, 400, 'Items array required', ERROR_CODES.VALIDATION_ERROR);
  }
  try {
    const issues = [];
    const validated = [];
    for (const item of items) {
      const product = await get('SELECT id, name, price, stock FROM products WHERE id = ?', [item.id]);
      if (!product) { issues.push({ id: item.id, reason: 'Product not found' }); continue; }
      if (product.stock < (item.qty || 1)) { issues.push({ id: item.id, name: product.name, reason: `Only ${product.stock} in stock` }); continue; }
      if (product.price !== item.price) { issues.push({ id: item.id, name: product.name, reason: `Price mismatch: expected ৳${product.price}`, correctedPrice: product.price }); }
      validated.push({ ...item, price: product.price });
    }
    res.json({ valid: issues.length === 0, issues, validated });
  } catch (err) {
    logger.error('Validate error', { message: err.message, stack: err.stack });
    sendError(res, 500, 'Server error', ERROR_CODES.INTERNAL_ERROR);
  }
});

// POST /api/orders — create order (atomic transaction)
router.post('/', optionalAuth, async (req, res) => {
  const { fname, lname, email, phone, address, city, postcode, items, payment, referral_code } = req.body;
  if (!fname || !email || !phone || !address || !items?.length) {
    return sendError(res, 400, 'Missing required fields', ERROR_CODES.VALIDATION_ERROR);
  }
  // Optional: require login for orders (set REQUIRE_LOGIN_FOR_ORDERS=true in .env)
  if (process.env.REQUIRE_LOGIN_FOR_ORDERS === 'true' && !req.user?.id) {
    return sendError(res, 401, 'Please log in to place an order', ERROR_CODES.UNAUTHORIZED);
  }
  try {
    const orderId = genOrderId();
    const result = await transaction(async (db) => {
      // Validate + lock stock for each item
      let subtotal = 0;
      const validatedItems = [];
      for (const item of items) {
        const product = await db.get('SELECT id, name, price, stock FROM products WHERE id = ?', [item.id]);
        if (!product) throw new Error(`Product ${item.id} not found`);
        if (product.stock < item.qty) throw new Error(`Insufficient stock for ${product.name}`);
        subtotal += product.price * item.qty;
        validatedItems.push({ ...item, price: product.price, name: product.name });
        // Decrement stock atomically
        await db.run('UPDATE products SET stock = stock - ?, sold = sold + ? WHERE id = ?', [item.qty, item.qty, item.id]);
      }
      const shipping = subtotal > 3000 ? 0 : 80;
      const total = subtotal + shipping;
      await db.run(
        `INSERT INTO orders (order_id, customer_id, customer_fname, customer_lname, email, phone, address, city, postcode, items_json, subtotal, shipping, total, status, payment_method)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, req.user?.id || null, fname, lname || '', email, phone, address, city || '', postcode || '',
         JSON.stringify(validatedItems), subtotal, shipping, total, 'pending', payment || 'cod']
      );

      // Log referral if code provided
      if (referral_code) {
        try {
          await db.run(
            'INSERT INTO referral_events (referral_code, order_id, new_user_email) VALUES (?, ?, ?)',
            [referral_code, orderId, email]
          );
          await db.run(
            'UPDATE referrals SET total_referrals = total_referrals + 1 WHERE code = ?',
            [referral_code]
          );
        } catch (e) {
          // Non-critical — don't fail order if referral tracking fails
          console.error('Referral tracking error:', e.message);
        }
      }

      // Log order confirmation
      console.log(`[ORDER] ${orderId} | ${fname} ${lname || ''} | ৳${total} | ${items.length} items | ${payment || 'cod'}`);

      return { orderId, subtotal, shipping, total, items: validatedItems };
    });
    res.status(201).json({ success: true, ...result });

    // Send order confirmation email (non-blocking — email failure doesn't fail the order)
    sendOrderConfirmation({
      orderId: result.orderId,
      items: result.items,
      total: result.total,
      subtotal: result.subtotal,
      shipping: result.shipping,
      email,
      customer_fname: fname,
      payment_method: payment || 'cod'
    }).catch(err => logger.error('Order confirmation email failed', { message: err.message }));
  } catch (err) {
    logger.error('Create order error', { message: err.message, stack: err.stack });
    if (err.message.includes('Insufficient') || err.message.includes('not found')) {
      return sendError(res, 409, err.message, ERROR_CODES.CONFLICT);
    }
    sendError(res, 500, 'Server error', ERROR_CODES.INTERNAL_ERROR);
  }
});

// SECURITY: Rate limit tracking endpoint to prevent enumeration
const trackAttempts = new Map();
router.get('/track/:orderId', async (req, res) => {
  // Rate limit: 10 requests per IP per minute
  const ip = req.ip;
  const now = Date.now();
  const attempts = trackAttempts.get(ip) || [];
  const recent = attempts.filter(t => now - t < 60000);
  if (recent.length >= 10) {
    return sendError(res, 429, 'Too many tracking requests. Please try again later.', ERROR_CODES.RATE_LIMITED);
  }
  recent.push(now);
  trackAttempts.set(ip, recent);

  try {
    const order = await get('SELECT * FROM orders WHERE order_id = ?', [req.params.orderId]);
    if (!order) return sendError(res, 404, 'Order not found', ERROR_CODES.NOT_FOUND);
    // SECURITY: Return limited data — no full PII
    res.json({
      orderId: order.order_id,
      status: order.status,
      city: order.city,
      items: (typeof order.items_json === 'string' ? JSON.parse(order.items_json || '[]') : order.items_json || []).map(i => ({ name: i.name, qty: i.qty, emoji: i.emoji })),
      total: order.total,
      date: order.created_at
    });
  } catch (err) {
    sendError(res, 500, 'Server error', ERROR_CODES.INTERNAL_ERROR);
  }
});

// GET /api/orders — admin: list all orders (with pagination)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
    const offset = (page - 1) * limit;

    const countResult = await get('SELECT COUNT(*) as total FROM orders');
    const total = countResult?.total || 0;

    const orders = await all('SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset]);
    res.json({
      orders: orders.map(o => ({ ...o, items: typeof o.items_json === 'string' ? JSON.parse(o.items_json || '[]') : o.items_json || [] })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    sendError(res, 500, 'Server error', ERROR_CODES.INTERNAL_ERROR);
  }
});

// PUT /api/orders/:orderId/status — admin
router.put('/:orderId/status', authenticateToken, requireAdmin, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    return sendError(res, 400, `status must be one of: ${validStatuses.join(', ')}`, ERROR_CODES.VALIDATION_ERROR);
  }
  try {
    const existing = await get('SELECT id FROM orders WHERE order_id = ?', [req.params.orderId]);
    if (!existing) return sendError(res, 404, 'Order not found', ERROR_CODES.NOT_FOUND);
    await run('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?', [status, req.params.orderId]);
    res.json({ success: true, status });
  } catch (err) {
    sendError(res, 500, 'Server error', ERROR_CODES.INTERNAL_ERROR);
  }
});

// DELETE /api/orders/:orderId — admin cancel
router.delete('/:orderId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const existing = await get('SELECT id FROM orders WHERE order_id = ?', [req.params.orderId]);
    if (!existing) return sendError(res, 404, 'Order not found', ERROR_CODES.NOT_FOUND);
    await run('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?', ['cancelled', req.params.orderId]);
    res.json({ success: true, message: 'Order cancelled' });
  } catch (err) {
    sendError(res, 500, 'Server error', ERROR_CODES.INTERNAL_ERROR);
  }
});

module.exports = router;
