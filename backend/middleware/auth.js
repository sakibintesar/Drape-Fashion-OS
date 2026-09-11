require('dotenv').config();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { get } = require('../database');

// CRITICAL: Throw at startup if secrets are missing — never use hardcoded fallbacks
if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.error('❌ FATAL: JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set in .env');
  console.error('   Generate with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
  process.exit(1);
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

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

/**
 * Optional authentication — sets req.user if a valid token is present,
 * but does NOT reject if missing or invalid. Used for guest-accessible
 * endpoints that behave differently for logged-in users (e.g. orders).
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next();

  jwt.verify(token, ACCESS_SECRET, async (err, decoded) => {
    if (err) return next(); // invalid/expired token → proceed as guest
    try {
      const user = await get('SELECT id, username, email, role, fname, lname, phone, address, city, postcode FROM users WHERE id = ?', [decoded.userId]);
      if (user) req.user = user;
    } catch (_) { /* DB error → proceed as guest */ }
    next();
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
  return jwt.sign({ userId, type: 'refresh', jti: crypto.randomUUID() }, REFRESH_SECRET, { expiresIn: '7d' });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin,
  requireCustomer,
  requireAuth,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
};
