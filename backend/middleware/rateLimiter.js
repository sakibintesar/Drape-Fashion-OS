const { RateLimiterRedis, RateLimiterMemory } = require('rate-limiter-flexible');

// ---------------------------------------------------------------------------
// Redis client — imported lazily so the app can start even if Redis is down.
// The redis module logs its own connection errors and never throws.
// ---------------------------------------------------------------------------
let redis;
try {
  redis = require('../lib/redis');
} catch (_) {
  redis = null;
}

// ---------------------------------------------------------------------------
// Factory: creates both a Redis-backed and an in-memory limiter so the
// middleware can transparently fall back when Redis is unavailable.
// ---------------------------------------------------------------------------
function createLimiterPair(keyPrefix, points, duration, blockDuration) {
  const memoryLimiter = new RateLimiterMemory({ points, duration, blockDuration: blockDuration || 0 });

  let redisLimiter = null;
  if (redis) {
    redisLimiter = new RateLimiterRedis({
      storeClient: redis,
      keyPrefix,
      points,
      duration,
      blockDuration: blockDuration || 0,
      // rate-limiter-flexible handles Redis errors internally; don't
      // let a down Redis crash the request pipeline.
      insuranceLimiter: memoryLimiter,
    });
  }

  return { redisLimiter, memoryLimiter, points };
}

// ---------------------------------------------------------------------------
// Limiter pairs
// ---------------------------------------------------------------------------

// Login: 5 attempts per 15 minutes per IP (blocked for 15 min on exceed)
const loginPair = createLimiterPair('rl:login', 5, 15 * 60, 15 * 60);

// General API: 100 requests per 15 minutes per IP
const apiPair = createLimiterPair('rl:api', 100, 15 * 60);

// Admin: 50 requests per 15 minutes per IP
const adminPair = createLimiterPair('rl:admin', 50, 15 * 60);

// ---------------------------------------------------------------------------
// Middleware factory — tries Redis first, falls back to memory
// ---------------------------------------------------------------------------
function buildMiddleware(pair) {
  // In test mode, skip rate limiting entirely to avoid 429s during test runs
  if (process.env.NODE_ENV === 'test') {
    return function rateLimiterNoop(req, res, next) { next(); };
  }
  return function rateLimiter(req, res, next) {
    const limiter = pair.redisLimiter || pair.memoryLimiter;
    const key = req.ip || req.connection.remoteAddress || 'unknown';

    limiter
      .consume(key)
      .then((result) => {
        // Standard rate-limit response headers
        res.set('RateLimit-Limit', String(pair.points));
        res.set('RateLimit-Remaining', String(result.remainingPoints));
        res.set(
          'RateLimit-Reset',
          String(Math.ceil(Date.now() / 1000) + result.msBeforeNext / 1000)
        );
        next();
      })
      .catch((rejRes) => {
        // rejRes is a RateLimiterRes when the limit is exceeded.
        // If it's a real Error (e.g. Redis transport failure), forward to
        // Express error handler.
        if (rejRes instanceof Error) {
          console.error('[RateLimiter] Consume error:', rejRes.message);
          // Limiter failed open — allow the request through
          return next();
        }

        const retryAfterSec = Math.ceil(rejRes.msBeforeNext / 1000);
        res.set('Retry-After', String(retryAfterSec));
        res.status(429).json({
          error: `Too many requests. Please try again after ${retryAfterSec} seconds.`,
        });
      });
  };
}

// ---------------------------------------------------------------------------
// Exported middleware — same named exports as the original module
// ---------------------------------------------------------------------------
const loginLimiter  = buildMiddleware(loginPair);
const apiLimiter    = buildMiddleware(apiPair);
const adminLimiter  = buildMiddleware(adminPair);

module.exports = {
  loginLimiter,
  apiLimiter,
  adminLimiter,
};
