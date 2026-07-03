require('dotenv').config();
const jwt = require('jsonwebtoken');
const { get } = require('../database');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'drape-access-secret-change-in-production';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'drape-refresh-secret-change-in-production';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, ACCESS_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ error: 'Access token expired', code: 'TOKEN_EXPIRED' });
      }
      return res.status(403).json({ error: 'Invalid access token' });
    }

    try {
      const user = await get('SELECT id, username, email, role, fname, lname, phone, address, city, postcode FROM users WHERE id = ?', [decoded.userId]);
      if (!user) {
        return res.status(403).json({ error: 'User no longer exists' });
      }
      req.user = user;
      next();
    } catch (dbErr) {
      console.error('Auth DB error:', dbErr);
      return res.status(500).json({ error: 'Authentication error' });
    }
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

function requireCustomer(req, res, next) {
  if (!req.user || req.user.role !== 'customer') {
    return res.status(403).json({ error: 'Customer access required' });
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'customer')) {
    return res.status(403).json({ error: 'Authentication required' });
  }
  next();
}

function generateAccessToken(userId) {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId, type: 'refresh' }, REFRESH_SECRET, { expiresIn: '7d' });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireCustomer,
  requireAuth,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  ACCESS_SECRET,
  REFRESH_SECRET
};
