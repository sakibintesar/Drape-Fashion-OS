require('dotenv').config();
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// This endpoint is reachable from the public storefront (no login required) and,
// if a real ANTHROPIC_API_KEY is configured, costs money per call — so it gets its
// own tight limiter on top of the general API limiter.
const aiCaptionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many caption requests from this IP. Please try again later.' }
});

const MOCK_CAPTIONS = {
  instagram: '✨ New drop alert! The SS/26 collection is here — 5 artisan brands, one vision. Crafted in Dhaka, worn everywhere. Which piece speaks to you? 🌿\n\n#DRAPE #DhakaFashion #SustainableStyle #SlowFashion #Bangladesh #ArtisanMade',
  facebook: 'We are thrilled to share the stories behind every stitch. This season, DRAPE partners with 5 incredible artisan brands — from handloom weavers in Old Dhaka to kantha embroiders in Rajshahi. Every purchase supports fair wages and keeps heritage craft alive. Thank you for being part of this journey. 💚',
  tiktok: 'POV: you discover Bangladesh\'s most ethical fashion brand 🇧🇩\n\nHook: "I thought sustainable fashion had to be expensive... then I found DRAPE."\n\n#DRAPE #FashionTok #Bangladesh #OOTD #SustainableStyle',
  linkedin: 'Building a fashion company that runs entirely on systems. No spreadsheets. No gut calls. Just data, design, and five incredible artisan brand partners. Here is what DRAPE FashionOS looks like under the hood. 👇',
  scheduler: '✨ New drop! The SS/26 collection is live. 5 artisan brands, crafted in Dhaka. Shop the full collection at drape.fashion. 🌿 #DRAPE #DhakaFashion #SustainableStyle'
};

const PROMPTS = {
  instagram: 'Write an engaging Instagram caption for DRAPE, a premium Bangladesh fashion brand with 5 artisan vendor partners. Include 5 relevant hashtags. Tone: aspirational, modern, South Asian. Under 150 words.',
  facebook: 'Write a Facebook post for DRAPE fashion. Warm, community-focused tone. Mention one of our brands: LOOM & GRACE (dresses), THREAD REPUBLIC (tops), NAKSHI STUDIO (ethnic), ZEPHYR CUTS (tailored), ADORN CO. (accessories). Under 200 words.',
  tiktok: 'Write a TikTok caption + 3-line script hook for DRAPE, a fashion brand in Bangladesh. Gen-Z friendly, trendy. Include trending hashtags. Under 100 words.',
  linkedin: 'Write a LinkedIn post for DRAPE, a fashion-tech company in Bangladesh. Professional, founder-voice tone. Focus on sustainability, brand partnerships, or business growth. Under 250 words.',
  scheduler: 'Write a cross-platform social media post for DRAPE fashion Bangladesh. Versatile, engaging. Under 150 words.'
};

// POST /api/ai/caption — server-side proxy for the public Social Hub demo.
// Real API key (if configured) never touches the browser; falls back to mock captions otherwise.
router.post('/caption', aiCaptionLimiter, async (req, res) => {
  const { platform } = req.body;
  const prompt = PROMPTS[platform] || PROMPTS.scheduler;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // No key configured — return a mock caption rather than failing the request.
    return res.json({ caption: MOCK_CAPTIONS[platform] || MOCK_CAPTIONS.scheduler, mock: true });
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
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
    if (!upstream.ok) throw new Error(`Upstream ${upstream.status}`);
    const data = await upstream.json();
    const caption = data.content?.[0]?.text || MOCK_CAPTIONS[platform] || MOCK_CAPTIONS.scheduler;
    res.json({ caption, mock: false });
  } catch (err) {
    console.error('AI caption error:', err.message);
    res.json({ caption: MOCK_CAPTIONS[platform] || MOCK_CAPTIONS.scheduler, mock: true });
  }
});

module.exports = router;
