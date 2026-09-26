require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

const USE_PG = !!process.env.DATABASE_URL;

let db = null;
let pool = null;
let pgClient = null;

if (USE_PG) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  console.log('Using PostgreSQL database');
} else {
  const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'drape.db');
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Database connection failed:', err.message);
      process.exit(1);
    }
    console.log('Connected to SQLite database at', DB_PATH);
  });
  db.run('PRAGMA journal_mode = WAL;');
  db.run('PRAGMA foreign_keys = ON;');
}

function dialect(sql) {
  if (!USE_PG) return sql;
  // Convert ? placeholders to $1, $2, ...
  let i = 1;
  return sql.replace(/\?/g, () => `$${i++}`);
}

function nowSQL() {
  return USE_PG ? 'CURRENT_TIMESTAMP' : "datetime('now')";
}

function autoIncrement() {
  return USE_PG ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
}

function datetimeDefault() {
  return USE_PG ? 'DEFAULT CURRENT_TIMESTAMP' : 'DEFAULT CURRENT_TIMESTAMP';
}

// SQLite helpers
function sqliteRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function sqliteGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function sqliteAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// PostgreSQL helpers
async function pgRun(sql, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(dialect(sql), params);
    return { id: result.rows[0]?.id || null, changes: result.rowCount };
  } finally {
    client.release();
  }
}

async function pgGet(sql, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(dialect(sql), params);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

async function pgAll(sql, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(dialect(sql), params);
    return result.rows;
  } finally {
    client.release();
  }
}

// Unified interface
function run(sql, params = []) {
  return USE_PG ? pgRun(sql, params) : sqliteRun(sql, params);
}

function get(sql, params = []) {
  return USE_PG ? pgGet(sql, params) : sqliteGet(sql, params);
}

function all(sql, params = []) {
  return USE_PG ? pgAll(sql, params) : sqliteAll(sql, params);
}

