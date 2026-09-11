/**
 * Standardized error classes and codes for DRAPE API.
 *
 * Usage in routes:
 *   const { AppError, ERROR_CODES } = require('../lib/errors');
 *   throw new AppError(ERROR_CODES.NOT_FOUND, 'Product not found', 404);
 *
 * Or inline:
 *   return next(new AppError(ERROR_CODES.VALIDATION_ERROR, 'Email required', 400));
 */

const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_INVALID: 'AUTH_INVALID',
  AUTH_EXPIRED: 'AUTH_EXPIRED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};

class AppError extends Error {
  constructor(code, message, statusCode = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Send a standardized error response.
 * Falls back to simple { error: string } if code is omitted.
 */
function sendError(res, statusCode, message, code) {
  if (code) {
    return res.status(statusCode).json({ error: { code, message } });
  }
  return res.status(statusCode).json({ error: message });
}

module.exports = { AppError, ERROR_CODES, sendError };
