/**
 * Test helper — builds a fresh Express app with PostgreSQL test database.
 *
 * resetTestDatabase() drops & recreates drape_test (call once before all tests).
 * buildApp() cleans tables and reseeds (call once per describe block).
 */

// ── Environment must already be set by setup.js (Jest setupFiles) ──
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Require database AFTER env is configured (PostgreSQL mode)
const { initDatabase, run, get } = require('../database');
const runMigrations = require('../migrations/run');
const { seed } = require('../seed');

// Require routes
const authRoutes = require('../routes/auth');
const productRoutes = require('../routes/products');
const orderRoutes = require('../routes/orders');
const analyticsRoutes = require('../routes/analytics');
const customerRoutes = require('../routes/customers');
const aiRoutes = require('../routes/ai');

// Require middleware
const { requestLogger } = require('../middleware/logger');
const { apiLimiter } = require('../middleware/rateLimiter');
const { ERROR_CODES } = require('../lib/errors');

let dbInitialized = false;
let migrationsRan = false;

/**
 * Drop and recreate the test database. Call ONCE before all tests.
 */
async function resetTestDatabase() {
  const adminPool = new Pool({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT, 10) || 5432,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: 'postgres',
  });

  try {
    await adminPool.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = 'drape_test' AND pid <> pg_backend_pid()
    `);
    await adminPool.query('DROP DATABASE IF EXISTS drape_test');
    await adminPool.query('CREATE DATABASE drape_test');
  } finally {
    await adminPool.end();
  }

  // Clear cached modules so database.js reconnects to drape_test
  delete require.cache[require.resolve('../database')];
  delete require.cache[require.resolve('../seed')];
  delete require.cache[require.resolve('../migrations/run')];

  // Initialize and run migrations once
  await initDatabase();
  await runMigrations();
  migrationsRan = true;
  dbInitialized = true;
}

/**
 * Clean all tables and reseed. Call before each describe block.
 * Auto-initializes on first call (runs migrations if needed).
 */
async function cleanAndSeed() {
  if (!dbInitialized) {
    await initDatabase();
    if (!migrationsRan) {
      await runMigrations();
      migrationsRan = true;
    }
    dbInitialized = true;
  }

  const { pool } = require('../database');
  // Truncate all tables in correct order (respect foreign keys)
  await pool.query('TRUNCATE TABLE login_attempts, refresh_tokens, orders, products, users RESTART IDENTITY CASCADE');
  await seed({ init: false });

  // Reset sequences so SERIAL columns start after the highest seeded ID
  await pool.query("SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1))");
  await pool.query("SELECT setval(pg_get_serial_sequence('products', 'id'), COALESCE((SELECT MAX(id) FROM products), 1))");
  await pool.query("SELECT setval(pg_get_serial_sequence('orders', 'id'), COALESCE((SELECT MAX(id) FROM orders), 1))");
  await pool.query("SELECT setval(pg_get_serial_sequence('refresh_tokens', 'id'), COALESCE((SELECT MAX(id) FROM refresh_tokens), 1))");
  await pool.query("SELECT setval(pg_get_serial_sequence('login_attempts', 'id'), COALESCE((SELECT MAX(id) FROM login_attempts), 1))");
}

/**
 * Build a fresh Express app (tables already seeded by cleanAndSeed).
 */
function buildApp() {
  const app = express();

  // Security headers (minimal for testing)
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });

  app.use(express.json({ limit: '10mb' }));
  app.use(requestLogger);

  // CORS
  app.use(cors({
    origin: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
  }));

  // Rate limiting — skip in test mode to avoid 429s
  if (process.env.NODE_ENV !== 'test') {
    app.use('/api/', apiLimiter);
  }

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', env: 'test', version: '4.0.0' });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/customers', customerRoutes);
  app.use('/api/ai', aiRoutes);

  // Global error handler
  app.use((err, req, res, next) => {
    if (err.code && err.statusCode) {
      return res.status(err.statusCode).json({ error: { code: err.code, message: err.message } });
    }
    res.status(500).json({ error: { code: ERROR_CODES.INTERNAL_ERROR, message: 'Internal server error' } });
  });

  // 404 for unknown API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: { code: ERROR_CODES.NOT_FOUND, message: 'Endpoint not found' } });
  });

  return app;
}

/**
 * Seed an additional test user and return credentials.
 */
async function createTestUser(role = 'customer', overrides = {}) {
  const email = overrides.email || `test-${role}-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`;
  const password = overrides.password || 'TestPass1!';
  const hash = await bcrypt.hash(password, 12);

  await run(
    'INSERT INTO users (username, email, password_hash, role, fname, lname, phone, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [email, email, hash, role, overrides.fname || 'Test', overrides.lname || 'User', overrides.phone || '', overrides.city || 'Dhaka']
  );

  const user = await get('SELECT id, username, email, role, fname, lname FROM users WHERE email = ?', [email]);
  return { ...user, password };
}

/**
 * Generate a valid JWT access token for a user ID.
 */
function makeAccessToken(userId) {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
}

module.exports = { resetTestDatabase, cleanAndSeed, buildApp, createTestUser, makeAccessToken };
