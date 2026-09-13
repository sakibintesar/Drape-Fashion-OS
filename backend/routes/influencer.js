/**
 * DRAPE Fashion OS — Influencer Collaboration Routes
 *
 * POST /api/influencer/apply    — Submit collaboration application
 * GET  /api/influencer/list     — Admin: list all applications
 */

const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { ERROR_CODES, sendError } = require('../lib/errors');

// ── Submit influencer application ──
router.post('/apply', async (req, res) => {
  const { name, handle, platform, followers, niche, message } = req.body;

  // Validation
  if (!name || !name.trim()) {
    return sendError(res, 400, 'Please provide your name.', ERROR_CODES.VALIDATION_ERROR);
  }
  if (!handle || !handle.trim()) {
    return sendError(res, 400, 'Please provide your social handle.', ERROR_CODES.VALIDATION_ERROR);
  }
  if (!platform) {
    return sendError(res, 400, 'Please select a platform.', ERROR_CODES.VALIDATION_ERROR);
  }

  try {
    await run(
      'INSERT INTO influencer_applications (name, handle, platform, followers, niche, message) VALUES (?, ?, ?, ?, ?, ?)',
      [
        name.trim(),
        handle.trim(),
        platform,
        followers || null,
        niche || null,
        message || null
      ]
    );

    console.log(`📱 New influencer application: ${handle} (${platform})`);
    res.json({
      message: 'Application received! We\'ll review your profile and get back to you within 48 hours.',
      status: 'pending'
    });
  } catch (err) {
    console.error('Influencer application error:', err);
    sendError(res, 500, 'Failed to submit application. Please try again.', ERROR_CODES.INTERNAL_ERROR);
  }
});

// ── Admin: list all applications ──
router.get('/list', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM influencer_applications';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const applications = await all(query, params);
    res.json({ applications, count: applications.length });
  } catch (err) {
    console.error('List influencer applications error:', err);
    sendError(res, 500, 'Failed to fetch applications.', ERROR_CODES.INTERNAL_ERROR);
  }
});

// ── Admin: update application status ──
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'approved', 'rejected'];
  if (!validStatuses.includes(status)) {
    return sendError(res, 400, 'Invalid status.', ERROR_CODES.VALIDATION_ERROR);
  }

  try {
    const existing = await get('SELECT id FROM influencer_applications WHERE id = ?', [id]);
    if (!existing) {
      return sendError(res, 404, 'Application not found.', ERROR_CODES.NOT_FOUND);
    }

    await run('UPDATE influencer_applications SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: `Application ${status}.`, id, status });
  } catch (err) {
    console.error('Update influencer status error:', err);
    sendError(res, 500, 'Failed to update status.', ERROR_CODES.INTERNAL_ERROR);
  }
});

module.exports = router;
