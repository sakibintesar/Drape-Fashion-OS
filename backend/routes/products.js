const express = require('express');
const router = express.Router();
const { all, get, run } = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { adminLimiter } = require('../middleware/rateLimiter');

// GET /api/products - public, list all products
router.get('/', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM products ORDER BY id ASC');
    const products = rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      vendor: row.vendor,
      price: row.price,
      origPrice: row.orig_price,
      stock: row.stock,
      emoji: row.emoji,
      colors: JSON.parse(row.colors_json || '[]'),
      sizes: JSON.parse(row.sizes_json || '[]'),
      desc: row.description,
      badge: row.badge,
      sold: row.sold,
      material: row.material,
      care: row.care,
      origin: row.origin,
      subs: JSON.parse(row.subs_json || '[]')
    }));
    res.json({ products });
  } catch (err) {
    console.error('Products fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - public, single product
router.get('/:id', async (req, res) => {
  try {
    const row = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Product not found' });
    
    res.json({
      product: {
        id: row.id,
        name: row.name,
        category: row.category,
        vendor: row.vendor,
        price: row.price,
        origPrice: row.orig_price,
        stock: row.stock,
        emoji: row.emoji,
        colors: JSON.parse(row.colors_json || '[]'),
        sizes: JSON.parse(row.sizes_json || '[]'),
        desc: row.description,
        badge: row.badge,
        sold: row.sold,
        material: row.material,
        care: row.care,
        origin: row.origin,
        subs: JSON.parse(row.subs_json || '[]')
      }
    });
  } catch (err) {
    console.error('Product fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products - admin only, create product
router.post('/', authenticateToken, requireAdmin, adminLimiter, async (req, res) => {
  const {
    name, category, vendor, price, origPrice, stock, emoji,
    colors, sizes, desc, badge, material, care, origin, subs
  } = req.body;

  if (!name || !category || !vendor || price === undefined || stock === undefined) {
    return res.status(400).json({ error: 'Name, category, vendor, price, and stock are required' });
  }

  try {
    const result = await run(
      `INSERT INTO products (name, category, vendor, price, orig_price, stock, emoji, 
       colors_json, sizes_json, description, badge, material, care, origin, subs_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, category, vendor, price, origPrice || null, stock, emoji || '',
        JSON.stringify(colors || []), JSON.stringify(sizes || []), desc || '',
        badge || '', material || '', care || '', origin || '', JSON.stringify(subs || [])
      ]
    );

    const product = await get('SELECT * FROM products WHERE id = ?', [result.id]);
    res.status(201).json({ product: { ...product, colors: JSON.parse(product.colors_json || '[]'), sizes: JSON.parse(product.sizes_json || '[]'), subs: JSON.parse(product.subs_json || '[]') } });
  } catch (err) {
    console.error('Product create error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - admin only, update product
router.put('/:id', authenticateToken, requireAdmin, adminLimiter, async (req, res) => {
  const {
    name, category, vendor, price, origPrice, stock, emoji,
    colors, sizes, desc, badge, material, care, origin, subs
  } = req.body;

  try {
    const existing = await get('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    await run(
      `UPDATE products SET
       name = COALESCE(?, name),
       category = COALESCE(?, category),
       vendor = COALESCE(?, vendor),
       price = COALESCE(?, price),
       orig_price = COALESCE(?, orig_price),
       stock = COALESCE(?, stock),
       emoji = COALESCE(?, emoji),
       colors_json = COALESCE(?, colors_json),
       sizes_json = COALESCE(?, sizes_json),
       description = COALESCE(?, description),
       badge = COALESCE(?, badge),
       material = COALESCE(?, material),
       care = COALESCE(?, care),
       origin = COALESCE(?, origin),
       subs_json = COALESCE(?, subs_json),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        name, category, vendor, price, origPrice, stock, emoji,
        colors ? JSON.stringify(colors) : null,
        sizes ? JSON.stringify(sizes) : null,
        desc, badge, material, care, origin,
        subs ? JSON.stringify(subs) : null,
        req.params.id
      ]
    );

    const product = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json({ product: { ...product, colors: JSON.parse(product.colors_json || '[]'), sizes: JSON.parse(product.sizes_json || '[]'), subs: JSON.parse(product.subs_json || '[]') } });
  } catch (err) {
    console.error('Product update error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - admin only
router.delete('/:id', authenticateToken, requireAdmin, adminLimiter, async (req, res) => {
  try {
    const existing = await get('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    await run('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Product delete error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
