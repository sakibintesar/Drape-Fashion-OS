const express = require('express');
const router = express.Router();
const { all, get, run, transaction } = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { adminLimiter } = require('../middleware/rateLimiter');

// GET /api/orders — admin only, list all orders
router.get('/', authenticateToken, requireAdmin, adminLimiter, async (req, res) => {
  try {
    const rows = await all('SELECT * FROM orders ORDER BY created_at DESC');
    const orders = rows.map(row => ({
      id: row.order_id,
      name: `${row.customer_fname || ''} ${row.customer_lname || ''}`.trim(),
      email: row.email,
      phone: row.phone,
      city: row.city,
      items: JSON.parse(row.items_json || '[]'),
      payment: row.payment_method,
      status: row.status,
      date: row.created_at ? row.created_at.split('T')[0] : '',
      total: row.total,
      _dbId: row.id
    }));
    res.json({ orders });
  } catch (err) {
    console.error('Orders fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/track/:orderId — public, track order
router.get('/track/:orderId', async (req, res) => {
  try {
    const row = await get('SELECT * FROM orders WHERE order_id = ?', [req.params.orderId]);
    if (!row) return res.status(404).json({ error: 'Order not found' });
    
    res.json({
      order: {
        id: row.order_id,
        status: row.status,
        customer: { fname: row.customer_fname, lname: row.customer_lname },
        items: JSON.parse(row.items_json || '[]'),
        total: row.total,
        date: row.created_at ? row.created_at.split('T')[0] : ''
      }
    });
  } catch (err) {
    console.error('Order track error:', err);
    res.status(500).json({ error: 'Failed to track order' });
  }
});

// POST /api/orders/validate — public, validate cart with server-side prices
router.post('/validate', async (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Items array required' });
  }

  try {
    const validatedItems = [];
    let subtotal = 0;
    let errors = [];

    for (const item of items) {
      const product = await get('SELECT id, name, price, stock, emoji FROM products WHERE id = ?', [item.id]);
      if (!product) {
        errors.push({ id: item.id, error: 'Product not found' });
        continue;
      }
      if (product.stock < item.qty) {
        errors.push({ id: item.id, name: product.name, error: `Only ${product.stock} in stock` });
        continue;
      }
      // Validate price matches database
      if (product.price !== item.price) {
        errors.push({ id: item.id, name: product.name, error: 'Price mismatch', serverPrice: product.price, clientPrice: item.price });
        continue;
      }
      validatedItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        qty: item.qty,
        size: item.size,
        color: item.color,
        emoji: product.emoji
      });
      subtotal += product.price * item.qty;
    }

    const shipping = subtotal > 3000 ? 0 : 80;

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', errors, validatedItems, subtotal, shipping, total: subtotal + shipping });
    }

    res.json({ valid: true, items: validatedItems, subtotal, shipping, total: subtotal + shipping });
  } catch (err) {
    console.error('Validation error:', err);
    res.status(500).json({ error: 'Failed to validate order' });
  }
});

// POST /api/orders — public, create order with transaction
router.post('/', async (req, res) => {
  const {
    customer_id, customer_fname, customer_lname, email, phone,
    address, city, postcode, items, subtotal, shipping, total, payment_method
  } = req.body;

  if (!items || !total || !email) {
    return res.status(400).json({ error: 'Items, total, and email are required' });
  }

  const orderId = 'DRAPE-' + Math.floor(1000 + Math.random() * 9000);

  try {
    const result = await transaction(async (t) => {
      // 1. Validate and decrement stock for each item
      for (const item of items) {
        const product = await t.get('SELECT id, price, stock FROM products WHERE id = ?', [item.id]);
        if (!product) throw new Error(`Product ${item.id} not found`);
        if (product.stock < item.qty) throw new Error(`Insufficient stock for product ${item.id}`);
        if (product.price !== item.price) throw new Error(`Price mismatch for product ${item.id}`);

        // Decrement stock
        await t.run('UPDATE products SET stock = stock - ?, sold = sold + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [item.qty, item.qty, item.id]);
      }

      // 2. Insert order
      const orderResult = await t.run(
        `INSERT INTO orders (order_id, customer_id, customer_fname, customer_lname, email, phone, address, city, postcode, items_json, subtotal, shipping, total, status, payment_method)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, customer_id || null, customer_fname || '', customer_lname || '', email, phone || '', address || '', city || '', postcode || '', JSON.stringify(items), subtotal, shipping, total, 'pending', payment_method || 'card']
      );

      return orderResult;
    });

    res.status(201).json({ orderId, id: result.id });
  } catch (err) {
    console.error('Order create error:', err);
    res.status(400).json({ error: err.message || 'Failed to create order' });
  }
});

// PUT /api/orders/:orderId/status — admin only, update status by orderId string
router.put('/:orderId/status', authenticateToken, requireAdmin, adminLimiter, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const existing = await get('SELECT id FROM orders WHERE order_id = ?', [req.params.orderId]);
    if (!existing) return res.status(404).json({ error: 'Order not found' });

    await run('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?', [status, req.params.orderId]);
    res.json({ message: 'Order status updated', status });
  } catch (err) {
    console.error('Order status update error:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// DELETE /api/orders/:orderId — admin only, cancel/delete order
router.delete('/:orderId', authenticateToken, requireAdmin, adminLimiter, async (req, res) => {
  try {
    const existing = await get('SELECT id FROM orders WHERE order_id = ?', [req.params.orderId]);
    if (!existing) return res.status(404).json({ error: 'Order not found' });

    await run('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?', ['cancelled', req.params.orderId]);
    res.json({ message: 'Order cancelled' });
  } catch (err) {
    console.error('Order cancel error:', err);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

module.exports = router;
