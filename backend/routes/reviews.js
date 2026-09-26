const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../logger');

// GET /api/reviews/recent — Recent reviews across all products (public, for testimonials)
router.get('/recent', async (req, res) => {
  try {
    const reviews = await all(
      `SELECT r.*, u.fname, u.lname, p.name as product_name, p.vendor
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN products p ON r.product_id = p.id
       ORDER BY r.created_at DESC
       LIMIT 10`
    );
    res.json({ reviews: reviews || [] });
  } catch (err) {
    logger.error('Get recent reviews error', { message: err.message });
    res.json({ reviews: [] });
  }
});

// GET /api/reviews/:productId — Get reviews for a product (public)
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await all(
      `SELECT r.*, u.fname, u.lname
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [req.params.productId]
    );

    // Calculate average rating
    const stats = await get(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
       FROM reviews WHERE product_id = ?`,
      [req.params.productId]
    );

    res.json({
      reviews,
      stats: {
        avgRating: stats?.avg_rating ? Math.round(stats.avg_rating * 10) / 10 : 0,
        totalReviews: stats?.total_reviews || 0
      }
    });
  } catch (err) {
    logger.error('Get reviews error', { message: err.message });
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// POST /api/reviews/:productId — Submit a review (authenticated)
router.post('/:productId', authenticateToken, async (req, res) => {
  const { rating, title, comment } = req.body;
  const productId = req.params.productId;
  const userId = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: { message: 'Rating must be between 1 and 5' } });
  }

  if (!comment || comment.trim().length < 10) {
    return res.status(400).json({ error: { message: 'Review must be at least 10 characters' } });
  }

  try {
    // Check if product exists
    const product = await get('SELECT id FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ error: { message: 'Product not found' } });
    }

    // Check if user already reviewed this product
    const existing = await get(
      'SELECT id FROM reviews WHERE product_id = ? AND user_id = ?',
      [productId, userId]
    );
    if (existing) {
      return res.status(400).json({ error: { message: 'You have already reviewed this product' } });
    }

    const result = await run(
      `INSERT INTO reviews (product_id, user_id, rating, title, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [productId, userId, rating, title || '', comment.trim()]
    );

    const review = await get(
      `SELECT r.*, u.fname, u.lname
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.id = ?`,
      [result.id]
    );

    res.status(201).json(review);
  } catch (err) {
    logger.error('Create review error', { message: err.message });
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// DELETE /api/reviews/:id — Delete own review (authenticated)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const review = await get('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
    if (!review) {
      return res.status(404).json({ error: { message: 'Review not found' } });
    }

    // Only allow deleting own review (or admin)
    if (review.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Not authorized' } });
    }

    await run('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    logger.error('Delete review error', { message: err.message });
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
