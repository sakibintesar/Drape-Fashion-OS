require('dotenv').config();
const bcrypt = require('bcryptjs');
const { initDatabase, run, get, USE_PG } = require('./database');

const products = [
  { id: 1, name: 'Muslin Wrap Dress', category: 'Dresses', vendor: 'LOOM & GRACE', price: 3200, origPrice: null, stock: 28, emoji: '👗',
    colors: [{ name: 'Ivory', hex: '#FFFFF0' }, { name: 'Blush', hex: '#FFB6C1' }, { name: 'Midnight', hex: '#191970' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'], desc: 'Flowing wrap silhouette in heritage Dhaka muslin. Naturally breathable with a hand-knotted waist tie.',
    badge: 'New Arrival', sold: 14, material: '100% Dhaka Muslin', care: 'Hand wash cold', origin: 'Dhaka, Bangladesh',
    subs: [{ name: 'Midi', emoji: '👗', price: 3200 }, { name: 'Maxi', emoji: '👗', price: 3600 }, { name: 'Mini', emoji: '👗', price: 2900 }] },
  { id: 2, name: 'Linen Tailored Blazer', category: 'Outerwear', vendor: 'ZEPHYR CUTS', price: 5800, origPrice: 7200, stock: 12, emoji: '🧥',
    colors: [{ name: 'Camel', hex: '#C19A6B' }, { name: 'Charcoal', hex: '#36454F' }, { name: 'Cream', hex: '#FFFDD0' }],
    sizes: ['S', 'M', 'L', 'XL'], desc: 'Sharp-shouldered single-breasted blazer in Italian linen with full canvas construction.',
    badge: 'Sale', sold: 9, material: 'Italian Linen, Full Canvas', care: 'Dry clean only', origin: 'Dhaka, Bangladesh',
    subs: [{ name: 'Regular Fit', emoji: '🧥', price: 5800 }, { name: 'Slim Fit', emoji: '🧥', price: 5800 }, { name: 'Relaxed', emoji: '🧥', price: 5800 }] },
  { id: 3, name: 'Silk Slip Top', category: 'Tops', vendor: 'THREAD REPUBLIC', price: 1800, origPrice: null, stock: 42, emoji: '👚',
    colors: [{ name: 'Sage', hex: '#8A9A5B' }, { name: 'Terracotta', hex: '#E2725B' }, { name: 'Ecru', hex: '#C2B280' }, { name: 'Black', hex: '#1a1a1a' }],
    sizes: ['XS', 'S', 'M', 'L'], desc: 'Bias-cut satin-silk top with adjustable straps. Wears alone or under a structured blazer.',
    badge: '', sold: 31, material: '92% Silk, 8% Elastane', care: 'Hand wash cold', origin: 'Chittagong, Bangladesh',
    subs: [{ name: 'Cami', emoji: '👚', price: 1800 }, { name: 'Crop', emoji: '👚', price: 1600 }, { name: 'Long Line', emoji: '👚', price: 2000 }] },
  { id: 4, name: 'Wide-Leg Trousers', category: 'Bottoms', vendor: 'ZEPHYR CUTS', price: 2600, origPrice: null, stock: 6, emoji: '👖',
    colors: [{ name: 'Khaki', hex: '#C3B091' }, { name: 'Navy', hex: '#000080' }, { name: 'Ecru', hex: '#C2B280' }],
    sizes: ['S', 'M', 'L', 'XL'], desc: 'High-rise wide-leg cut in cotton-linen blend. Relaxed structure with a refined finish.',
    badge: 'Low Stock', sold: 22, material: '55% Cotton, 45% Linen', care: 'Machine wash cold', origin: 'Dhaka, Bangladesh',
    subs: [{ name: 'Regular Rise', emoji: '👖', price: 2600 }, { name: 'High Rise', emoji: '👖', price: 2800 }, { name: 'Cropped', emoji: '👖', price: 2400 }] },
  { id: 5, name: 'Broderie Kurta', category: 'Tops', vendor: 'NAKSHI STUDIO', price: 2100, origPrice: null, stock: 35, emoji: '🥻',
    colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Dusty Rose', hex: '#DCAE96' }, { name: 'Sky', hex: '#87CEEB' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'Hand-embroidered broderie anglaise kurta in organic cotton. No two are identical.',
    badge: 'New Arrival', sold: 17, material: '100% Organic Cotton', care: 'Hand wash cold', origin: 'Rajshahi, Bangladesh',
    subs: [{ name: 'Short Kurta', emoji: '🥻', price: 2100 }, { name: 'Longline', emoji: '🥻', price: 2400 }, { name: 'Set', emoji: '🥻', price: 3800 }] },
  { id: 6, name: 'Leather Mini Bag', category: 'Accessories', vendor: 'ADORN CO.', price: 1400, origPrice: 1800, stock: 18, emoji: '👜',
    colors: [{ name: 'Tan', hex: '#D2691E' }, { name: 'Black', hex: '#1a1a1a' }, { name: 'Burgundy', hex: '#800020' }],
    sizes: ['One Size'], desc: 'Structured top-handle mini bag in full-grain leather from certified Rajshahi tanneries.',
    badge: 'Sale', sold: 11, material: 'Full-Grain Leather', care: 'Leather conditioner monthly', origin: 'Sylhet, Bangladesh',
    subs: [{ name: 'Mini 18cm', emoji: '👜', price: 1400 }, { name: 'Medium 24cm', emoji: '👜', price: 2100 }, { name: 'Clutch', emoji: '👜', price: 900 }] },
  { id: 7, name: 'Pleated Midi Skirt', category: 'Bottoms', vendor: 'LOOM & GRACE', price: 2200, origPrice: null, stock: 0, emoji: '👘',
    colors: [{ name: 'Moss', hex: '#8A9A5B' }, { name: 'Rust', hex: '#B7410E' }, { name: 'Stone', hex: '#928E85' }],
    sizes: ['XS', 'S', 'M', 'L'], desc: 'Fluid pleated midi in recycled polyester. Moves beautifully, packs flat.',
    badge: 'Sold Out', sold: 40, material: '100% Recycled Polyester', care: 'Machine wash cold', origin: 'Dhaka, Bangladesh',
    subs: [] },
  { id: 8, name: 'Cotton Panjabi', category: 'Tops', vendor: 'NAKSHI STUDIO', price: 1600, origPrice: null, stock: 55, emoji: '🛕',
    colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Light Blue', hex: '#ADD8E6' }, { name: 'Pale Yellow', hex: '#FFFF99' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'Contemporary-cut panjabi in handloom cotton with subtle tonal stripe weave.',
    badge: '', sold: 28, material: 'Handloom Cotton', care: 'Machine wash cold', origin: 'Rajshahi, Bangladesh',
    subs: [{ name: 'Classic Cut', emoji: '🛕', price: 1600 }, { name: 'Slim Cut', emoji: '🛕', price: 1600 }, { name: 'Embroidered', emoji: '🛕', price: 2000 }] },
  { id: 9, name: 'Kantha Jacket', category: 'Outerwear', vendor: 'NAKSHI STUDIO', price: 4200, origPrice: null, stock: 8, emoji: '🧶',
    colors: [{ name: 'Indigo', hex: '#4B0082' }, { name: 'Burnt Orange', hex: '#CC5500' }, { name: 'Forest', hex: '#228B22' }],
    sizes: ['S', 'M', 'L', 'XL'], desc: 'Reversible kantha-work jacket — one side bold hand-embroidered motifs, other side solid cotton.',
    badge: 'New Arrival', sold: 6, material: 'Handloom Cotton, Kantha Stitch', care: 'Dry clean recommended', origin: 'Rajshahi, Bangladesh',
    subs: [{ name: 'Short', emoji: '🧶', price: 4200 }, { name: 'Long', emoji: '🧶', price: 4800 }] },
  { id: 10, name: 'Brass Cuff Set', category: 'Accessories', vendor: 'ADORN CO.', price: 650, origPrice: null, stock: 60, emoji: '📿',
    colors: [{ name: 'Brass', hex: '#B5A642' }, { name: 'Silver', hex: '#C0C0C0' }, { name: 'Rose Gold', hex: '#B76E79' }],
    sizes: ['S/M', 'L/XL'], desc: 'Set of 3 handcrafted brass cuffs. Geometric motifs inspired by Mughal jali work.',
    badge: '', sold: 45, material: 'Recycled Brass', care: 'Wipe with dry cloth', origin: 'Sylhet, Bangladesh',
    subs: [{ name: 'Set of 3', emoji: '📿', price: 650 }, { name: 'Set of 5', emoji: '📿', price: 980 }, { name: 'Single', emoji: '📿', price: 380 }] },
];

async function seed() {
  try {
    await initDatabase();
    console.log('Database initialized');

    // Check if admin user exists
    const existing = await get('SELECT id FROM users WHERE username = ?', ['admin']);
    if (!existing) {
      const hash = await bcrypt.hash('drape2026', 12);
      await run(
        'INSERT INTO users (username, email, password_hash, role, fname, lname) VALUES (?, ?, ?, ?, ?, ?)',
        ['admin', 'admin@drape.fashion', hash, 'admin', 'Admin', 'User']
      );
      console.log('Admin user created: admin / drape2026');
    } else {
      console.log('Admin user already exists');
    }

    // Seed demo customers
    const demoCustomers = [
      { email: 'nusrat@email.com', fname: 'Nusrat', lname: 'Jahan', phone: '+880 171 1234567', city: 'Dhaka' },
      { email: 'rafiq@email.com', fname: 'Rafiq', lname: 'Ahmed', phone: '+880 181 9876543', city: 'Chittagong' },
      { email: 'sabrina@email.com', fname: 'Sabrina', lname: 'Islam', phone: '+880 170 5554433', city: 'Dhaka' },
    ];
    for (const c of demoCustomers) {
      const existingCust = await get('SELECT id FROM users WHERE email = ?', [c.email]);
      if (!existingCust) {
        const hash = await bcrypt.hash('password123', 12);
        await run(
          'INSERT INTO users (username, email, password_hash, role, fname, lname, phone, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [c.email, c.email, hash, 'customer', c.fname, c.lname, c.phone, c.city]
        );
        console.log('Demo customer created:', c.email);
      }
    }

    // Seed products if none exist
    const productCount = await get('SELECT COUNT(*) as count FROM products');
    if (productCount.count === 0) {
      for (const p of products) {
        await run(
          `INSERT INTO products (id, name, category, vendor, price, orig_price, stock, emoji, colors_json, sizes_json, description, badge, sold, material, care, origin, subs_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            p.id, p.name, p.category, p.vendor, p.price, p.origPrice, p.stock, p.emoji,
            JSON.stringify(p.colors), JSON.stringify(p.sizes), p.desc, p.badge, p.sold,
            p.material, p.care, p.origin, JSON.stringify(p.subs)
          ]
        );
      }
      console.log(`Seeded ${products.length} products`);
    } else {
      console.log('Products already seeded');
    }

    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
