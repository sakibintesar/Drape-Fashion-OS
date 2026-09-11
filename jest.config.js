module.exports = {
  testEnvironment: 'node',
  globalSetup: './backend/__tests__/globalSetup.js',
  setupFiles: ['./backend/__tests__/setup.js'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'backend/routes/**/*.js',
    'backend/middleware/**/*.js',
    'backend/lib/**/*.js',
    '!backend/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  verbose: true,
  forceExit: true,
  // Slow test timeout for bcrypt operations
  testTimeout: 15000,
};
