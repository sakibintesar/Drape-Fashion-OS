/**
 * DRAPE Fashion OS — Social Hub API Routes
 *
 * Handles platform connections, posting, history, and AI caption generation.
 */

require('dotenv').config();
const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const logger = require('../logger');
const { ERROR_CODES, sendError } = require('../lib/errors');
const { run, get, all } = require('../database');
const { createPlatforms } = require('../services/socialPlatforms');

// Create platform instances with database access
const platforms = createPlatforms({ get, run });

// ── GET /api/social/platforms — List all platform connections ─────────────────
router.get('/platforms', authenticateToken, async (req, res) => {
  try {
    const connections = await all('SELECT platform, platform_user_id, page_id, connected_at, expires_at FROM social_connections');
    const connected = new Set(connections.map(c => c.platform));

    const status = {
      meta: connected.has('meta') ? {
        connected: true,
        connected_at: connections.find(c => c.platform === 'meta')?.connected_at,
        expires_at: connections.find(c => c.platform === 'meta')?.expires_at
      } : { connected: false },
      tiktok: connected.has('tiktok') ? {
        connected: true,
        connected_at: connections.find(c => c.platform === 'tiktok')?.connected_at,
        expires_at: connections.find(c => c.platform === 'tiktok')?.expires_at
      } : { connected: false },
      linkedin: connected.has('linkedin') ? {
        connected: true,
        connected_at: connections.find(c => c.platform === 'linkedin')?.connected_at,
        expires_at: connections.find(c => c.platform === 'linkedin')?.expires_at
      } : { connected: false },
    };

    // Instagram shares Meta connection
    status.instagram = status.meta;

    res.json({ platforms: status });
  } catch (err) {
    logger.error('[social] Get platforms error', { message: err.message });
    sendError(res, 500, 'Failed to get platforms', ERROR_CODES.INTERNAL_ERROR);
  }
});

// ── POST /api/social/connect — Save OAuth token for a platform ────────────────
router.post('/connect', authenticateToken, async (req, res) => {
  try {
    const { platform, access_token, refresh_token, expires_in, platform_user_id, page_id } = req.body;

    if (!platform || !access_token) {
      return sendError(res, 400, 'Platform and access_token required', ERROR_CODES.VALIDATION_ERROR);
    }

    if (!platforms[platform]) {
      return sendError(res, 400, `Unknown platform: ${platform}`, ERROR_CODES.VALIDATION_ERROR);
    }

    const expires_at = expires_in ? new Date(Date.now() + expires_in * 1000).toISOString() : null;

    await platforms[platform].saveConnection({
      access_token,
      refresh_token: refresh_token || null,
      expires_at,
      platform_user_id: platform_user_id || null,
      page_id: page_id || null
    });

    res.json({ success: true, platform, message: `${platform} connected` });
  } catch (err) {
    logger.error('[social] Connect error', { message: err.message });
    sendError(res, 500, 'Failed to connect platform', ERROR_CODES.INTERNAL_ERROR);
  }
});

// ── DELETE /api/social/disconnect/:platform — Remove platform connection ──────
router.delete('/disconnect/:platform', authenticateToken, async (req, res) => {
  try {
    const { platform } = req.params;
    if (!platforms[platform]) {
      return sendError(res, 400, `Unknown platform: ${platform}`, ERROR_CODES.VALIDATION_ERROR);
    }

    await platforms[platform].disconnect();
    res.json({ success: true, platform, message: `${platform} disconnected` });
  } catch (err) {
    logger.error('[social] Disconnect error', { message: err.message });
    sendError(res, 500, 'Failed to disconnect platform', ERROR_CODES.INTERNAL_ERROR);
  }
});

