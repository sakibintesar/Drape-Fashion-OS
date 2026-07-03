const express = require('express');
const router = express.Router();
const { all, get } = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { adminLimiter } = require('../middleware/rateLimiter');

// GET /api/analytics - admin only, dashboard stats
router.get('/', authenticateToken, requireAdmin, adminLimiter, async (req, res) => {
  try {
    const totalProducts = await get('SELECT COUNT(*) as count FROM products');
    const totalOrders = await get('SELECT COUNT(*) as count FROM orders');
    const totalRevenue = await get('SELECT COALESCE(SUM(total), 0) as total FROM orders');
    const pendingOrders = await get('SELECT COUNT(*) as count FROM orders WHERE status = ?', ['pending']);
    const lowStock = await all('SELECT name, stock FROM products WHERE stock < 10 ORDER BY stock ASC LIMIT 5');
    const recentOrders = await all('SELECT order_id, status, total, created_at FROM orders ORDER BY created_at DESC LIMIT 5');
    const statusBreakdown = await all('SELECT status, COUNT(*) as count FROM orders GROUP BY status');
    const salesByDay = await all(`
      SELECT date(created_at) as day, COUNT(*) as orders, COALESCE(SUM(total), 0) as revenue
      FROM orders
      WHERE created_at >= date('now', '-7 days')
      GROUP BY date(created_at)
      ORDER BY day ASC
    `);
    const categorySales = await all(`
      SELECT p.category, COUNT(*) as count, COALESCE(SUM(o.total), 0) as revenue
      FROM orders o
      JOIN json_each(o.items_json) as item
      JOIN products p ON p.id = json_extract(item.value, '$.id')
      GROUP BY p.category
    `);

    res.json({
      stats: {
        totalProducts: totalProducts.count,
        totalOrders: totalOrders.count,
        totalRevenue: totalRevenue.total,
        pendingOrders: pendingOrders.count,
        lowStockItems: lowStock
      },
      recentOrders,
      statusBreakdown,
      salesByDay,
      categorySales
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
