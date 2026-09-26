const { validationResult } = require('express-validator');

// Run after a chain of express-validator checks; short-circuits with 400 on failure.
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Invalid input', details: errors.array().map(e => ({ field: e.path, message: e.msg })) });
  }
  next();
}

// Strips angle brackets so stored/rendered text can't inject HTML/script tags.
// Applied to free-text fields (names, addresses) that get echoed back into the admin UI or emails.
function stripTags(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/[<>]/g, '').trim();
}

module.exports = { handleValidation, stripTags };
