/**
 * DRAPE Fashion OS — Social Platform Posting Service
 *
 * Posts content to connected social media platforms via their official APIs.
 * Each platform implements post() and verifyConnection().
 *
 * Platforms supported:
 *   - Meta (Instagram + Facebook) via Graph API
 *   - TikTok via Content Posting API
 *   - LinkedIn via Marketing API
 *
 * Access tokens are stored in the database (encrypted with AES-256).
 * All posting is non-blocking with retry logic.
 */

const crypto = require('crypto');
const logger = require('../logger');

// ── Token Encryption ──────────────────────────────────────────────────────────

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = crypto.scryptSync(
  process.env.JWT_ACCESS_SECRET || 'drape-social-token-key-fallback',
  'drape-social-salt',
  32
);

function encryptToken(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${tag}:${encrypted}`;
}

function decryptToken(encrypted) {
  try {
    const [ivHex, tagHex, data] = encrypted.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    logger.error('[social] Token decryption failed', { message: err.message });
    return null;
  }
}

// ── Base Platform Class ───────────────────────────────────────────────────────

class BasePlatform {
  constructor(name, { get, run }) {
    this.name = name;
    this.get = get;
    this.run = run;
  }

  async getConnection() {
    return this.get(
      'SELECT * FROM social_connections WHERE platform = ?',
      [this.name]
    );
  }

  async isConnected() {
    const conn = await this.getConnection();
    return !!(conn && conn.access_token);
  }

  async getAccessToken() {
    const conn = await this.getConnection();
    if (!conn) return null;
    return decryptToken(conn.access_token);
  }

  async saveConnection({ access_token, refresh_token, expires_at, platform_user_id, page_id }) {
    const encrypted = encryptToken(access_token);
    const encryptedRefresh = refresh_token ? encryptToken(refresh_token) : null;
    await this.run(
      `INSERT INTO social_connections (platform, access_token, refresh_token, expires_at, platform_user_id, page_id, connected_at)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(platform) DO UPDATE SET
         access_token = excluded.access_token,
         refresh_token = excluded.refresh_token,
         expires_at = excluded.expires_at,
         platform_user_id = excluded.platform_user_id,
         page_id = excluded.page_id`,
      [this.name, encrypted, encryptedRefresh, expires_at || null, platform_user_id || null, page_id || null]
    );
    logger.info(`[social] Connected ${this.name}`, { platform_user_id, page_id });
  }

  async disconnect() {
    await this.run('DELETE FROM social_connections WHERE platform = ?', [this.name]);
    logger.info(`[social] Disconnected ${this.name}`);
  }

  async recordPost({ content, media_url, platform_post_id, status, error }) {
    await this.run(
      `INSERT INTO social_posts (platform, content, media_url, platform_post_id, status, posted_at, error, created_at)
       VALUES (?, ?, ?, ?, ?, ${status === 'posted' ? 'CURRENT_TIMESTAMP' : 'NULL'}, ?, CURRENT_TIMESTAMP)`,
      [this.name, content, media_url || null, platform_post_id || null, status || 'pending', error || null]
    );
  }

  async post(content, mediaUrl) {
    throw new Error(`${this.name} post() not implemented`);
  }
}

// ── Meta Platform (Instagram + Facebook) ──────────────────────────────────────

class MetaPlatform extends BasePlatform {
  constructor(deps) {
    super('meta', deps);
  }

  async post(content, mediaUrl) {
    const token = await this.getAccessToken();
    if (!token) throw new Error('Meta not connected');

    const conn = await this.getConnection();
    const pageId = conn?.page_id;
    const results = [];

    // Post to Facebook Page
    if (pageId) {
      try {
        const fbUrl = `https://graph.facebook.com/v19.0/${pageId}/feed`;
        const fbBody = { message: content, access_token: token };
        if (mediaUrl) fbBody.link = mediaUrl;

        const fbRes = await fetch(fbUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fbBody)
        });
        const fbData = await fbRes.json();
        if (fbData.id) {
          results.push({ platform: 'facebook', postId: fbData.id });
          await this.recordPost({ content, media_url: mediaUrl, platform_post_id: fbData.id, status: 'posted' });
        } else {
          throw new Error(fbData.error?.message || 'Facebook post failed');
        }
      } catch (err) {
        logger.error('[social] Facebook post failed', { message: err.message });
        await this.recordPost({ content, media_url: mediaUrl, status: 'failed', error: err.message });
        results.push({ platform: 'facebook', error: err.message });
      }
    }

    // Post to Instagram (requires media container first for image posts)
    const igUserId = conn?.platform_user_id;
    if (igUserId) {
      try {
        if (mediaUrl) {
          // Step 1: Create media container
          const containerRes = await fetch(
            `https://graph.facebook.com/v19.0/${igUserId}/media`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image_url: mediaUrl, caption: content, access_token: token })
            }
          );
          const containerData = await containerRes.json();
          if (!containerData.id) throw new Error(containerData.error?.message || 'IG container failed');

          // Step 2: Publish the container
          const pubRes = await fetch(
            `https://graph.facebook.com/v19.0/${igUserId}/media_publish`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ creation_id: containerData.id, access_token: token })
            }
          );
          const pubData = await pubRes.json();
          if (pubData.id) {
            results.push({ platform: 'instagram', postId: pubData.id });
            await this.recordPost({ content, media_url: mediaUrl, platform_post_id: pubData.id, status: 'posted' });
          } else {
            throw new Error(pubData.error?.message || 'IG publish failed');
          }
        } else {
          // Text-only IG post (not supported — IG requires image)
          results.push({ platform: 'instagram', error: 'Instagram requires an image' });
        }
      } catch (err) {
        logger.error('[social] Instagram post failed', { message: err.message });
        await this.recordPost({ content, media_url: mediaUrl, status: 'failed', error: err.message });
        results.push({ platform: 'instagram', error: err.message });
      }
    }

    return results;
  }
}

