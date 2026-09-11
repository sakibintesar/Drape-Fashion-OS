const express = require('express');
const router = express.Router();

const BASE_URL = process.env.BASE_URL || 'https://drape-fashion-os.onrender.com';

// ── robots.txt ──
router.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin.html

Sitemap: ${BASE_URL}/sitemap.xml
`);
});

// ── sitemap.xml ──
router.get('/sitemap.xml', (req, res) => {
  const now = new Date().toISOString().split('T')[0];

  const pages = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/about.html', priority: '0.8', changefreq: 'monthly' },
    { loc: '/shipping.html', priority: '0.7', changefreq: 'monthly' },
    { loc: '/returns.html', priority: '0.7', changefreq: 'monthly' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  pages.forEach(p => {
    xml += `  <url>
    <loc>${BASE_URL}${p.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>
`;
  });

  xml += '</urlset>';

  res.type('application/xml');
  res.send(xml);
});

module.exports = router;