// Transaction support
async function transaction(ops) {
  if (USE_PG) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await ops({
        run: (s, p) =>
          client
            .query(dialect(s), p)
            .then((r) => ({ id: r.rows[0]?.id || null, changes: r.rowCount })),
        get: (s, p) => client.query(dialect(s), p).then((r) => r.rows[0] || null),
        all: (s, p) => client.query(dialect(s), p).then((r) => r.rows)
      });
      await client.query('COMMIT');
      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } else {
    return new Promise((resolve, reject) => {
      db.run('BEGIN TRANSACTION', async (err) => {
        if (err) {
          reject(err);
          return;
        }
        try {
          const tRun = (s, p) => sqliteRun(s, p);
          const tGet = (s, p) => sqliteGet(s, p);
          const tAll = (s, p) => sqliteAll(s, p);
          const result = await ops({ run: tRun, get: tGet, all: tAll });
          db.run('COMMIT', (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        } catch (e) {
          db.run('ROLLBACK', () => reject(e));
        }
      });
    });
  }
}

async function initDatabase() {
  if (USE_PG) {
    // PostgreSQL initialization
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
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
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
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
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
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
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id SERIAL PRIMARY KEY,
        token TEXT NOT NULL UNIQUE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        ip_address TEXT,
        user_agent TEXT,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS login_attempts (
        id SERIAL PRIMARY KEY,
        ip_address TEXT NOT NULL,
        username_attempted TEXT,
        success BOOLEAN NOT NULL DEFAULT false,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if customer_id column exists in orders (for migration)
    try {
      await pool.query(`SELECT customer_id FROM orders LIMIT 1`);
    } catch (e) {
      // Column doesn't exist, add it
      await pool.query(`ALTER TABLE orders ADD COLUMN customer_id INTEGER REFERENCES users(id)`);
      await pool.query(`ALTER TABLE orders ADD COLUMN customer_fname TEXT`);
      await pool.query(`ALTER TABLE orders ADD COLUMN customer_lname TEXT`);
    }

    // payment_sessions table for SSLCommerz payment integration
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payment_sessions (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL UNIQUE,
        order_id TEXT NOT NULL,
        amount INTEGER NOT NULL,
        currency TEXT NOT NULL DEFAULT 'BDT',
        status TEXT NOT NULL DEFAULT 'pending',
        tran_id TEXT,
        val_id TEXT,
        card_type TEXT,
        card_no TEXT,
        bank_tran_id TEXT,
        gateway_response_json TEXT,
        idempotency_key TEXT UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_payment_sessions_order_id ON payment_sessions(order_id)`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_payment_sessions_idempotency_key ON payment_sessions(idempotency_key)`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_payment_sessions_val_id ON payment_sessions(val_id)`
    );

    // webhook_logs table for payment webhook auditing
    await pool.query(`
      CREATE TABLE IF NOT EXISTS webhook_logs (
        id SERIAL PRIMARY KEY,
        source TEXT NOT NULL,
        event_type TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        headers_json TEXT,
        verified BOOLEAN NOT NULL DEFAULT FALSE,
        processing_result TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_webhook_logs_source_event ON webhook_logs(source, event_type)`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_webhook_logs_verified ON webhook_logs(verified)`
    );

    // Migration: add idempotency_key if table exists without it
    try {
      await pool.query(`SELECT idempotency_key FROM payment_sessions LIMIT 1`);
    } catch (e) {
      await pool.query(`ALTER TABLE payment_sessions ADD COLUMN idempotency_key TEXT UNIQUE`);
      await pool.query(
        `CREATE INDEX IF NOT EXISTS idx_payment_sessions_idempotency_key ON payment_sessions(idempotency_key)`
      );
    }

    return;
  }

  // SQLite initialization
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS products (
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT NOT NULL UNIQUE,
        customer_id INTEGER,
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT NOT NULL UNIQUE,
        user_id INTEGER NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS login_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_address TEXT NOT NULL,
        username_attempted TEXT,
        success BOOLEAN NOT NULL DEFAULT 0,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // payment_sessions table for SSLCommerz payment integration
      db.run(`CREATE TABLE IF NOT EXISTS payment_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL UNIQUE,
        order_id TEXT NOT NULL,
        amount INTEGER NOT NULL,
        currency TEXT NOT NULL DEFAULT 'BDT',
        status TEXT NOT NULL DEFAULT 'pending',
        tran_id TEXT,
        val_id TEXT,
        card_type TEXT,
        card_no TEXT,
        bank_tran_id TEXT,
        gateway_response_json TEXT,
        idempotency_key TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // webhook_logs table for payment webhook auditing
      db.run(`CREATE TABLE IF NOT EXISTS webhook_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT NOT NULL,
        event_type TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        headers_json TEXT,
        verified BOOLEAN NOT NULL DEFAULT 0,
        processing_result TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Create indexes for payment_sessions
      db.run(
        `CREATE INDEX IF NOT EXISTS idx_payment_sessions_order_id ON payment_sessions(order_id)`
      );
      db.run(
        `CREATE INDEX IF NOT EXISTS idx_payment_sessions_idempotency_key ON payment_sessions(idempotency_key)`
      );
      db.run(`CREATE INDEX IF NOT EXISTS idx_payment_sessions_val_id ON payment_sessions(val_id)`);

      // Create indexes for webhook_logs
      db.run(
        `CREATE INDEX IF NOT EXISTS idx_webhook_logs_source_event ON webhook_logs(source, event_type)`
      );
      db.run(`CREATE INDEX IF NOT EXISTS idx_webhook_logs_verified ON webhook_logs(verified)`);

      // Migration: add idempotency_key if table exists without it (SQLite doesn't support IF NOT EXISTS for columns)
      db.run(
        `CREATE INDEX IF NOT EXISTS idx_payment_sessions_idempotency_key_unique ON payment_sessions(idempotency_key)`,
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  });
}

module.exports = {
  db,
  pool,
  initDatabase,
  run,
  get,
  all,
  transaction,
  USE_PG
};
