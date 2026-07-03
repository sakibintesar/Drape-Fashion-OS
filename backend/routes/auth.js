const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { get, run } = require('../database');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, authenticateToken } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');
const { logLoginAttempt } = require('../middleware/logger');

// POST /api/auth/login — works for both admin and customer
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const user = await get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
    
    if (!user) {
      logLoginAttempt(req, username, false);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      logLoginAttempt(req, username, false);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    logLoginAttempt(req, user.username, true);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await run(
      'INSERT INTO refresh_tokens (token, user_id, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
      [refreshToken, user.id, ip, userAgent, expiresAt]
    );

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fname: user.fname,
        lname: user.lname
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/register — customer registration
router.post('/register', async (req, res) => {
  const { email, password, fname, lname, phone, address, city, postcode } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const existing = await get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 12);
    const result = await run(
      'INSERT INTO users (username, email, password_hash, role, fname, lname, phone, address, city, postcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [email, email, hash, 'customer', fname || '', lname || '', phone || '', address || '', city || '', postcode || '']
    );

    const user = await get('SELECT id, username, email, role, fname, lname FROM users WHERE id = ?', [result.id]);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await run(
      'INSERT INTO refresh_tokens (token, user_id, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
      [refreshToken, user.id, ip, userAgent, expiresAt]
    );

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fname: user.fname,
        lname: user.lname
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const stored = await get('SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > datetime("now")', [refreshToken]);
    
    if (!stored || stored.user_id !== decoded.userId) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    const newAccessToken = generateAccessToken(decoded.userId);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Refresh error:', err);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (refreshToken) {
      await run('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
    }
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// GET /api/auth/me — get current user info
router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
