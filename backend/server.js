require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./database');
const { requestLogger } = require('./middleware/logger');
const { apiLimiter } = require('./middleware/rateLimiter');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const analyticsRoutes = require('./routes/analytics');
const customerRoutes = require('./routes/customers');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
// Admin panel is served at a non-default, configurable path rather than the
// predictable /admin.html — set ADMIN_PATH in your env for a unique value per deploy.
const ADMIN_PATH = '/' + (process.env.ADMIN_PATH || 'portal-3ee0946b').replace(/^\/+/, '');

// ── Security headers ──
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  if (NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);

// ── CORS ──
app.use(cors({
  origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(',').map(s => s.trim()),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
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

// ── Admin portal + guarded static serving ──
// NOTE: frontend files live at the repo root (one level up from backend/), which
// also contains backend/, package.json, README.md, .env.example, etc. We must NOT
// blanket-static the whole repo root — that would expose server source code and
// config files over HTTP. Instead, only these specific public assets are servable.
const frontendPath = path.resolve(__dirname, '..');
const PUBLIC_ASSETS = ['app.js', 'admin.js', 'styles.css'];

// Block the literal, guessable filename outright.
app.get('/admin.html', (req, res) => res.status(404).end());

// Serve the admin portal only at the configured secret path.
app.get(ADMIN_PATH, (req, res) => res.sendFile(path.join(frontendPath, 'admin.html')));

// Serve the storefront explicitly at root.
app.get('/', (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));

// Explicit allowlist for shared JS/CSS assets — nothing else at repo root is servable.
for (const asset of PUBLIC_ASSETS) {
  app.get('/' + asset, (req, res) => res.sendFile(path.join(frontendPath, asset)));
}

// SPA fallback for any other non-API, non-asset route — never falls through to
// filesystem listing or exposes backend/ source.
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/') || req.path === '/admin.html') {
    return res.status(404).end();
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ── Global error handler ──
app.use((err, req, res, next) => {
  console.error('[Error]', err.message, err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ── 404 for unknown API routes ──
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

async function startServer() {
  try {
    await initDatabase();
    console.log('✅ Database ready');
    app.listen(PORT, () => {
      console.log(`\n🚀 DRAPE Fashion OS v4 running`);
      console.log(`   Port      : ${PORT}`);
      console.log(`   Env       : ${NODE_ENV}`);
      console.log(`   CORS      : ${CORS_ORIGIN}`);
      console.log(`   Health    : http://localhost:${PORT}/api/health`);
      console.log(`   Storefront: http://localhost:${PORT}/`);
      console.log(`   Admin     : http://localhost:${PORT}${ADMIN_PATH}  (set ADMIN_PATH env var to customize)\n`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
