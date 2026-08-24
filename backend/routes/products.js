const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { run, get, all } = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { handleValidation, stripTags } = require('../middleware/validate');

const productValidation = [
  body('name').trim().notEmpty().withMessage('Name required').isLength({ max: 200 }),
  body('category').trim().notEmpty().withMessage('Category required').isLength({ max: 100 }),
  body('vendor').trim().notEmpty().withMessage('Vendor required').isLength({ max: 100 }),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('description').optional({ checkFalsy: true }).trim().isLength({ max: 5000 })
];

// GET /api/products — public
router.get('/', async (req, res) => {
  try {
    const products = await all('SELECT * FROM products ORDER BY id ASC');
    const parsed = products.map(p => ({
      ...p,
      colors: tryParse(p.colors_json, []),
      sizes: tryParse(p.sizes_json, []),
      subs: tryParse(p.subs_json, [])
    }));
    res.json({ products: parsed, total: parsed.length });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/products/:id — public
router.get('/:id', async (req, res) => {
  try {
    const p = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json({
      ...p,
      colors: tryParse(p.colors_json, []),
      sizes: tryParse(p.sizes_json, []),
      subs: tryParse(p.subs_json, [])
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/products — admin only
router.post('/', authenticateToken, requireAdmin, productValidation, handleValidation, async (req, res) => {
  const { price, origPrice, stock, emoji, colors, sizes, badge, material, care, origin, subs } = req.body;
  const name = stripTags(req.body.name);
  const category = stripTags(req.body.category);
  const vendor = stripTags(req.body.vendor);
  const description = stripTags(req.body.description || '');
  try {
    const result = await run(
      `INSERT INTO products (name, category, vendor, price, orig_price, stock, emoji, colors_json, sizes_json, description, badge, material, care, origin, subs_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, category, vendor, price, origPrice || null, stock || 0, emoji || '👗',
       JSON.stringify(colors || []), JSON.stringify(sizes || []),
       description || '', badge || '', material || '', care || '', origin || 'Bangladesh',
       JSON.stringify(subs || [])]
    );
    const created = await get('SELECT * FROM products WHERE id = ?', [result.id]);
    res.status(201).json(created);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/products/:id — admin only
router.put('/:id', authenticateToken, requireAdmin, productValidation, handleValidation, async (req, res) => {
  const { price, origPrice, stock, emoji, colors, sizes, badge, material, care, origin, subs } = req.body;
  const name = stripTags(req.body.name);
  const category = stripTags(req.body.category);
  const vendor = stripTags(req.body.vendor);
  const description = stripTags(req.body.description || '');
  try {
    const existing = await get('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Product not found' });
    await run(
      `UPDATE products SET name=?, category=?, vendor=?, price=?, orig_price=?, stock=?, emoji=?,
       colors_json=?, sizes_json=?, description=?, badge=?, material=?, care=?, origin=?, subs_json=?,
       updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      [name, category, vendor, price, origPrice || null, stock, emoji,
       JSON.stringify(colors || []), JSON.stringify(sizes || []),
       description || '', badge || '', material || '', care || '', origin || 'Bangladesh',
       JSON.stringify(subs || []), req.params.id]
    );
    const updated = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/products/:id — admin only
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const existing = await get('SELECT id FROM products WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: 'Product not found' });
    await run('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

function tryParse(val, fallback) {
  try { return val ? JSON.parse(val) : fallback; } catch { return fallback; }
}

module.exports = router;
