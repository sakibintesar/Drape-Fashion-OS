const express = require('express');
const router = express.Router();
const { all, get, run } = require('../database');
const { authenticateToken, requireCustomer, requireAuth } = require('../middleware/auth');

// GET /api/customers/me — customer profile
router.get('/me', authenticateToken, requireCustomer, async (req, res) => {
  try {
    const user = await get('SELECT id, username, email, fname, lname, phone, address, city, postcode, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ customer: user });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/customers/me — update profile
router.put('/me', authenticateToken, requireCustomer, async (req, res) => {
  const { fname, lname, phone, address, city, postcode } = req.body;

  try {
    await run(
      'UPDATE users SET fname = COALESCE(?, fname), lname = COALESCE(?, lname), phone = COALESCE(?, phone), address = COALESCE(?, address), city = COALESCE(?, city), postcode = COALESCE(?, postcode) WHERE id = ?',
      [fname, lname, phone, address, city, postcode, req.user.id]
    );
    const user = await get('SELECT id, username, email, fname, lname, phone, address, city, postcode, created_at FROM users WHERE id = ?', [req.user.id]);
    res.json({ customer: user });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/customers/orders — my order history
router.get('/orders', authenticateToken, requireCustomer, async (req, res) => {
  try {
    const rows = await all('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC', [req.user.id]);
    const orders = rows.map(row => ({
      id: row.order_id,
      status: row.status,
      items: JSON.parse(row.items_json || '[]'),
      total: row.total,
      subtotal: row.subtotal,
      shipping: row.shipping,
      payment: row.payment_method,
      date: row.created_at ? row.created_at.split('T')[0] : '',
      customer: { fname: row.customer_fname, lname: row.customer_lname }
    }));
    res.json({ orders });
  } catch (err) {
    console.error('Customer orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
