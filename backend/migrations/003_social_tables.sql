-- DRAPE Fashion OS — Social hub tables
-- Supports OAuth connections and post history for Meta, TikTok, LinkedIn

CREATE TABLE IF NOT EXISTS social_connections (
  id SERIAL PRIMARY KEY,
  platform TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  platform_user_id TEXT,
  page_id TEXT,
  connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS social_posts (
  id SERIAL PRIMARY KEY,
  platform TEXT NOT NULL,
  content TEXT NOT NULL,
  media_url TEXT,
  platform_post_id TEXT,
  status TEXT DEFAULT 'pending',
  posted_at TIMESTAMP,
  error TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
