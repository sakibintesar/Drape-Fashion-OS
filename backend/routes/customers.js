const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const logger = require('../logger');
const { ERROR_CODES, sendError } = require('../lib/errors');

// GET /api/customers/me — customer's own profile
router.get('/me', authenticateToken, async (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/customers/me — update own profile
router.put('/me', authenticateToken, async (req, res) => {
  const { fname, lname, phone, address, city, postcode } = req.body;
  try {
    await run(
      'UPDATE users SET fname=?, lname=?, phone=?, address=?, city=?, postcode=? WHERE id=?',
      [fname || req.user.fname, lname || req.user.lname, phone || req.user.phone,
       address || req.user.address, city || req.user.city, postcode || req.user.postcode, req.user.id]
    );
    const updated = await get('SELECT id, username, email, role, fname, lname, phone, address, city, postcode FROM users WHERE id = ?', [req.user.id]);
    res.json({ user: updated });
  } catch (err) {
    logger.error('Update profile error', { message: err.message, stack: err.stack });
    sendError(res, 500, 'Server error', ERROR_CODES.INTERNAL_ERROR);
  }
});

// GET /api/customers/orders — customer's own order history
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await all(
      'SELECT * FROM orders WHERE customer_id = ? OR email = ? ORDER BY created_at DESC',
      [req.user.id, req.user.email]
    );
    res.json({
      orders: orders.map(o => ({
        id: o.order_id,
        status: o.status,
        total: o.total,
        items: JSON.parse(o.items_json || '[]'),
        payment: o.payment_method,
        date: o.created_at
      }))
    });
  } catch (err) {
    logger.error('Customer orders error', { message: err.message, stack: err.stack });
    sendError(res, 500, 'Server error', ERROR_CODES.INTERNAL_ERROR);
  }
});

// GET /api/customers — admin: list all customers
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const customers = await all(
      'SELECT id, username, email, role, fname, lname, phone, city, created_at FROM users WHERE role = ? ORDER BY created_at DESC',
      ['customer']
    );
    res.json({ customers });
  } catch (err) {
    sendError(res, 500, 'Server error', ERROR_CODES.INTERNAL_ERROR);
  }
});

module.exports = router;
