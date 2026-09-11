const Redis = require('ioredis');

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = parseInt(process.env.REDIS_PORT, 10) || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD || undefined,
  retryStrategy(times) {
    // Reconnect with exponential back-off, capped at 30 s
    const delay = Math.min(times * 200, 30000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  lazyConnect: true,          // don't block startup — connect in background
  enableReadyCheck: true,
});

// --- Graceful error handling ---
// Log connection errors instead of crashing the process.
redis.on('error', (err) => {
  console.error('[Redis] Connection error:', err.message);
});

redis.on('connect', () => {
  console.log('[Redis] Connected to', `${REDIS_HOST}:${REDIS_PORT}`);
});

redis.on('reconnecting', (delay) => {
  console.log(`[Redis] Reconnecting in ${delay}ms …`);
});

// Kick off the connection (lazyConnect = true)
redis.connect().catch(() => {
  console.warn('[Redis] Initial connection failed — rate limiter will fall back to in-memory');
});

module.exports = redis;
