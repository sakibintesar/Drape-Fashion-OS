require('dotenv').config();
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const logger = require('../logger');
const { ERROR_CODES, sendError } = require('../lib/errors');

// POST /api/ai/caption — proxy to Anthropic API (requires auth)
router.post('/caption', authenticateToken, async (req, res) => {
  const { platform } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return sendError(res, 503, 'AI service not configured', ERROR_CODES.AI_SERVICE_ERROR);
  }
  const prompts = {
    instagram: 'Write an engaging Instagram caption for DRAPE, a premium Bangladesh fashion brand with 5 artisan vendor partners. Include 5 relevant hashtags. Tone: aspirational, modern, South Asian. Under 150 words.',
    facebook: 'Write a Facebook post for DRAPE fashion. Warm, community-focused tone. Mention one of our brands: LOOM & GRACE (dresses), THREAD REPUBLIC (tops), NAKSHI STUDIO (ethnic), ZEPHYR CUTS (tailored), ADORN CO. (accessories). Under 200 words.',
    tiktok: 'Write a TikTok caption + 3-line script hook for DRAPE, a fashion brand in Bangladesh. Gen-Z friendly, trendy. Include trending hashtags. Under 100 words.',
    linkedin: 'Write a LinkedIn post for DRAPE, a fashion-tech company in Bangladesh. Professional, founder-voice tone. Focus on sustainability, brand partnerships, or business growth. Under 250 words.',
    scheduler: 'Write a cross-platform social media post for DRAPE fashion Bangladesh. Versatile, engaging. Under 150 words.'
  };
  const prompt = prompts[platform] || prompts.scheduler;
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!response.ok) {
      const err = await response.text();
      logger.error('Anthropic API error', { status: response.status, message: err.message });
      return sendError(res, 502, 'AI service error', ERROR_CODES.AI_SERVICE_ERROR);
    }
    const data = await response.json();
    res.json({ text: data.content?.[0]?.text || '' });
  } catch (err) {
    logger.error('AI proxy error', { message: err.message, stack: err.stack });
    sendError(res, 500, 'AI service unavailable', ERROR_CODES.AI_SERVICE_ERROR);
  }
});

module.exports = router;
