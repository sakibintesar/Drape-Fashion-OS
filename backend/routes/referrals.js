/**
 * DRAPE Fashion OS — Referral System
 *
 * POST /api/referrals — Generate a referral code for a user
 * GET /api/referrals/:code — Get referral info
 * POST /api/referrals/:code/apply — Apply referral code (track conversion)
 */

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { run, get, all } = require('../database');

/**
 * Generate a unique referral code
 */
function generateCode() {
  return 'DRAPE-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

/**
 * POST /api/referrals
 * Generate or get existing referral code for a user
 */
router.post('/', async (req, res) => {
  const { user_id, email } = req.body;

  if (!user_id && !email) {
    return res.status(400).json({ error: 'user_id or email required' });
  }

  try {
    // Check if user already has a referral code
    let referral;
    if (user_id) {
      referral = await get('SELECT * FROM referrals WHERE user_id = ?', [user_id]);
    } else {
      referral = await get('SELECT * FROM referrals WHERE email = ?', [email]);
    }

    if (referral) {
      return res.json({
        code: referral.code,
        referral_link: `${process.env.FRONTEND_URL || req.headers.origin}?ref=${referral.code}`,
        total_referrals: referral.total_referrals || 0,
        total_earned: referral.total_earned || 0,
      });
    }

    // Generate new code
    const code = generateCode();
    const result = await run(
      'INSERT INTO referrals (user_id, email, code) VALUES (?, ?, ?)',
      [user_id || null, email || null, code]
    );

    res.json({
      code,
      referral_link: `${process.env.FRONTEND_URL || req.headers.origin}?ref=${code}`,
      total_referrals: 0,
      total_earned: 0,
    });
  } catch (e) {
    console.error('Referral create error:', e);
    res.status(500).json({ error: 'Failed to generate referral code' });
  }
});

/**
 * GET /api/referrals/:code
 * Get referral info
 */
router.get('/:code', async (req, res) => {
  const { code } = req.params;

  try {
    const referral = await get('SELECT * FROM referrals WHERE code = ?', [code]);
    if (!referral) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }

    res.json({
      code: referral.code,
      total_referrals: referral.total_referrals || 0,
    });
  } catch (e) {
    console.error('Referral lookup error:', e);
    res.status(500).json({ error: 'Failed to lookup referral code' });
  }
});

/**
 * POST /api/referrals/:code/apply
 * Apply referral code (track conversion when referred user places order)
 */
router.post('/:code/apply', async (req, res) => {
  const { code } = req.params;
  const { order_id, new_user_email } = req.body;

  try {
    const referral = await get('SELECT * FROM referrals WHERE code = ?', [code]);
    if (!referral) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }

    // Increment referral count
    await run(
      'UPDATE referrals SET total_referrals = total_referrals + 1 WHERE code = ?',
      [code]
    );

    // Log the referral event
    await run(
      'INSERT INTO referral_events (referral_code, order_id, new_user_email) VALUES (?, ?, ?)',
      [code, order_id || null, new_user_email || null]
    );

    res.json({
      success: true,
      message: 'Referral tracked successfully',
    });
  } catch (e) {
    console.error('Referral apply error:', e);
    res.status(500).json({ error: 'Failed to apply referral' });
  }
});

/**
 * GET /api/referrals/:code/stats
 * Get referral stats for a code
 */
router.get('/:code/stats', async (req, res) => {
  const { code } = req.params;

  try {
    const referral = await get('SELECT * FROM referrals WHERE code = ?', [code]);
    if (!referral) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }

    // Get recent referral events
    const events = await all(
      'SELECT * FROM referral_events WHERE referral_code = ? ORDER BY created_at DESC LIMIT 10',
      [code]
    );

    res.json({
      code: referral.code,
      total_referrals: referral.total_referrals || 0,
      recent_events: events,
    });
  } catch (e) {
    console.error('Referral stats error:', e);
    res.status(500).json({ error: 'Failed to get referral stats' });
  }
});

module.exports = router;
