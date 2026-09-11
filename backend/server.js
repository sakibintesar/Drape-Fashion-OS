require('dotenv').config();

// ── Environment validation — fail fast with clear message ──
const requiredEnvVars = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
const missing = requiredEnvVars.filter(v => !process.env[v]);
if (missing.length) {
  console.error(`\n❌ FATAL: Missing required environment variables: ${missing.join(', ')}`);
  console.error('   Copy .env.example to .env and fill in the values.');
  console.error('   Generate secrets with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"\n');
  process.exit(1);
}
if (process.env.JWT_ACCESS_SECRET === process.env.JWT_REFRESH_SECRET) {
  console.error('\n❌ FATAL: JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different.');
  console.error('   Generate two separate secrets.\n');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');
const { initDatabase } = require('./database');
const runMigrations = require('./migrations/run');
const { seed } = require('./seed');
const { requestLogger } = require('./middleware/logger');
const { apiLimiter } = require('./middleware/rateLimiter');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const analyticsRoutes = require('./routes/analytics');
const customerRoutes = require('./routes/customers');
const aiRoutes = require('./routes/ai');
const uploadRoutes = require('./routes/upload');
const seoRoutes = require('./routes/seo');
const newsletterRoutes = require('./routes/newsletter');
const reviewRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// ── Security headers ──
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // SECURITY FIX: Add Content-Security-Policy header
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://res.cloudinary.com;");
  if (NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);

// ── CORS ──
// SECURITY FIX: Never allow wildcard (*) with credentials
const corsOrigins = CORS_ORIGIN === '*' ? false : CORS_ORIGIN.split(',').map(s => s.trim());
app.use(cors({
  origin: corsOrigins.length ? corsOrigins : false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: corsOrigins.length > 0
}));

// ── Rate limiting ──
app.use('/api/', apiLimiter);

// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    env: NODE_ENV,
    timestamp: new Date().toISOString(),
    version: '4.0.0'
  });
});

// ── API Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);

// ── SEO Routes (robots.txt, sitemap.xml) ──
app.use('/', seoRoutes);

// ── Newsletter Routes ──
app.use('/api/newsletter', newsletterRoutes);

// ── Review Routes ──
app.use('/api/reviews', reviewRoutes);

// ── Serve frontend ──
const frontendPath = path.resolve(__dirname, '../frontend');
app.use(express.static(frontendPath, {
  etag: true,
  lastModified: true,
  maxAge: NODE_ENV === 'production' ? '1d' : 0
}));

// SPA fallback — send index.html for any non-API route
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  }
});

// ── Global error handler ──
const { AppError, ERROR_CODES } = require('./lib/errors');
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: { code: err.code, message: err.message } });
  }
  logger.error('Unhandled error', { message: err.message, stack: err.stack, path: req.path });
  res.status(500).json({ error: { code: ERROR_CODES.INTERNAL_ERROR, message: 'Internal server error' } });
});

// ── 404 for unknown API routes ──
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: { code: ERROR_CODES.NOT_FOUND, message: 'Endpoint not found' } });
});

async function startServer() {
  try {
    // Ensure logs directory exists
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

    await initDatabase();
    logger.info('Database ready');

    // Run pending migrations (PostgreSQL only — SQLite creates tables in initDatabase)
    await runMigrations();
    logger.info('Migrations complete');

    // Auto-seed: inserts admin user + sample products if database is empty
    await seed({ init: false });
    logger.info('Seed check complete');
    const server = app.listen(PORT, () => {
      logger.info('Server started', { port: PORT, env: NODE_ENV, cors: CORS_ORIGIN });
      logger.info(`Health    : http://localhost:${PORT}/api/health`);
      logger.info(`Storefront: http://localhost:${PORT}/`);
      logger.info(`Admin     : http://localhost:${PORT}/admin.html`);
    });

    // GRACEFUL SHUTDOWN: Handle SIGTERM/SIGINT for clean container stops
    const shutdown = (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(() => {
        logger.info('Server closed.');
        process.exit(0);
      });
      // Force close after 10s
      setTimeout(() => {
        logger.error('Forced shutdown after timeout.');
        process.exit(1);
      }, 10000);
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
