/**
 * Jest globalSetup — runs ONCE before all test suites.
 *
 * Creates the drape_test database and initializes the schema.
 */
const { Pool } = require('pg');

module.exports = async function globalSetup() {
  // Set env vars for this process (globalSetup runs in its own context)
  process.env.NODE_ENV = 'test';
  process.env.PGHOST = process.env.PGHOST || 'localhost';
  process.env.PGPORT = process.env.PGPORT || '5432';
  process.env.PGUSER = process.env.PGUSER || 'drape';
  process.env.PGPASSWORD = process.env.PGPASSWORD || 'drape_secret';
  process.env.PGDATABASE = 'drape_test';

  const adminPool = new Pool({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT, 10) || 5432,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: 'postgres',
  });

  try {
    // Terminate existing connections
    await adminPool.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = 'drape_test' AND pid <> pg_backend_pid()
    `);
    await adminPool.query('DROP DATABASE IF EXISTS drape_test');
    await adminPool.query('CREATE DATABASE drape_test');
    console.log('[globalSetup] Created drape_test database');
  } finally {
    await adminPool.end();
  }
};
