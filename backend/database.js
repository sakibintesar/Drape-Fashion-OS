/**
 * DRAPE Fashion OS — Dual-Mode Database Layer (SQLite + PostgreSQL)
 *
 * Supports both SQLite (better-sqlite3) and PostgreSQL (pg) via environment variables.
 * - If PGHOST or DATABASE_URL is set → uses PostgreSQL
 * - Otherwise → uses SQLite (backward compatible with existing deployments)
 *
 * Connection priority:
 *   1. Individual PG* env vars (PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE)
 *   2. DATABASE_URL connection string
 *   3. SQLite (default, file-based)
 *
 * All helpers are async for consistency. SQLite operations run sync but return promises.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// ── Detect Database Mode ──────────────────────────────────────────────────────
const usePostgres = process.env.PGHOST || process.env.DATABASE_URL;

let pool = null;
let sqliteDb = null;

// ── PostgreSQL Setup ──────────────────────────────────────────────────────────
if (usePostgres) {
  const { Pool } = require('pg');

  // Individual env vars take precedence over DATABASE_URL
  const poolConfig = process.env.PGHOST
    ? {
        host: process.env.PGHOST,
        port: parseInt(process.env.PGPORT, 10) || 5432,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
      }
    : { connectionString: process.env.DATABASE_URL };

  // Production PostgreSQL providers (Railway, Render, Neon, etc.) require SSL
  if (process.env.NODE_ENV === 'production') {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  pool = new Pool(poolConfig);

  pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL pool error:', err.message);
  });

  console.log('[database] Using PostgreSQL');
}
// ── SQLite Setup ──────────────────────────────────────────────────────────────
else {
  let Database;
  try {
    Database = require('better-sqlite3');
  } catch (e) {
    console.error('[database] better-sqlite3 not installed. Install with: npm install better-sqlite3');
    console.error('[database] Note: better-sqlite3 requires Visual Studio Build Tools on Windows.');
    console.error('[database] For local dev without build tools, use PostgreSQL (Docker) or install build tools.');
    throw new Error('better-sqlite3 module not found. Install it or use PostgreSQL via PGHOST/DATABASE_URL env vars.');
  }

  // Ensure data directory exists
  const dataDir = path.resolve(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.resolve(dataDir, 'drape.db');
  sqliteDb = new Database(dbPath);
  sqliteDb.pragma('journal_mode = WAL');
  sqliteDb.pragma('foreign_keys = ON');

  console.log('[database] Using SQLite:', dbPath);
}

// ── Dialect Helpers ───────────────────────────────────────────────────────────
// Convert ? placeholders to $1, $2, ... for pg parameterized queries
function toPgParams(sql) {
  let i = 1;
  return sql.replace(/\?/g, () => `$${i++}`);
}

// ── Unified Async Helpers ─────────────────────────────────────────────────────

/**
 * Execute a write query (INSERT, UPDATE, DELETE)
 * @returns {Promise<{id: number|null, changes: number}>}
 */
async function run(sql, params = []) {
  if (usePostgres) {
    // Auto-append RETURNING id for INSERT statements so result.id works
    let pgSql = toPgParams(sql);
    if (/^\s*INSERT\b/i.test(sql) && !/\bRETURNING\b/i.test(sql)) {
      pgSql += ' RETURNING id';
    }
    const client = await pool.connect();
    try {
      const result = await client.query(pgSql, params);
      return { id: result.rows[0]?.id || null, changes: result.rowCount };
    } finally {
      client.release();
    }
  } else {
    // SQLite: synchronous but wrapped in promise for consistent API
    const stmt = sqliteDb.prepare(sql);
    const result = stmt.run(...params);
    return { id: result.lastInsertRowid, changes: result.changes };
  }
}

/**
 * Execute a query and return the first row
 * @returns {Promise<Object|null>}
 */
