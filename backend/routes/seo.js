/**
 * DRAPE Fashion OS — Enhanced SEO Routes
 *
 * Dynamic sitemap with products, enhanced robots.txt,
 * and SEO data API endpoints.
 */

const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { all, get, run } = require('../database');
const {
  generateSitemapXML,
  generateProductSEO,
  generateMetaTags,
  generateOrgJSONLD,
  generateWebsiteJSONLD,
  generateBreadcrumbJSONLD
} = require('../services/seo');
const logger = require('../logger');
const { ERROR_CODES, sendError } = require('../lib/errors');

const BASE_URL = process.env.BASE_URL || 'https://drape-fashion-os.onrender.com';

// ── robots.txt ────────────────────────────────────────────────────────────────
router.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin.html
Disallow: /*?page=admin

# DRAPE Fashion — Bangladesh's premium fashion platform
Sitemap: ${BASE_URL}/sitemap.xml

User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 2
`);
});

// ── sitemap.xml (dynamic, includes products) ──────────────────────────────────
router.get('/sitemap.xml', async (req, res) => {
  try {
    const products = await all(
      'SELECT id, name, vendor, category, image_url, slug, updated_at, created_at FROM products ORDER BY id'
    );
    const xml = generateSitemapXML(products, BASE_URL);
    res.type('application/xml');
    res.send(xml);
  } catch (err) {
    logger.error('[seo] Sitemap generation error', { message: err.message });
    // Fallback to static sitemap
    const xml = generateSitemapXML([], BASE_URL);
    res.type('application/xml');
    res.send(xml);
  }
});

// ── GET /api/seo/product/:id — SEO data for a product ────────────────────────
router.get('/api/seo/product/:id', async (req, res) => {
  try {
    const product = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) {
      return sendError(res, 404, 'Product not found', ERROR_CODES.NOT_FOUND);
    }

    // Parse JSON fields
    try { product.colors = JSON.parse(product.colors_json || '[]'); } catch { product.colors = []; }
    try { product.sizes = JSON.parse(product.sizes_json || '[]'); } catch { product.sizes = []; }
    try { product.subs = JSON.parse(product.subs_json || '[]'); } catch { product.subs = []; }

    const seoData = generateMetaTags(product, BASE_URL);
    const orgSchema = generateOrgJSONLD(BASE_URL);
    const websiteSchema = generateWebsiteJSONLD(BASE_URL);
    const breadcrumbSchema = generateBreadcrumbJSONLD([
      { name: 'Home', url: '/' },
      { name: product.category, url: `/?page=catalog&cat=${encodeURIComponent(product.category)}` },
      { name: product.name }
    ], BASE_URL);

    res.json({
      product: {
        id: product.id,
        name: product.name,
        vendor: product.vendor,
        category: product.category,
        price: product.price,
        image_url: product.image_url
      },
      seo: seoData,
      schemas: [seoData.jsonLD, orgSchema, websiteSchema, breadcrumbSchema]
    });
  } catch (err) {
    logger.error('[seo] Product SEO error', { message: err.message });
    sendError(res, 500, 'Failed to get SEO data', ERROR_CODES.INTERNAL_ERROR);
  }
});

// ── POST /api/seo/generate — Admin: generate SEO for all products ─────────────
router.post('/api/seo/generate', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const products = await all('SELECT * FROM products ORDER BY id');
    const results = [];

    for (const product of products) {
      try {
        const seo = await generateProductSEO(product, apiKey);
        await run(
          'UPDATE products SET seo_title = ?, seo_description = ?, seo_keywords = ?, slug = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [seo.seo_title, seo.seo_description, seo.seo_keywords, seo.slug, product.id]
        );
        results.push({ id: product.id, name: product.name, seo, status: 'ok' });
      } catch (err) {
        results.push({ id: product.id, name: product.name, error: err.message, status: 'failed' });
      }
    }

    const success = results.filter(r => r.status === 'ok').length;
    const failed = results.filter(r => r.status === 'failed').length;

    res.json({
      success,
      failed,
      total: products.length,
      results
    });
  } catch (err) {
    logger.error('[seo] Batch generate error', { message: err.message });
    sendError(res, 500, 'Failed to generate SEO', ERROR_CODES.INTERNAL_ERROR);
  }
});

// ── POST /api/seo/generate/:id — Admin: generate SEO for one product ──────────
router.post('/api/seo/generate/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) {
      return sendError(res, 404, 'Product not found', ERROR_CODES.NOT_FOUND);
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const seo = await generateProductSEO(product, apiKey);

    await run(
      'UPDATE products SET seo_title = ?, seo_description = ?, seo_keywords = ?, slug = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [seo.seo_title, seo.seo_description, seo.seo_keywords, seo.slug, product.id]
    );

    res.json({ success: true, product: { id: product.id, name: product.name }, seo });
  } catch (err) {
    logger.error('[seo] Product generate error', { message: err.message });
    sendError(res, 500, 'Failed to generate SEO', ERROR_CODES.INTERNAL_ERROR);
  }
});

// ── PUT /api/seo/product/:id — Admin: manually update SEO fields ──────────────
router.put('/api/seo/product/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { seo_title, seo_description, seo_keywords, slug } = req.body;
    const product = await get('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (!product) {
      return sendError(res, 404, 'Product not found', ERROR_CODES.NOT_FOUND);
    }

    await run(
      'UPDATE products SET seo_title = ?, seo_description = ?, seo_keywords = ?, slug = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [seo_title || null, seo_description || null, seo_keywords || null, slug || null, product.id]
    );

    res.json({ success: true, message: 'SEO data updated' });
  } catch (err) {
    logger.error('[seo] Update SEO error', { message: err.message });
    sendError(res, 500, 'Failed to update SEO', ERROR_CODES.INTERNAL_ERROR);
  }
});

// ── GET /api/seo/schemas — Organization + Website schemas ─────────────────────
router.get('/api/seo/schemas', (req, res) => {
  res.json({
    organization: generateOrgJSONLD(BASE_URL),
    website: generateWebsiteJSONLD(BASE_URL)
  });
});

module.exports = router;
