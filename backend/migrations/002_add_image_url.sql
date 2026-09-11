-- DRAPE Fashion OS — Add image_url column to products table
-- Enables Cloudinary-hosted product images

ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;