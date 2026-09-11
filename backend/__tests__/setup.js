/**
 * DRAPE Test Setup — runs BEFORE each test file's modules are required.
 *
 * Uses the Docker PostgreSQL instance (localhost:5432) for tests.
 * Falls back to SQLite if PostgreSQL is not available.
 *
 * IMPORTANT: Tests use a separate database (drape_test) to avoid
 * polluting the dev database.
 */
process.env.NODE_ENV = 'test';

// Test JWT secrets
process.env.JWT_ACCESS_SECRET = 'test_access_secret_for_testing_only_64_chars_padding';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_for_testing_only_64_chars_padding';
process.env.JWT_ACCESS_EXPIRY = '15m';
process.env.JWT_REFRESH_EXPIRY = '7d';

// Use Docker PostgreSQL if available, otherwise force SQLite
const PGHOST = process.env.PGHOST || 'localhost';
const PGPORT = process.env.PGPORT || '5432';
const PGUSER = process.env.PGUSER || 'drape';
const PGPASSWORD = process.env.PGPASSWORD || 'drape_secret';
const PGDATABASE = process.env.PGDATABASE || 'drape_test';

// Set PostgreSQL env vars for the database layer
process.env.PGHOST = PGHOST;
process.env.PGPORT = PGPORT;
process.env.PGUSER = PGUSER;
process.env.PGPASSWORD = PGPASSWORD;
process.env.PGDATABASE = PGDATABASE;

// Remove DATABASE_URL to ensure individual PG* vars are used
delete process.env.DATABASE_URL;
