require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const { run, get, all } = require('../database');
const { loginLimiter } = require('../middleware/rateLimiter');
const { logLoginAttempt } = require('../middleware/logger');
const { handleValidation, stripTags } = require('../middleware/validate');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  authenticateToken,
  REFRESH_SECRET
} = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', loginLimiter, [
  body('username').trim().notEmpty().withMessage('Username or email required').isLength({ max: 254 }),
  body('password').notEmpty().withMessage('Password required').isLength({ max: 200 })
], handleValidation, async (req, res) => {
  const { username, password } = req.body;
  try {
    // Support login by email or username
    const user = await get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      logLoginAttempt(req, username, false);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await run(
      'INSERT INTO refresh_tokens (token, user_id, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
      [refreshToken, user.id, req.ip, req.headers['user-agent'] || '', expires]
    );
    logLoginAttempt(req, username, true);
    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fname: user.fname,
        lname: user.lname,
        phone: user.phone,
        city: user.city
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/register (customer only)
router.post('/register', [
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail().isLength({ max: 254 }),
  body('password').isLength({ min: 6, max: 200 }).withMessage('Password must be at least 6 characters'),
  body('fname').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('lname').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 30 })
], handleValidation, async (req, res) => {
  const { email, password } = req.body;
  const fname = stripTags(req.body.fname || '');
  const lname = stripTags(req.body.lname || '');
  const phone = stripTags(req.body.phone || '');
  try {
    const existing = await get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    const hash = await bcrypt.hash(password, 12);
    const result = await run(
      'INSERT INTO users (username, email, password_hash, role, fname, lname, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [email, email, hash, 'customer', fname, lname, phone]
    );
    const userId = result.id;
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await run(
      'INSERT INTO refresh_tokens (token, user_id, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
      [refreshToken, userId, req.ip, req.headers['user-agent'] || '', expires]
    );
    res.status(201).json({
      accessToken,
      refreshToken,
      user: { id: userId, email, role: 'customer', fname: fname || '', lname: lname || '', phone: phone || '' }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const stored = await get(
      'SELECT * FROM refresh_tokens WHERE token = ? AND user_id = ?',
      [refreshToken, decoded.userId]
    );
    if (!stored || new Date(stored.expires_at) < new Date()) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
    const accessToken = generateAccessToken(decoded.userId);
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await run('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]).catch(() => {});
  }
  res.json({ message: 'Logged out' });
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// POST /api/auth/change-password — any authenticated user, admin included
router.post('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password required' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }
  if (newPassword === currentPassword) {
    return res.status(400).json({ error: 'New password must differ from current password' });
  }
  try {
    const user = await get('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!user || !(await bcrypt.compare(currentPassword, user.password_hash))) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    const hash = await bcrypt.hash(newPassword, 12);
    await run('UPDATE users SET password_hash = ? WHERE id = ?', [hash, user.id]);
    // Invalidate all existing refresh tokens for this user — force re-login everywhere
    await run('DELETE FROM refresh_tokens WHERE user_id = ?', [user.id]);
    res.json({ message: 'Password updated. Please log in again.' });
  } catch (err) {
    console.error('Change-password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
