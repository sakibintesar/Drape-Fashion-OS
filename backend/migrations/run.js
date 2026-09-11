#!/usr/bin/env node
/**
 * DRAPE Fashion OS — PostgreSQL Migration Runner
 *
 * Executes all .sql files in this directory in alphabetical order.
 * Tracks applied migrations in a `schema_migrations` table.
 *
 * Usage (standalone):  node backend/migrations/run.js
 * Usage (programmatic): const runMigrations = require('./migrations/run');
 *                       await runMigrations();
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

/**
 * Run all pending migrations. Creates its own pg.Pool if none provided.
 * @param {Pool} [externalPool] - Optional existing pg Pool to reuse
 * @returns {Promise<void>}
 */
async function runMigrations(externalPool) {
  const DATABASE_URL = process.env.DATABASE_URL;
  const PGHOST = process.env.PGHOST;

  if (!DATABASE_URL && !PGHOST && !externalPool) {
    console.log('[migrations] No PostgreSQL configured (DATABASE_URL or PGHOST not set). Skipping migrations.');
    return;
  }

  let pool = externalPool;
  let ownPool = false;

  if (!pool) {
    const poolConfig = PGHOST
      ? {
          host: PGHOST,
          port: parseInt(process.env.PGPORT, 10) || 5432,
          user: process.env.PGUSER,
          password: process.env.PGPASSWORD,
          database: process.env.PGDATABASE,
        }
      : { connectionString: DATABASE_URL };

    pool = new Pool(poolConfig);
    ownPool = true;
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const result = await pool.query('SELECT filename FROM schema_migrations ORDER BY filename');
    const applied = new Set(result.rows.map(r => r.filename));

    const files = fs
      .readdirSync(__dirname)
      .filter(f => f.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('[migrations] No migration files found.');
      return;
    }

    let hasNewMigrations = false;

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`[migrations] Already applied: ${file}`);
        continue;
      }

      hasNewMigrations = true;
      const sql = fs.readFileSync(path.join(__dirname, file), 'utf8');
      console.log(`[migrations] Running: ${file}...`);

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`[migrations] ✓ ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`[migrations] ✗ ${file} failed:`, err.message);
        throw err;
      } finally {
        client.release();
      }
    }

    if (!hasNewMigrations) {
      console.log('[migrations] All migrations already applied. Database is up to date.');
    } else {
      console.log('[migrations] All migrations completed successfully.');
    }
  } finally {
    if (ownPool) {
      await pool.end();
    }
  }
}

// ── Standalone execution ──
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('[migrations] Fatal error:', err.message);
      process.exit(1);
    });
}

module.exports = runMigrations;
