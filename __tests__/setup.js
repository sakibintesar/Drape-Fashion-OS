// Set JWT secrets before any module loads (auth.js reads them at require time)
process.env.JWT_ACCESS_SECRET = 'test-access-secret-key-for-jest-only-do-not-use-in-production';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-jest-only-do-not-use-in-production';

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';