// ── POST /api/social/post — Post to one or all connected platforms ────────────
router.post('/post', authenticateToken, async (req, res) => {
  try {
    const { platforms: targetPlatforms, content, media_url } = req.body;

    if (!content || !content.trim()) {
      return sendError(res, 400, 'Content is required', ERROR_CODES.VALIDATION_ERROR);
    }

    // If no platforms specified, post to all connected
    let platformsToPost = targetPlatforms;
    if (!platformsToPost || !platformsToPost.length) {
      const connections = await all('SELECT platform FROM social_connections');
      platformsToPost = connections.map(c => c.platform);
    }

    // Deduplicate and handle instagram -> meta
    const uniquePlatforms = [...new Set(platformsToPost)];
    const results = [];

    for (const platform of uniquePlatforms) {
      if (!platforms[platform]) {
        results.push({ platform, error: 'Unknown platform' });
        continue;
      }
      try {
        const platformResults = await platforms[platform].post(content.trim(), media_url || null);
        results.push(...platformResults);
      } catch (err) {
        logger.error(`[social] ${platform} post error`, { message: err.message });
        results.push({ platform, error: err.message });
      }
    }

    const success = results.filter(r => r.postId).length;
    const failed = results.filter(r => r.error).length;

    res.json({
      success,
      failed,
      total: results.length,
      results
    });
  } catch (err) {
    logger.error('[social] Post error', { message: err.message });
    sendError(res, 500, 'Failed to post', ERROR_CODES.INTERNAL_ERROR);
  }
});

// ── GET /api/social/history — Get post history ────────────────────────────────
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
    const offset = Math.max(0, parseInt(req.query.offset) || 0);

    const posts = await all(
      `SELECT id, platform, content, media_url, platform_post_id, status, posted_at, error, created_at
       FROM social_posts
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const totalResult = await get('SELECT COUNT(*) as total FROM social_posts');
    const total = totalResult?.total || 0;

    res.json({ posts, total, limit, offset });
  } catch (err) {
    logger.error('[social] History error', { message: err.message });
    sendError(res, 500, 'Failed to get history', ERROR_CODES.INTERNAL_ERROR);
  }
});

// ── POST /api/social/ai-caption — Generate AI caption for a platform ──────────
router.post('/ai-caption', authenticateToken, async (req, res) => {
  const { platform, topic } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return sendError(res, 503, 'AI service not configured', ERROR_CODES.AI_SERVICE_ERROR);
  }

  const prompts = {
    instagram: `Write an engaging Instagram caption for DRAPE, a premium Bangladesh fashion brand with 5 artisan vendor partners. Topic: ${topic || 'new collection'}. Include 5 relevant hashtags. Tone: aspirational, modern, South Asian. Under 150 words.`,
    facebook: `Write a Facebook post for DRAPE fashion. Warm, community-focused tone. Mention one of our brands: LOOM & GRACE (dresses), THREAD REPUBLIC (tops), NAKSHI STUDIO (ethnic), ZEPHYR CUTS (tailored), ADORN CO. (accessories). Topic: ${topic || 'new collection'}. Under 200 words.`,
    tiktok: `Write a TikTok caption + 3-line script hook for DRAPE, a fashion brand in Bangladesh. Topic: ${topic || 'new collection'}. Gen-Z friendly, trendy. Include trending hashtags. Under 100 words.`,
    linkedin: `Write a LinkedIn post for DRAPE, a fashion-tech company in Bangladesh. Professional, founder-voice tone. Focus on sustainability, brand partnerships, or business growth. Topic: ${topic || 'new collection'}. Under 250 words.`,
    scheduler: `Write a cross-platform social media post for DRAPE fashion Bangladesh. Topic: ${topic || 'new collection'}. Versatile, engaging. Under 150 words.`
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
      logger.error('Anthropic API error', { status: response.status, message: err });
      return sendError(res, 502, 'AI service error', ERROR_CODES.AI_SERVICE_ERROR);
    }

    const data = await response.json();
    res.json({ text: data.content?.[0]?.text || '' });
  } catch (err) {
    logger.error('AI proxy error', { message: err.message, stack: err.stack });
    sendError(res, 500, 'AI service unavailable', ERROR_CODES.AI_SERVICE_ERROR);
  }
});

// ── GET /api/social/oauth/:platform — Get OAuth URL for platform ──────────────
router.get('/oauth/:platform', authenticateToken, (req, res) => {
  const { platform } = req.params;
  const baseUrl = process.env.BASE_URL || 'https://drape-fashion-os.onrender.com';
  const redirectUri = `${baseUrl}/api/social/callback/${platform}`;

  const oauthUrls = {
    meta: `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.META_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish,instagram_manage_insights&response_type=code`,
    tiktok: `https://www.tiktok.com/v2/auth/authorize/?client_key=${process.env.TIKTOK_CLIENT_KEY}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user.info.basic,video.publish,video.list&response_type=code&state=drape`,
    linkedin: `https://www.linkedin.com/oauth/v2/authorization?client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=w_member_social,r_organization_social,rw_organization_admin&response_type=code&state=drape`
  };

  const url = oauthUrls[platform];
  if (!url) {
    return sendError(res, 400, `Unknown platform: ${platform}`, ERROR_CODES.VALIDATION_ERROR);
  }

  res.json({ url });
});

