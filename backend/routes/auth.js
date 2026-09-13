require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { run, get, all } = require('../database');
const { loginLimiter } = require('../middleware/rateLimiter');
const { logLoginAttempt } = require('../middleware/logger');
const logger = require('../logger');
const { ERROR_CODES, sendError } = require('../lib/errors');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  authenticateToken,
  REFRESH_SECRET
} = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return sendError(res, 400, 'Username and password required', ERROR_CODES.VALIDATION_ERROR);
  }
  try {
    // Support login by email or username
    const user = await get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      logLoginAttempt(req, username, false);
      return sendError(res, 401, 'Invalid credentials', ERROR_CODES.AUTH_INVALID);
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
    logger.error('Login error', { message: err.message, stack: err.stack });
    sendError(res, 500, 'Server error', ERROR_CODES.INTERNAL_ERROR);
  }
});

// POST /api/auth/register (customer only)
router.post('/register', async (req, res) => {
  const { email, password, fname, lname, phone } = req.body;
  if (!email || !password) {
    return sendError(res, 400, 'Email and password required', ERROR_CODES.VALIDATION_ERROR);
  }
  if (password.length < 8) {
    return sendError(res, 400, 'Password must be at least 8 characters', ERROR_CODES.VALIDATION_ERROR);
  }
  if (!/[A-Z]/.test(password)) {
    return sendError(res, 400, 'Password must contain an uppercase letter', ERROR_CODES.VALIDATION_ERROR);
  }
  if (!/[0-9]/.test(password)) {
    return sendError(res, 400, 'Password must contain a number', ERROR_CODES.VALIDATION_ERROR);
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return sendError(res, 400, 'Password must contain a special character', ERROR_CODES.VALIDATION_ERROR);
  }
  try {
    const existing = await get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return sendError(res, 409, 'An account with this email already exists', ERROR_CODES.CONFLICT);
    }
    const hash = await bcrypt.hash(password, 12);
    const result = await run(
      'INSERT INTO users (username, email, password_hash, role, fname, lname, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [email, email, hash, 'customer', fname || '', lname || '', phone || '']
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

    // Send welcome email (non-blocking)
    const { sendWelcomeEmail } = require('../services/email');
    sendWelcomeEmail({ email, fname: fname || '' }).catch(err =>
      logger.error('Welcome email failed', { message: err.message })
    );
  } catch (err) {
    logger.error('Register error', { message: err.message, stack: err.stack });
    sendError(res, 500, 'Server error', ERROR_CODES.INTERNAL_ERROR);
  }
});

// POST /api/auth/refresh — with token rotation
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return sendError(res, 400, 'Refresh token required', ERROR_CODES.VALIDATION_ERROR);
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const stored = await get(
      'SELECT * FROM refresh_tokens WHERE token = ? AND user_id = ?',
      [refreshToken, decoded.userId]
    );
    if (!stored || new Date(stored.expires_at) < new Date()) {
      return sendError(res, 403, 'Invalid or expired refresh token', ERROR_CODES.AUTH_EXPIRED);
    }
    // SECURITY: Rotate refresh token — delete old, issue new
    await run('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
    const newRefreshToken = generateRefreshToken(decoded.userId);
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await run(
      'INSERT INTO refresh_tokens (token, user_id, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
      [newRefreshToken, decoded.userId, req.ip, req.headers['user-agent'] || '', expires]
    );
    const accessToken = generateAccessToken(decoded.userId);
    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    sendError(res, 403, 'Invalid refresh token', ERROR_CODES.AUTH_INVALID);
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

module.exports = router;
