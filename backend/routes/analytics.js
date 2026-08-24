const express = require('express');
const router = express.Router();
const { get, all } = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /api/analytics — admin dashboard stats
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [
      revenueRow,
      ordersRow,
      productsRow,
      customersRow,
      recentOrders,
      topProducts
    ] = await Promise.all([
      get('SELECT SUM(total) as total FROM orders WHERE status != ?', ['cancelled']),
      get('SELECT COUNT(*) as count FROM orders WHERE status != ?', ['cancelled']),
      get('SELECT COUNT(*) as count FROM products'),
      get('SELECT COUNT(*) as count FROM users WHERE role = ?', ['customer']),
      all('SELECT * FROM orders ORDER BY created_at DESC LIMIT 10'),
      all('SELECT p.name, p.emoji, p.vendor, p.price * p.sold as revenue, p.sold FROM products p ORDER BY revenue DESC LIMIT 5')
    ]);

    // Daily revenue last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({ date: dateStr, label: d.toLocaleDateString('en-BD', { weekday: 'short' }) });
    }
    const dailyRevenue = await Promise.all(days.map(async day => {
      const row = await get(
        "SELECT SUM(total) as rev FROM orders WHERE date(created_at) = ? AND status != 'cancelled'",
        [day.date]
      );
      return { ...day, revenue: row?.rev || 0 };
    }));

    // Category breakdown
    const categories = await all('SELECT category, SUM(price * sold) as revenue FROM products GROUP BY category ORDER BY revenue DESC');

    res.json({
      revenue: revenueRow?.total || 0,
      orders: ordersRow?.count || 0,
      products: productsRow?.count || 0,
      customers: customersRow?.count || 0,
      dailyRevenue,
      topProducts,
      categories,
      recentOrders: recentOrders.map(o => ({
        ...o,
        items: JSON.parse(o.items_json || '[]')
      }))
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
