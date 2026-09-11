const { run } = require('../database');

function logLoginAttempt(req, username, success) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  
  run(
    'INSERT INTO login_attempts (ip_address, username_attempted, success, user_agent) VALUES (?, ?, ?, ?)',
    [ip, username || 'unknown', success ? 1 : 0, userAgent]
  ).catch(err => {
    console.error('Failed to log login attempt:', err);
  });
}

function requestLogger(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${ip} ${req.method} ${req.path}`);
  next();
}

module.exports = {
  logLoginAttempt,
  requestLogger
};