// ── GET /api/social/callback/:platform — OAuth callback handler ───────────────
router.get('/callback/:platform', async (req, res) => {
  const { platform } = req.params;
  const { code, error, error_description } = req.query;

  if (error) {
    logger.error('[social] OAuth error', { platform, error, error_description });
    return res.redirect(`${process.env.FRONTEND_URL || 'https://drape-fashion-os.onrender.com'}/?social_error=${encodeURIComponent(error_description || error)}`);
  }

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL || 'https://drape-fashion-os.onrender.com'}/?social_error=missing_code`);
  }

  try {
    const baseUrl = process.env.BASE_URL || 'https://drape-fashion-os.onrender.com';
    const redirectUri = `${baseUrl}/api/social/callback/${platform}`;
    let tokenData;

    if (platform === 'meta') {
      // Exchange code for access token
      const tokenRes = await fetch('https://graph.facebook.com/v19.0/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.META_APP_ID,
          client_secret: process.env.META_APP_SECRET,
          redirect_uri: redirectUri,
          code
        })
      });
      tokenData = await tokenRes.json();

      if (tokenData.access_token) {
        // Get user info and pages
        const meRes = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name&access_token=${tokenData.access_token}`);
        const meData = await meRes.json();

        const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?fields=id,name,instagram_business_account&access_token=${tokenData.access_token}`);
        const pagesData = await pagesRes.json();

        // Use first page with Instagram account, or first page
        const pageWithIg = pagesData.data?.find(p => p.instagram_business_account);
        const page = pageWithIg || pagesData.data?.[0];

        if (page) {
          await platforms.meta.saveConnection({
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token || null,
            expires_in: tokenData.expires_in,
            platform_user_id: meData.id,
            page_id: page.id
          });
        }
      }
    } else if (platform === 'tiktok') {
      const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_key: process.env.TIKTOK_CLIENT_KEY,
          client_secret: process.env.TIKTOK_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        })
      });
      tokenData = await tokenRes.json();

      if (tokenData.access_token) {
        // Get user info
        const userRes = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const userData = await userRes.json();

        await platforms.tiktok.saveConnection({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || null,
          expires_in: tokenData.expires_in,
          platform_user_id: userData.data?.user?.open_id
        });
      }
    } else if (platform === 'linkedin') {
      const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET
        })
      });
      tokenData = await tokenRes.json();

      if (tokenData.access_token) {
        // Get organization info
        const orgRes = await fetch('https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee&projection=(elements*(organizationalTarget~))', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const orgData = await orgRes.json();
        const orgUrn = orgData.elements?.[0]?.organizationalTarget;

        await platforms.linkedin.saveConnection({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || null,
          expires_in: tokenData.expires_in,
          platform_user_id: orgUrn?.replace('urn:li:organization:', '')
        });
      }
    }

    // Redirect back to social page with success
    const frontendUrl = process.env.FRONTEND_URL || 'https://drape-fashion-os.onrender.com';
    res.redirect(`${frontendUrl}/?social_connected=${platform}`);
  } catch (err) {
    logger.error('[social] OAuth callback error', { platform, message: err.message });
    const frontendUrl = process.env.FRONTEND_URL || 'https://drape-fashion-os.onrender.com';
    res.redirect(`${frontendUrl}/?social_error=${encodeURIComponent(err.message)}`);
  }
});

module.exports = router;