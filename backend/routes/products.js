const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const logger = require('../logger');
const { ERROR_CODES, sendError } = require('../lib/errors');

// GET /api/products/search?q=term — full-text search (FTS5 on SQLite, ILIKE on PostgreSQL)
router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ products: [], total: 0, query: '' });

    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));

    // Detect SQLite vs PostgreSQL
    const { isPostgres } = require('../database');

    let results;
    if (!isPostgres) {
      // SQLite: use FTS5 MATCH with BM25 ranking
      const ftsQuery = q.split(/\s+/).filter(Boolean).map(w => `"${w.replace(/"/g, '""')}"`).join(' ');
      results = await all(
        `SELECT p.*, rank FROM products_fts fts
         JOIN products p ON p.id = fts.rowid
         WHERE products_fts MATCH ?
         ORDER BY rank
         LIMIT ?`,
        [ftsQuery, limit]
      );
    } else {
      // PostgreSQL: use ILIKE for substring matching across key fields
      const pattern = `%${q}%`;
      results = await all(
        `SELECT * FROM products
         WHERE name ILIKE ? OR category ILIKE ? OR vendor ILIKE ? OR description ILIKE ?
         ORDER BY
           CASE WHEN name ILIKE ? THEN 0 ELSE 1 END,
           id
         LIMIT ?`,
        [pattern, pattern, pattern, pattern, pattern, limit]
      );
    }

    const parsed = results.map(p => ({
      ...p,
      colors: tryParse(p.colors_json, []),
      sizes: tryParse(p.sizes_json, []),
      subs: tryParse(p.subs_json, []),
      rank: undefined
    }));

    res.json({ products: parsed, total: parsed.length, query: q });
  } catch (err) {
    logger.error('Product search error', { message: err.message, stack: err.stack });
    // Graceful fallback: return empty if search fails
    res.json({ products: [], total: 0, query: req.query.q || '' });
  }
});

// GET /api/products — public (with optional pagination)
router.get('/', async (req, res) => {
  try {
    // If no pagination params, return all (backward compatible)
    if (!req.query.page && !req.query.limit) {
      const products = await all('SELECT * FROM products ORDER BY id ASC');
      const parsed = products.map(p => ({
        ...p,
        colors: tryParse(p.colors_json, []),
        sizes: tryParse(p.sizes_json, []),
        subs: tryParse(p.subs_json, [])
      }));
      return res.json({ products: parsed, total: parsed.length });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const countResult = await get('SELECT COUNT(*) as total FROM products');
    const total = countResult?.total || 0;

    const products = await all('SELECT * FROM products ORDER BY id ASC LIMIT ? OFFSET ?', [limit, offset]);
    const parsed = products.map(p => ({
      ...p,
      colors: tryParse(p.colors_json, []),
      sizes: tryParse(p.sizes_json, []),
      subs: tryParse(p.subs_json, [])
    }));
    res.json({ products: parsed, total, pagination: { page, limit, pages: Math.ceil(total / limit) } });
  } catch (err) {
    logger.error('Get products error', { message: err.message, stack: err.stack });
    sendError(res, 500, 'Server error', ERROR_CODES.INTERNAL_ERROR);
  }
});

// GET /api/products/:id — public
router.get('/:id', async (req, res) => {
  try {
    const p = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!p) return sendError(res, 404, 'Product not found', ERROR_CODES.NOT_FOUND);
    res.json({
      ...p,
      colors: tryParse(p.colors_json, []),
      sizes: tryParse(p.sizes_json, []),
      subs: tryParse(p.subs_json, [])
    });
  } catch (err) {
    sendError(res, 500, 'Server error', ERROR_CODES.INTERNAL_ERROR);
  }
});

