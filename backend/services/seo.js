/**
 * DRAPE Fashion OS — AI SEO Service
 *
 * Generates SEO-optimized meta tags, JSON-LD structured data,
 * Open Graph tags, and sitemaps using Anthropic API.
 */

const logger = require('../logger');

// ── JSON-LD Product Schema ────────────────────────────────────────────────────

function generateProductJSONLD(product, baseUrl) {
  const url = `${baseUrl}/#product-${product.id}`;
  const images = product.image_url ? [product.image_url] : [];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.seo_description || product.description || `${product.name} by ${product.vendor} — premium fashion from DRAPE`,
    image: images,
    url,
    brand: {
      '@type': 'Brand',
      name: product.vendor || 'DRAPE'
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'BDT',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url,
      seller: {
        '@type': 'Organization',
        name: 'DRAPE Fashion'
      }
    },
    category: product.category || 'Fashion'
  };

  if (product.colors?.length) {
    schema.color = product.colors.map(c => c.name || c.hex).filter(Boolean);
  }

  return schema;
}

// ── JSON-LD Organization Schema ───────────────────────────────────────────────

function generateOrgJSONLD(baseUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DRAPE Fashion',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Premium Bangladesh fashion — five artisan brands, one platform. Handloom, kantha, recycled knitwear, and tailored classics.',
    sameAs: [
      'https://www.instagram.com/drape.fashion',
      'https://www.facebook.com/drape.fashion.bd',
      'https://www.tiktok.com/@drape.fashion',
      'https://www.linkedin.com/company/drape-fashion-bd'
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dhaka',
      addressCountry: 'BD'
    }
  };
}

// ── JSON-LD Website Schema ────────────────────────────────────────────────────

function generateWebsiteJSONLD(baseUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DRAPE Fashion',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

// ── JSON-LD BreadcrumbList Schema ─────────────────────────────────────────────

function generateBreadcrumbJSONLD(items, baseUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url ? `${baseUrl}${item.url}` : undefined
    }))
  };
}

// ── Open Graph Tags ───────────────────────────────────────────────────────────

function generateOpenGraph(product, baseUrl) {
  const url = `${baseUrl}/#product-${product.id}`;
  return {
    'og:title': product.seo_title || `${product.name} — DRAPE Fashion`,
    'og:description': product.seo_description || product.description || `${product.name} by ${product.vendor}`,
    'og:image': product.image_url || `${baseUrl}/og-default.png`,
    'og:url': url,
    'og:type': 'product',
    'og:site_name': 'DRAPE Fashion',
    'og:locale': 'en_BD',
    'product:price:amount': String(product.price),
    'product:price:currency': 'BDT'
  };
}

function generatePageOpenGraph(title, description, imageUrl, url) {
  return {
    'og:title': title,
    'og:description': description,
    'og:image': imageUrl || `${url}/og-default.png`,
    'og:url': url,
    'og:type': 'website',
    'og:site_name': 'DRAPE Fashion',
    'og:locale': 'en_BD'
  };
}

// ── Meta Tags HTML ────────────────────────────────────────────────────────────

function generateMetaTags(product, baseUrl) {
  const og = generateOpenGraph(product, baseUrl);
  const url = `${baseUrl}/#product-${product.id}`;
  const title = product.seo_title || `${product.name} — DRAPE Fashion`;
  const description = product.seo_description || product.description || `${product.name} by ${product.vendor}`;
  const keywords = product.seo_keywords || `${product.name}, ${product.vendor}, DRAPE, Bangladesh fashion, ${product.category}`;

  return {
    title,
    description,
    keywords,
    url,
    canonical: url,
    og,
    jsonLD: generateProductJSONLD(product, baseUrl)
  };
}

// ── Sitemap Generator ─────────────────────────────────────────────────────────

function generateSitemapXML(products, baseUrl) {
  const now = new Date().toISOString().split('T')[0];

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/?page=shop', priority: '0.9', changefreq: 'daily' },
    { loc: '/?page=catalog', priority: '0.8', changefreq: 'weekly' },
    { loc: '/?page=social', priority: '0.6', changefreq: 'weekly' },
    { loc: '/?page=track', priority: '0.5', changefreq: 'monthly' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Static pages
  for (const p of staticPages) {
    xml += `  <url>
    <loc>${baseUrl}${p.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>
`;
  }

  // Product pages
  for (const product of (products || [])) {
    const lastmod = product.updated_at
      ? new Date(product.updated_at).toISOString().split('T')[0]
      : now;
    const slug = product.slug || `product-${product.id}`;

    xml += `  <url>
    <loc>${baseUrl}/#product-${product.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
`;
    if (product.image_url) {
      xml += `    <image:image>
      <image:loc>${product.image_url}</image:loc>
      <image:title>${escapeXml(product.name)}</image:title>
      <image:caption>${escapeXml(product.name)} by ${escapeXml(product.vendor || 'DRAPE')}</image:caption>
    </image:image>
`;
    }
    xml += `  </url>
`;
  }

  // Brand pages
  const brands = ['LOOM & GRACE', 'THREAD REPUBLIC', 'NAKSHI STUDIO', 'ZEPHYR CUTS', 'ADORN CO.'];
  for (const brand of brands) {
    xml += `  <url>
    <loc>${baseUrl}/?page=catalog&brand=${encodeURIComponent(brand)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  // Category pages
  const categories = ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Accessories'];
  for (const cat of categories) {
    xml += `  <url>
    <loc>${baseUrl}/?page=catalog&cat=${encodeURIComponent(cat)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  xml += '</urlset>';
  return xml;
}

function escapeXml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

// ── AI SEO Content Generator ──────────────────────────────────────────────────

async function generateProductSEO(product, apiKey) {
  if (!apiKey) {
    // Fallback: generate without AI
    return {
      seo_title: `${product.name} — ${product.vendor} | DRAPE Fashion`,
      seo_description: `${product.name} by ${product.vendor}. ${product.description || ''} Shop premium Bangladesh fashion at DRAPE.`,
      seo_keywords: `${product.name}, ${product.vendor}, DRAPE, ${product.category}, Bangladesh fashion, sustainable fashion`,
      slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    };
  }

  const prompt = `Generate SEO content for this fashion product. Return ONLY valid JSON with these fields:
- seo_title: compelling title (max 60 chars), include product name and brand
- seo_description: meta description (max 160 chars), compelling, include key selling points
- seo_keywords: comma-separated keywords (max 10 keywords)
- slug: URL-friendly slug

Product: ${product.name}
Brand: ${product.vendor}
Category: ${product.category}
Price: ৳${product.price}
Description: ${product.description || 'N/A'}
Colors: ${(product.colors || []).map(c => c.name).join(', ')}
Material: ${product.material || 'N/A'}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      logger.error('[seo] AI generation failed', { status: response.status });
      return generateProductSEO(product, null); // fallback
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return generateProductSEO(product, null); // fallback
  } catch (err) {
    logger.error('[seo] AI generation error', { message: err.message });
    return generateProductSEO(product, null); // fallback
  }
}

module.exports = {
  generateProductJSONLD,
  generateOrgJSONLD,
  generateWebsiteJSONLD,
  generateBreadcrumbJSONLD,
  generateOpenGraph,
  generatePageOpenGraph,
  generateMetaTags,
  generateSitemapXML,
  generateProductSEO,
  escapeXml
};