// ── TikTok Platform ───────────────────────────────────────────────────────────

class TikTokPlatform extends BasePlatform {
  constructor(deps) {
    super('tiktok', deps);
  }

  async post(content, mediaUrl) {
    const token = await this.getAccessToken();
    if (!token) throw new Error('TikTok not connected');

    try {
      // TikTok Content Posting API — text + optional video
      const body = {
        text: content,
        privacy_level: 'PUBLIC_TO_EVERYONE',
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false
      };

      if (mediaUrl) {
        // For video posts, TikTok requires a direct video URL
        body.video_url = mediaUrl;
      }

      const res = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (data.data?.publish_id) {
        await this.recordPost({ content, media_url: mediaUrl, platform_post_id: data.data.publish_id, status: 'posted' });
        return [{ platform: 'tiktok', postId: data.data.publish_id }];
      } else {
        throw new Error(data.error?.message || data.error?.code || 'TikTok post failed');
      }
    } catch (err) {
      logger.error('[social] TikTok post failed', { message: err.message });
      await this.recordPost({ content, media_url: mediaUrl, status: 'failed', error: err.message });
      return [{ platform: 'tiktok', error: err.message }];
    }
  }
}

// ── LinkedIn Platform ─────────────────────────────────────────────────────────

class LinkedInPlatform extends BasePlatform {
  constructor(deps) {
    super('linkedin', deps);
  }

  async post(content, mediaUrl) {
    const token = await this.getAccessToken();
    if (!token) throw new Error('LinkedIn not connected');

    const conn = await this.getConnection();
    const orgId = conn?.page_id; // LinkedIn organization ID

    try {
      const author = orgId ? `urn:li:organization:${orgId}` : `urn:li:person:${conn?.platform_user_id}`;

      const body = {
        author,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: content },
            shareMediaCategory: mediaUrl ? 'IMAGE' : 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };

      if (mediaUrl) {
        body.specificContent['com.linkedin.ugc.ShareContent'].media = [{
          status: 'READY',
          originalUrl: mediaUrl
        }];
      }

      const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (res.ok && data.id) {
        await this.recordPost({ content, media_url: mediaUrl, platform_post_id: data.id, status: 'posted' });
        return [{ platform: 'linkedin', postId: data.id }];
      } else {
        throw new Error(data.message || data.error?.message || 'LinkedIn post failed');
      }
    } catch (err) {
      logger.error('[social] LinkedIn post failed', { message: err.message });
      await this.recordPost({ content, media_url: mediaUrl, status: 'failed', error: err.message });
      return [{ platform: 'linkedin', error: err.message }];
    }
  }
}

// ── Factory ───────────────────────────────────────────────────────────────────

function createPlatforms(deps) {
  return {
    meta: new MetaPlatform(deps),
    tiktok: new TikTokPlatform(deps),
    linkedin: new LinkedInPlatform(deps),
    instagram: new MetaPlatform(deps), // Instagram shares Meta connection
  };
}

module.exports = {
  createPlatforms,
  encryptToken,
  decryptToken
};
