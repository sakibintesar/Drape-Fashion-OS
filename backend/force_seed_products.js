require('dotenv').config();
const { initDatabase, run } = require('./database');

const products = [
  { id: 1, name: 'Muslin Wrap Dress', category: 'Dresses', vendor: 'LOOM & GRACE', price: 3200, origPrice: null, stock: 28, emoji: '👗', colors: [{ name: 'Ivory', hex: '#FFFFF0' }, { name: 'Blush', hex: '#FFB6C1' }, { name: 'Midnight', hex: '#191970' }], sizes: ['XS', 'S', 'M', 'L', 'XL'], desc: 'Flowing wrap silhouette in heritage Dhaka muslin. Naturally breathable with a hand-knotted waist tie.', badge: 'New Arrival', sold: 14, material: '100% Dhaka Muslin', care: 'Hand wash cold', origin: 'Dhaka, Bangladesh', subs: [{ name: 'Midi', emoji: '👗', price: 3200 }, { name: 'Maxi', emoji: '👗', price: 3600 }, { name: 'Mini', emoji: '👗', price: 2900 }] },
  { id: 2, name: 'Linen Tailored Blazer', category: 'Outerwear', vendor: 'ZEPHYR CUTS', price: 5800, origPrice: 7200, stock: 12, emoji: '🧥', colors: [{ name: 'Camel', hex: '#C19A6B' }, { name: 'Charcoal', hex: '#36454F' }, { name: 'Cream', hex: '#FFFDD0' }], sizes: ['S', 'M', 'L', 'XL'], desc: 'Sharp-shouldered single-breasted blazer in Italian linen with full canvas construction.', badge: 'Sale', sold: 9, material: 'Italian Linen, Full Canvas', care: 'Dry clean only', origin: 'Dhaka, Bangladesh', subs: [{ name: 'Regular Fit', emoji: '🧥', price: 5800 }, { name: 'Slim Fit', emoji: '🧥', price: 5800 }] },
  { id: 3, name: 'Silk Slip Top', category: 'Tops', vendor: 'THREAD REPUBLIC', price: 1800, origPrice: null, stock: 42, emoji: '👚', colors: [{ name: 'Sage', hex: '#8A9A5B' }, { name: 'Terracotta', hex: '#E2725B' }, { name: 'Ecru', hex: '#C2B280' }, { name: 'Black', hex: '#1a1a1a' }], sizes: ['XS', 'S', 'M', 'L'], desc: 'Bias-cut satin-silk top with adjustable straps. Wears alone or under a structured blazer.', badge: '', sold: 31, material: '92% Silk, 8% Elastane', care: 'Hand wash cold', origin: 'Chittagong, Bangladesh', subs: [{ name: 'Cami', emoji: '👚', price: 1800 }, { name: 'Crop', emoji: '👚', price: 1600 }] },
  { id: 4, name: 'Wide-Leg Trousers', category: 'Bottoms', vendor: 'ZEPHYR CUTS', price: 2600, origPrice: null, stock: 6, emoji: '👖', colors: [{ name: 'Khaki', hex: '#C3B091' }, { name: 'Navy', hex: '#000080' }, { name: 'Ecru', hex: '#C2B280' }], sizes: ['S', 'M', 'L', 'XL'], desc: 'High-rise wide-leg cut in cotton-linen blend. Relaxed structure with a refined finish.', badge: 'Low Stock', sold: 22, material: '55% Cotton, 45% Linen', care: 'Machine wash cold', origin: 'Dhaka, Bangladesh', subs: [] },
  { id: 5, name: 'Broderie Kurta', category: 'Tops', vendor: 'NAKSHI STUDIO', price: 2100, origPrice: null, stock: 35, emoji: '🥻', colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Dusty Rose', hex: '#DCAE96' }, { name: 'Sky', hex: '#87CEEB' }], sizes: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'Hand-embroidered broderie anglaise kurta in organic cotton. No two are identical.', badge: 'New Arrival', sold: 17, material: '100% Organic Cotton', care: 'Hand wash cold', origin: 'Rajshahi, Bangladesh', subs: [] },
  { id: 6, name: 'Leather Mini Bag', category: 'Accessories', vendor: 'ADORN CO.', price: 1400, origPrice: 1800, stock: 18, emoji: '👜', colors: [{ name: 'Tan', hex: '#D2691E' }, { name: 'Black', hex: '#1a1a1a' }, { name: 'Burgundy', hex: '#800020' }], sizes: ['One Size'], desc: 'Structured top-handle mini bag in full-grain leather from certified Rajshahi tanneries.', badge: 'Sale', sold: 11, material: 'Full-Grain Leather', care: 'Leather conditioner monthly', origin: 'Sylhet, Bangladesh', subs: [] },
  { id: 7, name: 'Pleated Midi Skirt', category: 'Bottoms', vendor: 'LOOM & GRACE', price: 2200, origPrice: null, stock: 0, emoji: '👘', colors: [{ name: 'Moss', hex: '#8A9A5B' }, { name: 'Rust', hex: '#B7410E' }, { name: 'Stone', hex: '#928E85' }], sizes: ['XS', 'S', 'M', 'L'], desc: 'Fluid pleated midi in recycled polyester. Moves beautifully, packs flat.', badge: 'Sold Out', sold: 40, material: '100% Recycled Polyester', care: 'Machine wash cold', origin: 'Dhaka, Bangladesh', subs: [] },
  { id: 8, name: 'Cotton Panjabi', category: 'Tops', vendor: 'NAKSHI STUDIO', price: 1600, origPrice: null, stock: 55, emoji: '🛕', colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Light Blue', hex: '#ADD8E6' }, { name: 'Pale Yellow', hex: '#FFFF99' }], sizes: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'Contemporary-cut panjabi in handloom cotton with subtle tonal stripe weave.', badge: '', sold: 28, material: 'Handloom Cotton', care: 'Machine wash cold', origin: 'Rajshahi, Bangladesh', subs: [] },
  { id: 9, name: 'Kantha Jacket', category: 'Outerwear', vendor: 'NAKSHI STUDIO', price: 4200, origPrice: null, stock: 8, emoji: '🧶', colors: [{ name: 'Indigo', hex: '#4B0082' }, { name: 'Burnt Orange', hex: '#CC5500' }, { name: 'Forest', hex: '#228B22' }], sizes: ['S', 'M', 'L', 'XL'], desc: 'Reversible kantha-work jacket with hand-embroidered motifs.', badge: 'New Arrival', sold: 6, material: 'Handloom Cotton, Kantha Stitch', care: 'Dry clean recommended', origin: 'Rajshahi, Bangladesh', subs: [] },
  { id: 10, name: 'Brass Cuff Set', category: 'Accessories', vendor: 'ADORN CO.', price: 650, origPrice: null, stock: 60, emoji: '📿', colors: [{ name: 'Brass', hex: '#B5A642' }, { name: 'Silver', hex: '#C0C0C0' }, { name: 'Rose Gold', hex: '#B76E79' }], sizes: ['S/M', 'L/XL'], desc: 'Set of 3 handcrafted brass cuffs. Geometric motifs inspired by Mughal jali work.', badge: '', sold: 45, material: 'Recycled Brass', care: 'Wipe with dry cloth', origin: 'Sylhet, Bangladesh', subs: [] },
];

async function forceReseed() {
  try {
    await initDatabase();
    await run('DELETE FROM products');
    console.log('Products cleared');
    for (const p of products) {
      await run(
        `INSERT INTO products (id, name, category, vendor, price, orig_price, stock, emoji, colors_json, sizes_json, description, badge, sold, material, care, origin, subs_json)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [p.id, p.name, p.category, p.vendor, p.price, p.origPrice, p.stock, p.emoji,
         JSON.stringify(p.colors), JSON.stringify(p.sizes), p.desc, p.badge, p.sold,
         p.material, p.care, p.origin, JSON.stringify(p.subs)]
      );
    }
    console.log(`✅ ${products.length} products inserted into Neon`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

forceReseed();
