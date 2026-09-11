const express = require('express');
const router = express.Router();

// In-memory store for newsletter subscribers (lightweight for MVP)
// In production, this would be a database table
const subscribers = new Map();

// ── Subscribe to newsletter ──
router.post('/subscribe', (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: { message: 'Please provide a valid email address.' } });
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (subscribers.has(normalizedEmail)) {
    return res.json({ message: 'You are already subscribed!' });
  }

  subscribers.set(normalizedEmail, {
    subscribedAt: new Date().toISOString(),
    source: 'popup'
  });

  console.log(`📬 New subscriber: ${normalizedEmail} (Total: ${subscribers.size})`);

  res.json({ message: 'Successfully subscribed! Welcome to DRAPE.' });
});

// ── Unsubscribe ──
router.post('/unsubscribe', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: { message: 'Email is required.' } });
  }

  const normalizedEmail = email.toLowerCase().trim();
  subscribers.delete(normalizedEmail);

  res.json({ message: 'You have been unsubscribed.' });
});

// ── Admin: List subscribers ──
router.get('/subscribers', (req, res) => {
  const list = Array.from(subscribers.entries()).map(([email, data]) => ({
    email,
    ...data
  }));

  res.json({ subscribers: list, count: list.length });
});

module.exports = router;