// POST /api/products — admin only
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { name, category, vendor, price, origPrice, stock, emoji, colors, sizes, description, badge, material, care, origin, subs, imageUrl } = req.body;
  if (!name || !category || !vendor || price == null) {
    return sendError(res, 400, 'name, category, vendor, price are required', ERROR_CODES.VALIDATION_ERROR);
  }
  // ── Input validation ──
  if (typeof price !== 'number' || isNaN(price) || price < 0) {
    return sendError(res, 400, 'price must be a non-negative number', ERROR_CODES.VALIDATION_ERROR);
  }
  if (origPrice != null && (typeof origPrice !== 'number' || isNaN(origPrice) || origPrice < 0)) {
    return sendError(res, 400, 'origPrice must be a non-negative number', ERROR_CODES.VALIDATION_ERROR);
  }
  if (stock != null && (!Number.isInteger(stock) || stock < 0)) {
    return sendError(res, 400, 'stock must be a non-negative integer', ERROR_CODES.VALIDATION_ERROR);
  }
  if (colors != null && !Array.isArray(colors)) {
    return sendError(res, 400, 'colors must be an array', ERROR_CODES.VALIDATION_ERROR);
  }
  if (sizes != null && !Array.isArray(sizes)) {
    return sendError(res, 400, 'sizes must be an array', ERROR_CODES.VALIDATION_ERROR);
  }
  if (subs != null && !Array.isArray(subs)) {
    return sendError(res, 400, 'subs must be an array', ERROR_CODES.VALIDATION_ERROR);
  }
  // Truncate overly long string fields
  const maxLen = (v, max) => typeof v === 'string' ? v.substring(0, max) : v || '';
  try {
    const result = await run(
      `INSERT INTO products (name, category, vendor, price, orig_price, stock, emoji, colors_json, sizes_json, description, badge, material, care, origin, subs_json, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [maxLen(name, 200), maxLen(category, 100), maxLen(vendor, 200), price, origPrice || null, stock || 0, emoji || '👗',
       JSON.stringify(colors || []), JSON.stringify(sizes || []),
       maxLen(description, 2000), maxLen(badge, 100), maxLen(material, 200), maxLen(care, 200), maxLen(origin, 200),
       JSON.stringify(subs || []), imageUrl || null]
    );
    const created = await get('SELECT * FROM products WHERE id = ?', [result.id]);
    res.status(201).json(created);
  } catch (err) {
    logger.error('Create product error', { message: err.message, stack: err.stack });
    sendError(res, 500, 'Server error', ERROR_CODES.INTERNAL_ERROR);
  }
});

// PUT /api/products/:id — admin only
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { name, category, vendor, price, origPrice, stock, emoji, colors, sizes, description, badge, material, care, origin, subs, imageUrl } = req.body;
  // ── Input validation ──
  if (price != null && (typeof price !== 'number' || isNaN(price) || price < 0)) {
    return sendError(res, 400, 'price must be a non-negative number', ERROR_CODES.VALIDATION_ERROR);
  }
  if (origPrice != null && (typeof origPrice !== 'number' || isNaN(origPrice) || origPrice < 0)) {
    return sendError(res, 400, 'origPrice must be a non-negative number', ERROR_CODES.VALIDATION_ERROR);
  }
  if (stock != null && (!Number.isInteger(stock) || stock < 0)) {
    return sendError(res, 400, 'stock must be a non-negative integer', ERROR_CODES.VALIDATION_ERROR);
  }
  if (colors != null && !Array.isArray(colors)) {
    return sendError(res, 400, 'colors must be an array', ERROR_CODES.VALIDATION_ERROR);
  }
  if (sizes != null && !Array.isArray(sizes)) {
    return sendError(res, 400, 'sizes must be an array', ERROR_CODES.VALIDATION_ERROR);
  }
  if (subs != null && !Array.isArray(subs)) {
    return sendError(res, 400, 'subs must be an array', ERROR_CODES.VALIDATION_ERROR);
  }
  const maxLen = (v, max) => typeof v === 'string' ? v.substring(0, max) : v || '';
  try {
    const existing = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!existing) return sendError(res, 404, 'Product not found', ERROR_CODES.NOT_FOUND);

    // Build dynamic SET clause — only update fields that were provided
    const fields = [];
    const values = [];
    if (name != null)         { fields.push('name = ?');         values.push(maxLen(name, 200)); }
    if (category != null)     { fields.push('category = ?');     values.push(maxLen(category, 100)); }
    if (vendor != null)       { fields.push('vendor = ?');       values.push(maxLen(vendor, 200)); }
    if (price != null)        { fields.push('price = ?');        values.push(price); }
    if (origPrice !== undefined) { fields.push('orig_price = ?'); values.push(origPrice || null); }
    if (stock != null)        { fields.push('stock = ?');        values.push(stock); }
    if (emoji != null)        { fields.push('emoji = ?');        values.push(emoji); }
    if (colors != null)       { fields.push('colors_json = ?');  values.push(JSON.stringify(colors)); }
    if (sizes != null)        { fields.push('sizes_json = ?');   values.push(JSON.stringify(sizes)); }
    if (description != null)  { fields.push('description = ?');  values.push(maxLen(description, 2000)); }
    if (badge != null)        { fields.push('badge = ?');        values.push(maxLen(badge, 100)); }
    if (material != null)     { fields.push('material = ?');     values.push(maxLen(material, 200)); }
    if (care != null)         { fields.push('care = ?');         values.push(maxLen(care, 200)); }
    if (origin != null)       { fields.push('origin = ?');       values.push(maxLen(origin, 200)); }
    if (subs != null)         { fields.push('subs_json = ?');    values.push(JSON.stringify(subs)); }
    if (imageUrl !== undefined) { fields.push('image_url = ?');  values.push(imageUrl || null); }

    if (fields.length === 0) {
      return sendError(res, 400, 'No fields to update', ERROR_CODES.VALIDATION_ERROR);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(req.params.id);

    await run(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    const updated = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (err) {
    logger.error('Update product error', { message: err.message, stack: err.stack });
    sendError(res, 500, 'Server error', ERROR_CODES.INTERNAL_ERROR);
  }
});

// DELETE /api/products/:id — admin only
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const existing = await get('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (!existing) return sendError(res, 404, 'Product not found', ERROR_CODES.NOT_FOUND);
    await run('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    sendError(res, 500, 'Server error', ERROR_CODES.INTERNAL_ERROR);
  }
});

// POST /api/products/:id/share — track share count (public)
router.post('/:id/share', async (req, res) => {
  try {
    const existing = await get('SELECT id, share_count FROM products WHERE id = ?', [req.params.id]);
    if (!existing) return sendError(res, 404, 'Product not found', ERROR_CODES.NOT_FOUND);

    const newCount = (existing.share_count || 0) + 1;
    await run('UPDATE products SET share_count = ? WHERE id = ?', [newCount, req.params.id]);
    res.json({ shareCount: newCount });
  } catch (err) {
    // Non-critical — silent fail is acceptable
    res.json({ shareCount: 0 });
  }
});

function tryParse(val, fallback) {
  try { return val ? JSON.parse(val) : fallback; } catch { return fallback; }
}

module.exports = router;