async function get(sql, params = []) {
  if (usePostgres) {
    const client = await pool.connect();
    try {
      const result = await client.query(toPgParams(sql), params);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  } else {
    const stmt = sqliteDb.prepare(sql);
    return stmt.get(...params) || null;
  }
}

/**
 * Execute a query and return all rows
 * @returns {Promise<Array>}
 */
async function all(sql, params = []) {
  if (usePostgres) {
    const client = await pool.connect();
    try {
      const result = await client.query(toPgParams(sql), params);
      return result.rows;
    } finally {
      client.release();
    }
  } else {
    const stmt = sqliteDb.prepare(sql);
    return stmt.all(...params);
  }
}

/**
 * Execute multiple operations in a transaction
 * @param {Function} ops - Callback receiving {run, get, all} bound to transaction
 * @returns {Promise<any>}
 */
async function transaction(ops) {
  if (usePostgres) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const db = {
        run: (s, p) =>
          client
            .query(toPgParams(s), p)
            .then((r) => ({ id: r.rows[0]?.id || null, changes: r.rowCount })),
        get: (s, p) => client.query(toPgParams(s), p).then((r) => r.rows[0] || null),
        all: (s, p) => client.query(toPgParams(s), p).then((r) => r.rows),
      };

      const result = await ops(db);
      await client.query('COMMIT');
      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } else {
    // SQLite transaction
    const tx = sqliteDb.transaction((opsFn) => {
      const db = {
        run: (s, p) => {
          const stmt = sqliteDb.prepare(s);
          const result = stmt.run(...p);
          return { id: result.lastInsertRowid, changes: result.changes };
        },
        get: (s, p) => {
          const stmt = sqliteDb.prepare(s);
          return stmt.get(...p) || null;
        },
        all: (s, p) => {
          const stmt = sqliteDb.prepare(s);
          return stmt.all(...p);
        },
      };
      return opsFn(db);
    });
    return tx(ops);
  }
}

/**
 * Initialize database schema (creates tables if not exist)
 * For PostgreSQL, this is a subset; full schema is in migrations/001_initial.sql
 * For SQLite, this creates the full schema.
 */
async function initDatabase() {
  if (usePostgres) {
    // PostgreSQL: minimal init — full schema managed by migrations
    // Just ensure we can connect
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
    } finally {
      client.release();
    }
  } else {
    // SQLite: create full schema
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'customer',
        fname TEXT,
        lname TEXT,
        phone TEXT,
        address TEXT,
        city TEXT,
        postcode TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        vendor TEXT NOT NULL,
        price INTEGER NOT NULL,
        orig_price INTEGER,
        stock INTEGER NOT NULL DEFAULT 0,
        emoji TEXT,
        colors_json TEXT,
        sizes_json TEXT,
        description TEXT,
        badge TEXT,
        sold INTEGER DEFAULT 0,
        material TEXT,
        care TEXT,
        origin TEXT,
        subs_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT NOT NULL UNIQUE,
        customer_id INTEGER REFERENCES users(id),
        customer_fname TEXT,
        customer_lname TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        city TEXT,
        postcode TEXT,
        items_json TEXT NOT NULL,
        subtotal INTEGER NOT NULL,
        shipping INTEGER NOT NULL,
        total INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        payment_method TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT NOT NULL UNIQUE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        ip_address TEXT,
        user_agent TEXT,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS login_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_address TEXT NOT NULL,
        username_attempted TEXT,
        success BOOLEAN NOT NULL DEFAULT 0,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
      CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
    `);

    // Add share_count column if missing (for existing databases)
    try {
      sqliteDb.exec(`ALTER TABLE products ADD COLUMN share_count INTEGER DEFAULT 0`);
    } catch (e) {
      // Column already exists — ignore
    }
  }
}

/**
 * Close database connections (for graceful shutdown)
 */
async function close() {
  if (usePostgres && pool) {
    await pool.end();
  } else if (sqliteDb) {
    sqliteDb.close();
  }
}

// ── Exports ───────────────────────────────────────────────────────────────────

module.exports = {
  pool,
  sqliteDb,
  run,
  get,
  all,
  transaction,
  initDatabase,
  close,
  isPostgres: usePostgres,
};