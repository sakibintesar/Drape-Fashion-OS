const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const { run, get, all, transaction } = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { handleValidation, stripTags } = require('../middleware/validate');

// Dedicated limiter for order placement — stricter than the general API limiter,
// since spammed orders drain real stock and pollute the order book.
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many orders placed from this IP. Please try again later.' }
});

const orderValidation = [
  body('fname').trim().notEmpty().withMessage('First name required').isLength({ max: 100 }),
  body('lname').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail().isLength({ max: 254 }),
  body('phone').trim().notEmpty().withMessage('Phone required').isLength({ max: 30 }),
  body('address').trim().notEmpty().withMessage('Address required').isLength({ max: 500 }),
  body('city').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('postcode').optional({ checkFalsy: true }).trim().isLength({ max: 20 }),
  body('items').isArray({ min: 1 }).withMessage('Items array required'),
  body('items.*.id').notEmpty().withMessage('Each item needs a product id'),
  body('items.*.qty').isInt({ min: 1, max: 999 }).withMessage('Item quantity must be a positive number')
];

function genOrderId() {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 90000) + 10000;
  return `DRP-${year}-${rand}`;
}

// POST /api/orders/validate — validate cart prices + stock against DB
router.post('/validate', async (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: 'Items array required' });
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
    console.error('Validate error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/orders — create order (atomic transaction)
router.post('/', orderLimiter, orderValidation, handleValidation, async (req, res) => {
  const { email, items, payment, customerId } = req.body;
  const fname = stripTags(req.body.fname);
  const lname = stripTags(req.body.lname || '');
  const phone = stripTags(req.body.phone);
  const address = stripTags(req.body.address);
  const city = stripTags(req.body.city || '');
  const postcode = stripTags(req.body.postcode || '');
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
        [orderId, customerId || null, fname, lname || '', email, phone, address, city || '', postcode || '',
         JSON.stringify(validatedItems), subtotal, shipping, total, 'pending', payment || 'cod']
      );
      return { orderId, subtotal, shipping, total, items: validatedItems };
    });
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    console.error('Create order error:', err.message);
    if (err.message.includes('Insufficient') || err.message.includes('not found')) {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders/track/:orderId — public
router.get('/track/:orderId', async (req, res) => {
  try {
    const order = await get('SELECT * FROM orders WHERE order_id = ?', [req.params.orderId]);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({
      orderId: order.order_id,
      status: order.status,
      fname: order.customer_fname,
      lname: order.customer_lname,
      email: order.email,
      city: order.city,
      items: JSON.parse(order.items_json || '[]'),
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      payment: order.payment_method,
      date: order.created_at
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders — admin: list all orders
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await all('SELECT * FROM orders ORDER BY created_at DESC');
    res.json({ orders: orders.map(o => ({ ...o, items: JSON.parse(o.items_json || '[]') })) });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/orders/:orderId/status — admin
router.put('/:orderId/status', authenticateToken, requireAdmin, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
  }
  try {
    const existing = await get('SELECT id FROM orders WHERE order_id = ?', [req.params.orderId]);
    if (!existing) return res.status(404).json({ error: 'Order not found' });
    await run('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?', [status, req.params.orderId]);
    res.json({ success: true, status });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/orders/:orderId — admin cancel
router.delete('/:orderId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const existing = await get('SELECT id FROM orders WHERE order_id = ?', [req.params.orderId]);
    if (!existing) return res.status(404).json({ error: 'Order not found' });
    await run('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?', ['cancelled', req.params.orderId]);
    res.json({ success: true, message: 'Order cancelled' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
