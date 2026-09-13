const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { ERROR_CODES, sendError } = require('../lib/errors');

// ── Subscribe to newsletter ──
router.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@') || !email.includes('.')) {
    return sendError(res, 400, 'Please provide a valid email address.', ERROR_CODES.VALIDATION_ERROR);
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Check if already subscribed
    const existing = await get('SELECT id FROM newsletter_subscribers WHERE email = ?', [normalizedEmail]);
    if (existing) {
      return res.json({ message: 'You are already subscribed!' });
    }

    await run(
      'INSERT INTO newsletter_subscribers (email, source) VALUES (?, ?)',
      [normalizedEmail, 'popup']
    );

    console.log(`📬 New subscriber: ${normalizedEmail}`);
    res.json({ message: 'Successfully subscribed! Welcome to DRAPE.' });
  } catch (err) {
    sendError(res, 500, 'Subscription failed. Please try again.', ERROR_CODES.INTERNAL_ERROR);
  }
});

// ── Unsubscribe ──
router.post('/unsubscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return sendError(res, 400, 'Email is required.', ERROR_CODES.VALIDATION_ERROR);
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    await run('DELETE FROM newsletter_subscribers WHERE email = ?', [normalizedEmail]);
    res.json({ message: 'You have been unsubscribed.' });
  } catch (err) {
    sendError(res, 500, 'Unsubscribe failed.', ERROR_CODES.INTERNAL_ERROR);
  }
});

// ── Admin: List subscribers ──
router.get('/subscribers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const list = await all('SELECT email, source, subscribed_at FROM newsletter_subscribers ORDER BY subscribed_at DESC');
    res.json({ subscribers: list, count: list.length });
  } catch (err) {
    sendError(res, 500, 'Failed to list subscribers.', ERROR_CODES.INTERNAL_ERROR);
  }
});

module.exports = router;
