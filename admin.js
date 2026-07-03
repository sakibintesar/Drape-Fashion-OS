let products = [
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

let orders = [];
let cart = [];
let selProd = null;
let selColor = null;
let selSize = null;
let mQty = 1;
let selPay = 'card';
let editProdId = null;
let nextId = 11;
let selCRMEmail = null;
let pgwMethod = 'card';
let pgwOrderData = null;
let scheduledPosts = [];
let activeWaChat = null;
let waChats = [];

const API_BASE = '/api';
let accessToken = null;
let refreshToken = null;

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const opts = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
      ...(options.headers || {})
    }
  };
  const res = await fetch(url, opts);
  if (res.status === 403) {
    const data = await res.json().catch(() => ({}));
    if (data.code === 'TOKEN_EXPIRED' && refreshToken) {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        accessToken = refreshData.accessToken;
        return apiRequest(endpoint, options);
      }
    }
  }
  return res;
}

async function loadProductsFromAPI() {
  try {
    const res = await apiRequest('/products');
    if (res.ok) {
      const data = await res.json();
      products = data.products || [];
      return true;
    }
  } catch (e) { console.error('Failed to load products from API:', e); }
  return false;
}

async function loadOrdersFromAPI() {
  try {
    const res = await apiRequest('/orders');
    if (res.ok) {
      const data = await res.json();
      orders = data.orders || [];
      return true;
    }
  } catch (e) { console.error('Failed to load orders from API:', e); }
  return false;
}

async function loadAnalyticsFromAPI() {
  try {
    const res = await apiRequest('/analytics');
    if (res.ok) return await res.json();
  } catch (e) { console.error('Failed to load analytics:', e); }
  return null;
}

async function createProductAPI(product) {
  const res = await apiRequest('/products', { method: 'POST', body: JSON.stringify(product) });
  return res.ok ? await res.json() : null;
}

async function updateProductAPI(id, product) {
  const res = await apiRequest(`/products/${id}`, { method: 'PUT', body: JSON.stringify(product) });
  return res.ok ? await res.json() : null;
}

async function deleteProductAPI(id) {
  const res = await apiRequest(`/products/${id}`, { method: 'DELETE' });
  return res.ok;
}

async function updateOrderStatusAPI(id, status) {
  const res = await apiRequest(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
  return res.ok ? await res.json() : null;
}

const vendors = [
  { id: 'loom', name: 'LOOM & GRACE', category: 'Dresses & Occasion Wear', location: 'Dhaka', status: 'Active' },
  { id: 'thread', name: 'THREAD REPUBLIC', category: 'Tops & Knitwear', location: 'Chittagong', status: 'Active' },
  { id: 'nakshi', name: 'NAKSHI STUDIO', category: 'Ethnic & Embroidered', location: 'Rajshahi', status: 'Active' },
  { id: 'zephyr', name: 'ZEPHYR CUTS', category: 'Tailored Bottoms & Outerwear', location: 'Dhaka', status: 'Active' },
  { id: 'adorn', name: 'ADORN CO.', category: 'Accessories & Jewellery', location: 'Sylhet', status: 'Active' },
];

const crmScores = { 'nusrat@email.com': 'vip', 'rafiq@email.com': 'warm', 'sabrina@email.com': 'hot' };
let crmFU = {
  'nusrat@email.com': [{ type: 'email', msg: 'New Kantha Jacket drop re-engagement', date: '2026-06-25', done: false }, { type: 'sms', msg: 'Loyalty discount code sent', date: '2026-06-20', done: true }],
  'rafiq@email.com': [{ type: 'call', msg: 'Check on shipped order DRAPE-1002', date: '2026-06-24', done: false }],
  'sabrina@email.com': [{ type: 'email', msg: 'COD order confirmation follow-up', date: '2026-06-23', done: false }],
};

const socialPosts = {
  instagram: [
    { text: 'New drop 🌿 The Muslin Wrap Dress by LOOM & GRACE is now live. Link in bio. #DRAPE #DhakaFashion #SustainableStyle', emoji: '👗', likes: 842, comments: 67, status: 'live', date: '2026-06-20' },
    { text: 'Behind the scenes at NAKSHI STUDIO, Rajshahi. 220 artisans. Every stitch, intentional. #EthicalFashion #NakshiKantha', emoji: '🎨', likes: 1204, comments: 112, status: 'live', date: '2026-06-18' },
    { text: 'The Linen Blazer is on SALE. 20% off this week only. Link in bio 🔥', emoji: '🧥', likes: 634, comments: 44, status: 'live', date: '2026-06-15' },
    { text: 'Upcoming: The SS/26 Collection drops next week. Stay tuned ✨', emoji: '✨', likes: 0, comments: 0, status: 'scheduled', date: '2026-06-28' },
  ],
  facebook: [
    { text: 'DRAPE x THREAD REPUBLIC: Recycled knitwear that looks like a million takas. Shop now at drape.fashion 🔗', emoji: '✂️', likes: 312, comments: 28, status: 'live', date: '2026-06-19' },
    { text: 'We just added 10 new products to the catalog — including the Brass Cuff Set from ADORN CO. Check out the full collection.', emoji: '📿', likes: 198, comments: 15, status: 'live', date: '2026-06-17' },
  ],
  tiktok: [
    { text: "POV: You just found Bangladesh's most ethical fashion brand 🇧🇩 #DRAPE #FashionTok #Bangladesh", emoji: '🎬', likes: 4200, comments: 234, status: 'live', date: '2026-06-21' },
    { text: 'GRWM: Wearing DRAPE head to toe for a wedding in Dhaka ✨ #OOTD #DhakaFashion #WeddingStyle', emoji: '🎵', likes: 8100, comments: 445, status: 'live', date: '2026-06-16' },
  ],
  linkedin: [
    { text: 'Building a fashion company that runs entirely on systems. No spreadsheets. No gut calls. Just data, design, and five incredible artisan brand partners. Thread on what DRAPE FashionOS looks like under the hood 👇', emoji: '💼', likes: 87, comments: 22, status: 'live', date: '2026-06-18' },
    { text: "We're hiring a Head of Growth. If you've scaled a D2C brand in South Asia and care about craft + sustainability — DM me.", emoji: '📢', likes: 143, comments: 38, status: 'live', date: '2026-06-12' },
  ],
};

// ─── LOCAL STORAGE PERSISTENCE (local-only data) ───
function loadState() {
  try {
    const savedCart = localStorage.getItem('drape_cart');
    const savedCRM = localStorage.getItem('drape_crm');
    const savedScheduled = localStorage.getItem('drape_scheduled');
    const savedTheme = localStorage.getItem('drape_theme');
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedCRM) crmFU = JSON.parse(savedCRM);
    if (savedScheduled) scheduledPosts = JSON.parse(savedScheduled);
    if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
    else document.documentElement.setAttribute('data-theme', 'light');
  } catch (e) { console.warn('LocalStorage load failed:', e); }
}

function saveState() {
  try {
    localStorage.setItem('drape_cart', JSON.stringify(cart));
    localStorage.setItem('drape_crm', JSON.stringify(crmFU));
    localStorage.setItem('drape_scheduled', JSON.stringify(scheduledPosts));
    localStorage.setItem('drape_theme', document.documentElement.getAttribute('data-theme') || 'light');
  } catch (e) { console.warn('LocalStorage save failed:', e); }
}

// ─── THEME ───
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  saveState();
}

// ─── MOBILE NAV ───
function openMobileNav() { document.getElementById('mobileNavOverlay').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeMobileNav(e) {
  if (!e || e.target.id === 'mobileNavOverlay') {
    document.getElementById('mobileNavOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ─── INIT ───
let isAdmin = false;

function showLogin() {
  const ov = document.getElementById('loginOverlay');
  if (ov) ov.classList.remove('hidden');
}
function hideLogin() {
  const ov = document.getElementById('loginOverlay');
  if (ov) ov.classList.add('hidden');
}

async function doLogin() {
  const input = document.getElementById('loginPassword');
  const error = document.getElementById('loginError');
  if (!input) return;
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: input.value })
    });
    const data = await res.json();
    if (res.ok && data.accessToken) {
      accessToken = data.accessToken;
      refreshToken = data.refreshToken;
      sessionStorage.setItem('drape_refresh_token', refreshToken);
      isAdmin = true;
      hideLogin();
      initApp();
      if (error) error.classList.remove('show');
    } else {
      if (error) { error.textContent = data.error || 'Invalid password'; error.classList.add('show'); }
    }
  } catch (e) {
    console.error('Login error:', e);
    if (error) { error.textContent = 'Network error. Is the server running?'; error.classList.add('show'); }
  }
}

async function doLogout() {
  try {
    if (refreshToken) {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
    }
  } catch (e) { /* ignore */ }
  accessToken = null;
  refreshToken = null;
  sessionStorage.removeItem('drape_refresh_token');
  isAdmin = false;
  location.reload();
}

async function checkLogin() {
  const storedRefresh = sessionStorage.getItem('drape_refresh_token');
  if (storedRefresh) {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: storedRefresh })
      });
      if (res.ok) {
        const data = await res.json();
        accessToken = data.accessToken;
        refreshToken = storedRefresh;
        isAdmin = true;
        hideLogin();
        initApp();
        return;
      }
    } catch (e) { /* refresh failed */ }
    sessionStorage.removeItem('drape_refresh_token');
  }
  showLogin();
}

async function initApp() {
  loadState();
  document.getElementById('adminDate').textContent = new Date().toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  await loadProductsFromAPI();
  await loadOrdersFromAPI();
  initWaChats();
  renderAll();
  updateDash();
  renderCRMList();
  let i = 0; const t = setInterval(() => {
    const el = document.getElementById('heroCount');
    if (el) el.textContent = i++;
    if (i > products.length) clearInterval(t);
  }, 40);
}

// ─── NAVIGATION ───
function showPage(n) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + n);
  if (page) page.classList.add('active');
  window.scrollTo(0, 0);
  if (n === 'shop') renderShopGrid(products);
  if (n === 'admin') updateDash();
  if (n === 'home') renderFeatured();
  if (n === 'checkout') renderCoSummary();
  if (n === 'catalog') renderCatalog('all');
  if (n === 'crm') renderCRMList();
  if (n === 'social') showSocialPage('overview', document.querySelector('.social-nav-btn'));
  if (n === 'whatsapp') { if (waChats.length === 0) initWaChats(); }
  if (n === 'track') { /* track page is static */ }
  if (n === 'vendor') renderVendorPortal();
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const activeLink = document.querySelector('.nav-link[onclick*="showPage(\'' + n + '\')"]');
  if (activeLink) activeLink.classList.add('active');
}

function showAdminPage(n, btn) {
  document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('admin-' + n);
  if (page) page.classList.add('active');
  document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (n === 'orders') renderOrders();
  if (n === 'inventory') renderInv();
  if (n === 'vendors') renderVendors();
  if (n === 'customers') renderCustomers();
  if (n === 'analytics') renderAnalytics();
}

function showBrand(id, btn) {
  document.querySelectorAll('.brand-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.brand-tab').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('brand-' + id);
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');
}

function showCat(sec, btn) {
  document.querySelectorAll('.cat-nav-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderCatalog(sec);
}

function showSocialPage(name, btn) {
  document.querySelectorAll('.social-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.social-nav-btn').forEach(b => b.classList.remove('active'));
  const page = document.getElementById('social-' + name);
  if (page) page.classList.add('active');
  if (btn) btn.classList.add('active');
  if (name === 'overview') renderSocialOverview();
  if (name === 'instagram') renderPlatformPosts('instagram', 'igPostsGrid');
  if (name === 'facebook') renderPlatformPosts('facebook', 'fbPostsGrid');
  if (name === 'tiktok') renderPlatformPosts('tiktok', 'ttPostsGrid');
  if (name === 'linkedin') renderPlatformPosts('linkedin', 'liPostsGrid');
  if (name === 'scheduler') renderSchedule();
}

function showVendorTab(name, btn) {
  document.querySelectorAll('.vendor-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.vendor-tab').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('vendor-' + name);
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');
  if (name === 'products') renderVendorProducts();
  if (name === 'orders') renderVendorOrders();
  if (name === 'analytics') renderVendorAnalytics();
}

// ─── RENDERING ───
function renderAll() { renderFeatured(); renderShopGrid(products); renderInv(); }

function pCard(p) {
  const bt = p.stock === 0 ? 'Sold Out' : (p.origPrice ? 'Sale' : (p.badge || ''));
  const bc = p.stock === 0 ? 'badge-out' : (p.origPrice ? 'badge-sale' : '');
  return `<div class="product-card" onclick="openModal(${p.id})">
    ${bt ? `<div class="product-badge ${bc}">${bt}</div>` : ''}
    <div class="product-img">${p.emoji}</div>
    <div class="product-overlay"><button class="overlay-btn">Quick View</button></div>
    <div class="product-info">
      <div class="product-category">${p.category}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-vendor">${p.vendor}</div>
      <div class="product-price-row">
        <div class="product-price mono">৳${p.price.toLocaleString()}</div>
        ${p.origPrice ? `<div class="product-orig mono">৳${p.origPrice.toLocaleString()}</div>` : ''}
      </div>
      <div class="variant-dots">${p.colors.slice(0, 5).map(c => `<div class="variant-dot" style="background:${c.hex}" title="${c.name}"></div>`).join('')}</div>
    </div>
  </div>`;
}

function renderFeatured() {
  const el = document.getElementById('featuredGrid');
  if (el) el.innerHTML = [...products].filter(p => p.stock > 0).slice(0, 4).map(pCard).join('');
  const hc = document.getElementById('heroCount');
  if (hc) hc.textContent = products.length;
}

function renderShopGrid(list) {
  const el = document.getElementById('shopGrid');
  if (el) el.innerHTML = list.length ? list.map(pCard).join('') : '<div style="padding:56px;color:var(--slate)">No products found.</div>';
  const pc = document.getElementById('productCount');
  if (pc) pc.textContent = list.length + ' pieces';
}

function filterP(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const f = cat === 'All' ? products : cat === '__sale__' ? products.filter(p => p.origPrice) : products.filter(p => p.category === cat);
  renderShopGrid(f);
}

function renderCatalog(sec) {
  const main = document.getElementById('catMain');
  if (!main) return;
  let filtered = products, title = 'All Products';
  if (sec === 'dresses') { filtered = products.filter(p => p.category === 'Dresses'); title = 'Dresses'; }
  else if (sec === 'tops') { filtered = products.filter(p => p.category === 'Tops'); title = 'Tops'; }
  else if (sec === 'bottoms') { filtered = products.filter(p => p.category === 'Bottoms'); title = 'Bottoms'; }
  else if (sec === 'outerwear') { filtered = products.filter(p => p.category === 'Outerwear'); title = 'Outerwear'; }
  else if (sec === 'accessories') { filtered = products.filter(p => p.category === 'Accessories'); title = 'Accessories'; }
  else if (sec === 'b_loom') { filtered = products.filter(p => p.vendor === 'LOOM & GRACE'); title = 'LOOM & GRACE'; }
  else if (sec === 'b_thread') { filtered = products.filter(p => p.vendor === 'THREAD REPUBLIC'); title = 'THREAD REPUBLIC'; }
  else if (sec === 'b_nakshi') { filtered = products.filter(p => p.vendor === 'NAKSHI STUDIO'); title = 'NAKSHI STUDIO'; }
  else if (sec === 'b_zephyr') { filtered = products.filter(p => p.vendor === 'ZEPHYR CUTS'); title = 'ZEPHYR CUTS'; }
  else if (sec === 'b_adorn') { filtered = products.filter(p => p.vendor === 'ADORN CO.'); title = 'ADORN CO.'; }

  if (sec === 'all') {
    const cats = [...new Set(products.map(p => p.category))];
    main.innerHTML = `<h2 style="font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:300;margin-bottom:28px">Full Catalog</h2>` +
      cats.map(cat => {
        const cp = products.filter(p => p.category === cat);
        return `<div class="sub-group">
          <div class="sub-group-title">${cat}</div>
          <div class="sub-group-desc">${cp.length} products · ${[...new Set(cp.map(p => p.vendor))].join(', ')}</div>
          <div class="sub-grid">${cp.map(p => subCard(p)).join('')}</div>
        </div>`;
      }).join('');
  } else {
    main.innerHTML = `<h2 style="font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:300;margin-bottom:28px">${title}</h2>` +
      filtered.map(p => `<div class="sub-group">
        <div class="sub-group-title">${p.name}</div>
        <div class="sub-group-desc">
          <span style="color:var(--copper);font-size:10px;letter-spacing:.08em;text-transform:uppercase">${p.vendor}</span> ·
          ${p.colors.length} colors · ${p.subs.length} cut variants · ৳${p.price.toLocaleString()}
          ${p.origPrice ? `<span style="text-decoration:line-through;color:var(--slate);margin-left:6px">৳${p.origPrice.toLocaleString()}</span>` : ''}
        </div>
        ${p.subs.length ? `<div class="sub-grid">${p.subs.map(s => `
          <div class="sub-card" onclick="openModal(${p.id})">
            <div class="sub-card-img">${s.emoji}</div>
            <div class="sub-card-info">
              <div class="sub-card-name">${s.name}</div>
              <div class="sub-card-price mono">৳${s.price.toLocaleString()}</div>
              <div class="sub-card-dots">${p.colors.map(c => `<div class="sub-dot" style="background:${c.hex}" title="${c.name}"></div>`).join('')}</div>
            </div>
          </div>`).join('')}</div>
          <div style="margin-top:14px"><button class="admin-btn sm" onclick="openModal(${p.id})">Full Product Details →</button></div>`
          : `<div style="font-size:11px;color:var(--slate)">No sub-variants.</div>`}
      </div>`).join('');
  }
}

function subCard(p) {
  return `<div class="sub-card" onclick="openModal(${p.id})">
    <div class="sub-card-img">${p.emoji}</div>
    <div class="sub-card-info">
      <div class="sub-card-name">${p.name}</div>
      <div class="sub-card-price mono">৳${p.price.toLocaleString()}</div>
      <div class="sub-card-dots">${p.colors.map(c => `<div class="sub-dot" style="background:${c.hex}"></div>`).join('')}</div>
    </div>
  </div>`;
}

// ─── MODAL ───
function openModal(id) {
  selProd = products.find(p => p.id === id); if (!selProd) return;
  selColor = null; selSize = null; mQty = 1;
  const mi = document.getElementById('modalImg');
  if (mi) mi.innerHTML = `<span style="font-size:88px">${selProd.emoji}</span>`;
  const mc = document.getElementById('modalCat');
  if (mc) mc.textContent = selProd.category;
  const mv = document.getElementById('modalVendor');
  if (mv) mv.textContent = '↳ ' + selProd.vendor;
  const mn = document.getElementById('modalName');
  if (mn) mn.textContent = selProd.name;
  const mp = document.getElementById('modalPrice');
  if (mp) mp.textContent = '৳' + selProd.price.toLocaleString();
  const qn = document.getElementById('qtyNum');
  if (qn) qn.textContent = 1;
  const ms = document.getElementById('modalStock');
  if (ms) ms.textContent = selProd.stock > 0 ? selProd.stock + ' in stock' : '⚠ Out of stock';
  const ori = document.getElementById('modalOrig'), dis = document.getElementById('modalDisc');
  if (selProd.origPrice) {
    if (ori) { ori.textContent = '৳' + selProd.origPrice.toLocaleString(); ori.style.display = 'block'; }
    if (dis) { dis.textContent = Math.round((1 - selProd.price / selProd.origPrice) * 100) + '% off'; dis.style.display = 'block'; }
  } else {
    if (ori) ori.style.display = 'none';
    if (dis) dis.style.display = 'none';
  }
  const md = document.getElementById('modalDesc');
  if (md) md.textContent = selProd.desc;
  const mt = document.getElementById('modalThumbs');
  if (mt) mt.innerHTML = selProd.subs.map((s, i) => `<div class="modal-thumb ${i === 0 ? 'active' : ''}" onclick="selThumb(this,${s.price})" title="${s.name}"><span>${s.emoji}</span><div class="modal-thumb-label">${s.name}</div></div>`).join('');
  const cs = document.getElementById('colorSwatches');
  if (cs) cs.innerHTML = selProd.colors.map(c => `<div class="swatch" style="background:${c.hex}" onclick="selColorFn('${c.name}','${c.hex}',this)" title="${c.name}"></div>`).join('');
  const cl = document.getElementById('colorLabel');
  if (cl) cl.textContent = '';
  const so = document.getElementById('sizeOptions');
  if (so) so.innerHTML = selProd.sizes.map(s => `<button class="size-btn" onclick="selSizeFn('${s}',this)">${s}</button>`).join('');
  const sl = document.getElementById('sizeLabel');
  if (sl) sl.textContent = '';
  const st = document.getElementById('specTable');
  if (st) st.innerHTML = `<tr><td>Material</td><td>${selProd.material || '—'}</td></tr><tr><td>Care</td><td>${selProd.care || '—'}</td></tr><tr><td>Origin</td><td>${selProd.origin || '—'}</td></tr><tr><td>Variants</td><td>${selProd.subs.length} cuts · ${selProd.colors.length} colors</td></tr>`;
  const mo = document.getElementById('productModal');
  if (mo) { mo.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function selThumb(el, price) {
  document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const mp = document.getElementById('modalPrice');
  if (mp) mp.textContent = '৳' + price.toLocaleString();
}
function selColorFn(name, hex, el) {
  selColor = name;
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  const cl = document.getElementById('colorLabel');
  if (cl) cl.textContent = name;
  const mi = document.getElementById('modalImg');
  if (mi) mi.innerHTML = `<span style="font-size:88px">${selProd.emoji}</span><div style="width:28px;height:28px;border-radius:50%;background:${hex};border:2px solid rgba(0,0,0,.1);margin-top:8px"></div>`;
}
function selSizeFn(size, btn) {
  selSize = size;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const sl = document.getElementById('sizeLabel');
  if (sl) sl.textContent = size;
}
function changeQty(d) { mQty = Math.max(1, Math.min(mQty + d, selProd?.stock || 1)); const qn = document.getElementById('qtyNum'); if (qn) qn.textContent = mQty; }
function closeMBg(e) { if (e.target.id === 'productModal') closeMDirect(); }
function closeMDirect() { const mo = document.getElementById('productModal'); if (mo) mo.classList.remove('open'); document.body.style.overflow = ''; }
function addToCartModal() {
  if (!selProd) return;
  if (selProd.stock === 0) { showToast('Out of stock.', 'error'); return; }
  if (!selSize) { showToast('Select a size.', 'error'); return; }
  if (!selColor) { showToast('Select a color.', 'error'); return; }
  addToCart(selProd, selSize, selColor, mQty); closeMDirect();
}
function addToCart(prod, size, color, qty = 1) {
  const key = `${prod.id}-${size}-${color}`;
  const ex = cart.find(i => i.key === key);
  if (ex) ex.qty += qty; else cart.push({ key, prod, size, color, qty });
  updateCartUI(); saveState(); showToast(`${prod.name} (${color}) added.`, 'success');
}
function removeFromCart(key) { cart = cart.filter(i => i.key !== key); updateCartUI(); saveState(); }
function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const cc = document.getElementById('cartCount');
  if (cc) cc.textContent = count;
  const con = document.getElementById('cartItems'), foot = document.getElementById('cartFooter');
  if (!cart.length) {
    if (con) con.innerHTML = `<div class="cart-empty"><div style="font-size:38px;opacity:.3">🛍</div><div style="font-size:12px">Your bag is empty.</div><button class="btn-primary" style="margin-top:7px;font-size:10px" onclick="toggleCart();showPage('shop')">Shop Now</button></div>`;
    if (foot) foot.style.display = 'none';
    return;
  }
  if (con) con.innerHTML = cart.map(i => `<div class="cart-item"><div class="cart-item-img">${i.prod.emoji}</div><div class="cart-item-details"><div class="cart-item-name">${i.prod.name}</div><div class="cart-item-meta">${i.color} · ${i.size} · Qty ${i.qty}</div><div class="cart-item-price mono">৳${(i.prod.price * i.qty).toLocaleString()}</div></div><button class="cart-item-remove" onclick="removeFromCart('${i.key}')">×</button></div>`).join('');
  const sub = cart.reduce((s, i) => s + i.prod.price * i.qty, 0), ship = sub > 3000 ? 0 : 80;
  const cs = document.getElementById('cartSubtotal');
  if (cs) cs.textContent = '৳' + sub.toLocaleString();
  const csh = document.getElementById('cartShipping');
  if (csh) csh.textContent = ship === 0 ? 'Free' : '৳' + ship;
  const ct = document.getElementById('cartTotal');
  if (ct) ct.textContent = '৳' + (sub + ship).toLocaleString();
  if (foot) foot.style.display = 'block';
}
function toggleCart() { const cd = document.getElementById('cartDrawer'); if (cd) cd.classList.toggle('open'); }
function goCheckout() { if (!cart.length) return; toggleCart(); showPage('checkout'); }

// ─── CHECKOUT ───
function renderCoSummary() {
  const csi = document.getElementById('coSummaryItems');
  if (csi) csi.innerHTML = cart.map(i => `<div style="display:flex;gap:12px;margin-bottom:16px"><div style="width:56px;height:70px;background:var(--dust);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${i.prod.emoji}</div><div><div style="font-size:12px;font-weight:500">${i.prod.name}</div><div style="font-size:10px;color:var(--slate)">${i.color} · ${i.size} · Qty ${i.qty}</div><div style="font-family:'DM Mono',monospace;font-size:11px;margin-top:2px">৳${(i.prod.price * i.qty).toLocaleString()}</div></div></div>`).join('');
  const sub = cart.reduce((s, i) => s + i.prod.price * i.qty, 0), ship = sub > 3000 ? 0 : 80;
  const cs = document.getElementById('co_sub');
  if (cs) cs.textContent = '৳' + sub.toLocaleString();
  const csh = document.getElementById('co_ship');
  if (csh) csh.textContent = ship === 0 ? 'Free' : '৳' + ship;
  const ct = document.getElementById('co_total');
  if (ct) ct.textContent = '৳' + (sub + ship).toLocaleString();
}
function selectPay(m, el) {
  selPay = m;
  document.querySelectorAll('.pay-method').forEach(x => x.classList.remove('selected'));
  if (el) el.classList.add('selected');
  document.querySelectorAll('.pf').forEach(f => f.classList.remove('show'));
  if (m === 'card') { const p = document.getElementById('pf_card'); if (p) p.classList.add('show'); }
  if (m === 'bkash') { const p = document.getElementById('pf_bkash'); if (p) p.classList.add('show'); }
  if (m === 'nagad') { const p = document.getElementById('pf_nagad'); if (p) p.classList.add('show'); }
}
function fmtCard(el) { let v = el.value.replace(/\D/g, '').substring(0, 16); el.value = v.match(/.{1,4}/g)?.join(' ') || v; }
function fmtExp(el) { let v = el.value.replace(/\D/g, '').substring(0, 4); if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2); el.value = v; }
function validateCo() {
  const req = ['co_fname', 'co_lname', 'co_email', 'co_phone', 'co_addr'];
  let ok = true;
  req.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!el.value.trim()) { el.classList.add('err'); ok = false; } else el.classList.remove('err');
  });
  return ok;
}

// Legacy placeOrder (kept for fallback, but checkout now uses gateway)
function placeOrder() {
  if (!cart.length) { showToast('Bag is empty.', 'error'); return; }
  if (!validateCo()) { showToast('Fill in all required fields.', 'error'); return; }
  const btn = document.getElementById('placeBtn');
  if (btn) { btn.textContent = 'Processing...'; btn.disabled = true; }
  setTimeout(async () => {
    const sub = cart.reduce((s, i) => s + i.prod.price * i.qty, 0), ship = sub > 3000 ? 0 : 80;
    const orderPayload = {
      customer_fname: document.getElementById('co_fname').value,
      customer_lname: document.getElementById('co_lname').value,
      email: document.getElementById('co_email').value,
      phone: document.getElementById('co_phone').value,
      address: document.getElementById('co_addr').value,
      city: document.getElementById('co_city').value,
      postcode: document.getElementById('co_zip').value,
      items: cart.map(i => ({ id: i.prod.id, name: i.prod.name, price: i.prod.price, qty: i.qty, size: i.size, color: i.color, emoji: i.prod.emoji })),
      subtotal: sub,
      shipping: ship,
      total: sub + ship,
      payment_method: selPay
    };
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (res.ok) {
        cart.forEach(i => { const p = products.find(x => x.id === i.prod.id); if (p) { p.stock = Math.max(0, p.stock - i.qty); p.sold = (p.sold || 0) + i.qty; } });
        const coid = document.getElementById('confirmedOID');
        if (coid) coid.textContent = data.orderId;
        cart = []; updateCartUI(); saveState();
        showPage('confirmed'); updateDash(); renderCRMList();
      } else {
        showToast(data.error || 'Order failed', 'error');
      }
    } catch (e) {
      console.error('Order error:', e);
      showToast('Network error. Please try again.', 'error');
    }
    if (btn) { btn.textContent = 'Place Order →'; btn.disabled = false; }
  }, 1800);
}

// ─── PAYMENT GATEWAY ───
function openPayGateway() {
  if (!cart.length) { showToast('Bag is empty.', 'error'); return; }
  if (!validateCo()) { showToast('Fill in all required fields.', 'error'); return; }
  const sub = cart.reduce((s, i) => s + i.prod.price * i.qty, 0), ship = sub > 3000 ? 0 : 80;
  const pa = document.getElementById('pgwAmount');
  if (pa) pa.textContent = '৳' + (sub + ship).toLocaleString();
  pgwOrderData = {
    fname: document.getElementById('co_fname').value, lname: document.getElementById('co_lname').value,
    email: document.getElementById('co_email').value, phone: document.getElementById('co_phone').value,
    city: document.getElementById('co_city').value, addr: document.getElementById('co_addr').value, total: sub + ship
  };
  const pf = document.getElementById('pgwForm');
  if (pf) pf.style.display = 'block';
  const pp = document.getElementById('pgwProcessing');
  if (pp) pp.classList.remove('show');
  const ps = document.getElementById('pgwSuccess');
  if (ps) ps.classList.remove('show');
  const po = document.getElementById('pgwOtpBox');
  if (po) po.classList.remove('show');
  const ov = document.getElementById('pgwOverlay');
  if (ov) { ov.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closePgw() { const ov = document.getElementById('pgwOverlay'); if (ov) ov.classList.remove('open'); document.body.style.overflow = ''; }
function selPgwMethod(method, el) {
  pgwMethod = method;
  document.querySelectorAll('.pgw-method').forEach(m => m.classList.remove('sel'));
  if (el) el.classList.add('sel');
  const cf = document.getElementById('pgw_card_fields'); if (cf) cf.style.display = 'none';
  const bf = document.getElementById('pgw_bkash_fields'); if (bf) bf.style.display = 'none';
  const nf = document.getElementById('pgw_nagad_fields'); if (nf) nf.style.display = 'none';
  const df = document.getElementById('pgw_cod_fields'); if (df) df.style.display = 'none';
  if (method === 'card') { if (cf) cf.style.display = 'block'; }
  if (method === 'bkash') { if (bf) bf.style.display = 'block'; }
  if (method === 'nagad') { if (nf) nf.style.display = 'block'; }
  if (method === 'cod') { if (df) df.style.display = 'block'; }
  const labels = { card: 'Pay Securely', bkash: 'Pay with bKash', nagad: 'Pay with Nagad', cod: 'Confirm Order' };
  const pl = document.getElementById('pgwPayBtnLabel');
  if (pl) pl.textContent = labels[method] || 'Pay Securely';
}
function pgwFmtCard(el) { let v = el.value.replace(/\D/g, '').substring(0, 16); el.value = v.match(/.{1,4}/g)?.join(' ') || v; }
function pgwFmtExp(el) { let v = el.value.replace(/\D/g, '').substring(0, 4); if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2); el.value = v; }
function pgwOtpNext(el, pos) { if (el.value && pos < 6) { const inputs = document.querySelectorAll('.pgw-otp-digit'); if (inputs[pos]) inputs[pos].focus(); } }
function pgwPay() {
  if (pgwMethod === 'bkash') {
    const num = document.getElementById('pgw_bkash');
    if (num && !num.value) { num.classList.add('invalid'); return; }
    const po = document.getElementById('pgwOtpBox');
    if (po && !po.classList.contains('show')) { po.classList.add('show'); const pl = document.getElementById('pgwPayBtnLabel'); if (pl) pl.textContent = 'Confirm OTP & Pay'; return; }
    const otp = document.querySelectorAll('.pgw-otp-digit');
    const filled = Array.from(otp).every(d => d.value);
    if (!filled) { showToast('Enter OTP sent to your bKash.'); return; }
  }
  runPgwProcessing();
}
function runPgwProcessing() {
  const pf = document.getElementById('pgwForm');
  if (pf) pf.style.display = 'none';
  const proc = document.getElementById('pgwProcessing');
  if (proc) proc.classList.add('show');
  const methodLabels = { card: 'Card Network', bkash: 'bKash Gateway', nagad: 'Nagad Gateway', cod: 'Order System' };
  const steps = [
    { label: 'Connecting to ' + methodLabels[pgwMethod], delay: 600 },
    { label: 'Verifying payment details', delay: 1200 },
    { label: '3D Secure authentication', delay: 1900 },
    { label: 'Processing transaction', delay: 2600 },
    { label: 'Confirming with bank', delay: 3300 },
    { label: 'Generating receipt', delay: 3900 },
  ];
  if (pgwMethod === 'cod') steps.splice(2, 2);
  const stepsEl = document.getElementById('pgwSteps');
  if (stepsEl) stepsEl.innerHTML = steps.map((s, i) => `<div class="pgw-step pending" id="pgwStep${i}"><span class="pgw-step-icon">⏳</span>${s.label}</div>`).join('');
  steps.forEach((s, i) => {
    setTimeout(() => {
      document.querySelectorAll('.pgw-step').forEach((el, j) => {
        if (j < i) { el.className = 'pgw-step done'; const icon = el.querySelector('.pgw-step-icon'); if (icon) icon.textContent = '✓'; }
        else if (j === i) { el.className = 'pgw-step active'; const icon = el.querySelector('.pgw-step-icon'); if (icon) icon.textContent = '⟳'; }
      });
      const ps = document.getElementById('pgwProgressSub');
      if (ps) ps.textContent = s.label + '...';
    }, s.delay);
  });
  setTimeout(() => { if (proc) proc.classList.remove('show'); finalizePgwOrder(); }, 4400);
}
function finalizePgwOrder() {
  const oid = 'DRAPE-' + (1005 + orders.length);
  const sub = cart.reduce((s, i) => s + i.prod.price * i.qty, 0), ship = sub > 3000 ? 0 : 80;
  const order = {
    id: oid, name: pgwOrderData.fname + ' ' + pgwOrderData.lname,
    email: pgwOrderData.email, phone: pgwOrderData.phone, city: pgwOrderData.city,
    items: cart.map(i => ({ ...i.prod, qty: i.qty, size: i.size, color: i.color })),
    payment: pgwMethod, status: 'confirmed', date: new Date().toISOString().split('T')[0], total: sub + ship
  };
  cart.forEach(i => { const p = products.find(x => x.id === i.prod.id); if (p) { p.stock = Math.max(0, p.stock - i.qty); p.sold = (p.sold || 0) + i.qty; } });
  orders.push(order); cart = []; updateCartUI(); saveState(); updateDash(); renderCRMList();
  const txnId = 'TXN' + Date.now().toString().slice(-10).toUpperCase();
  const pt = document.getElementById('pgwTxnId');
  if (pt) pt.textContent = 'Transaction ID: ' + txnId + ' · Order: ' + oid;
  const coid = document.getElementById('confirmedOID');
  if (coid) coid.textContent = oid;
  const ps = document.getElementById('pgwSuccess');
  if (ps) ps.classList.add('show');
  addWaNotification(order);
}
function pgwFinish() { closePgw(); showPage('confirmed'); }

// ─── ADMIN ───
function updateDash() {
  const rev = orders.reduce((s, o) => s + (o.total || 0), 0);
  const tod = orders.filter(o => o.date === new Date().toISOString().split('T')[0]).length;
  const sr = document.getElementById('st_rev'); if (sr) sr.textContent = '৳' + rev.toLocaleString();
  const so = document.getElementById('st_ord'); if (so) so.textContent = orders.length;
  const sp = document.getElementById('st_prod'); if (sp) sp.textContent = products.length;
  const sc = document.getElementById('st_cust'); if (sc) sc.textContent = [...new Set(orders.map(o => o.email))].length;
  const sod = document.getElementById('st_ord_d'); if (sod) sod.textContent = '+' + tod + ' today';
  const srd = document.getElementById('st_rev_d'); if (srd) srd.textContent = orders.length ? 'avg ৳' + Math.round(rev / orders.length).toLocaleString() + '/order' : '';
  renderRecentOrders(); renderRevChart();
}
function renderRecentOrders() {
  const tb = document.getElementById('recentOBody');
  if (tb) tb.innerHTML = [...orders].reverse().slice(0, 5).map(o => `<tr><td class="mono" style="font-size:10px;color:var(--copper)">${o.id}</td><td>${o.name}</td><td>${o.items.length}</td><td class="mono">৳${(o.total || 0).toLocaleString()}</td><td><span class="status-badge badge-${o.status}">${o.status}</span></td><td style="color:var(--slate);font-size:10px">${o.date}</td></tr>`).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--slate);padding:24px">No orders yet.</td></tr>';
}
function renderOrders() {
  const ab = document.getElementById('allOBody');
  if (ab) ab.innerHTML = [...orders].reverse().map(o => `<tr><td class="mono" style="font-size:10px;color:var(--copper)">${o.id}</td><td>${o.name}</td><td>${o.items.length}</td><td class="mono">৳${(o.total || 0).toLocaleString()}</td><td style="font-size:10px;text-transform:capitalize">${o.payment}</td><td><select class="form-select" style="padding:2px 6px;font-size:10px;width:auto" onchange="updOrdStatus('${o.id}',this.value)">${['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select></td><td style="color:var(--slate);font-size:10px">${o.date}</td><td><button class="admin-btn sm danger" onclick="cancelOrd('${o.id}')">✗</button></td></tr>`).join('') || '<tr><td colspan="8" style="text-align:center;color:var(--slate);padding:24px">No orders yet.</td></tr>';
}
async function updOrdStatus(id, s) { 
  const res = await apiRequest(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status: s }) });
  if (res.ok) {
    await loadOrdersFromAPI();
    renderOrders();
    showToast(id + ' → ' + s, 'success');
  }
}
async function cancelOrd(id) { 
  const res = await apiRequest(`/orders/${id}`, { method: 'DELETE' });
  if (res.ok) {
    await loadOrdersFromAPI();
    renderOrders();
    showToast('Order cancelled.');
  }
}
function renderInv() {
  const ib = document.getElementById('invBody');
  if (ib) ib.innerHTML = products.map(p => {
    const sc = p.stock === 0 ? 'stock-out' : (p.stock < 10 ? 'stock-low' : 'stock-ok');
    const sl = p.stock === 0 ? '✗ Out' : (p.stock < 10 ? '⚠ Low' : '✓ OK');
    return `<tr><td>${p.emoji} ${p.name}</td><td style="font-size:10px;color:var(--copper)">${p.vendor}</td><td style="font-size:10px;color:var(--slate)">${p.category}</td><td class="mono">৳${p.price.toLocaleString()}${p.origPrice ? `<br><span style="text-decoration:line-through;opacity:.5;font-size:9px">৳${p.origPrice.toLocaleString()}</span>` : ''}</td><td>${p.colors.map(c => `<span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${c.hex};border:1px solid rgba(0,0,0,.1);margin-right:2px" title="${c.name}"></span>`).join('')}</td><td class="mono" style="font-size:10px">${p.subs.length} cuts</td><td class="mono">${p.stock}</td><td class="${sc}" style="font-size:10px;font-family:'DM Mono',monospace">${sl}</td><td style="display:flex;gap:5px"><button class="admin-btn sm" onclick="editProd(${p.id})">Edit</button><button class="admin-btn sm danger" onclick="delProd(${p.id})">Del</button></td></tr>`;
  }).join('');
}
function renderVendors() {
  const vb = document.getElementById('vendBody');
  if (vb) vb.innerHTML = vendors.map(v => {
    const rev = orders.reduce((s, o) => s + o.items.filter(i => i.vendor === v.name).reduce((ss, i) => ss + (i.price * i.qty), 0), 0);
    const skus = products.filter(p => p.vendor === v.name).length;
    return `<tr><td style="font-weight:500">${v.name}</td><td style="font-size:10px;color:var(--slate)">${v.category}</td><td>${v.location}</td><td class="mono">${skus}</td><td class="mono">৳${rev.toLocaleString()}</td><td><span class="status-badge badge-shipped" style="font-size:8px">${v.status}</span></td><td><button class="admin-btn sm" onclick="showPage('brands');setTimeout(()=>showBrand('${v.id}',null),100)">View</button></td></tr>`;
  }).join('');
}
function renderCustomers() {
  const cm = {};
  orders.forEach(o => { if (!cm[o.email]) cm[o.email] = { name: o.name, email: o.email, city: o.city, orders: 0, spent: 0 }; cm[o.email].orders++; cm[o.email].spent += o.total || 0; });
  const custs = Object.values(cm);
  const cb = document.getElementById('custBody');
  if (cb) cb.innerHTML = custs.length ? custs.map(c => `<tr><td>${c.name}</td><td style="font-size:10px;color:var(--slate)">${c.email}</td><td>${c.city}</td><td class="mono">${c.orders}</td><td class="mono">৳${c.spent.toLocaleString()}</td><td><button class="admin-btn sm ok" onclick="openCRMCust_admin('${c.email}')">CRM →</button></td></tr>`).join('') : '<tr><td colspan="6" style="text-align:center;color:var(--slate);padding:24px">No customers yet.</td></tr>';
}
function renderAnalytics() {
  const rev = orders.reduce((s, o) => s + (o.total || 0), 0);
  const aa = document.getElementById('an_aov');
  if (aa) aa.textContent = '৳' + (orders.length ? Math.round(rev / orders.length) : 0).toLocaleString();
  const cc = {};
  orders.forEach(o => o.items.forEach(i => { cc[i.category] = (cc[i.category] || 0) + i.qty; }));
  const tc = Object.entries(cc).sort((a, b) => b[1] - a[1])[0];
  const atc = document.getElementById('an_topcat');
  if (atc) atc.textContent = tc ? tc[0] : '—';
  const vc = {};
  orders.forEach(o => o.items.forEach(i => { vc[i.vendor] = (vc[i.vendor] || 0) + (i.price * i.qty); }));
  const tv = Object.entries(vc).sort((a, b) => b[1] - a[1])[0];
  const atv = document.getElementById('an_topvend');
  if (atv) atv.textContent = tv ? tv[0].split(' ')[0] : '—';
  const sorted = [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 6);
  const tb = document.getElementById('topPBody');
  if (tb) tb.innerHTML = sorted.map(p => `<tr><td>${p.emoji} ${p.name}</td><td style="font-size:10px;color:var(--copper)">${p.vendor}</td><td style="font-size:10px;color:var(--slate)">${p.category}</td><td>${p.colors.map(c => `<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${c.hex};margin-right:1px"></span>`).join('')}</td><td class="mono">${p.sold || 0}</td><td class="mono">৳${((p.sold || 0) * p.price).toLocaleString()}</td></tr>`).join('');
}
function renderRevChart() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], vals = days.map(() => Math.floor(Math.random() * 8000 + 1000)), mx = Math.max(...vals);
  const rc = document.getElementById('revChart');
  if (rc) rc.innerHTML = vals.map(v => `<div class="chart-bar" style="height:${Math.round(v / mx * 100)}%" title="৳${v.toLocaleString()}"></div>`).join('');
  const cl = document.getElementById('chartLbls');
  if (cl) cl.innerHTML = days.map(d => `<span style="flex:1;text-align:center;font-size:9px;color:var(--slate);font-family:'DM Mono',monospace">${d}</span>`).join('');
}
function openAddProd() {
  editProdId = null;
  const t = document.getElementById('addProdTitle');
  if (t) t.textContent = 'Add New Product';
  ['np_name', 'np_price', 'np_orig', 'np_stock', 'np_emoji', 'np_desc', 'np_sizes', 'np_colors', 'np_subs', 'np_material', 'np_badge'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  const m = document.getElementById('addProdModal');
  if (m) m.classList.add('open');
}
function editProd(id) {
  const p = products.find(x => x.id === id); if (!p) return; editProdId = id;
  const t = document.getElementById('addProdTitle');
  if (t) t.textContent = 'Edit Product';
  const nn = document.getElementById('np_name'); if (nn) nn.value = p.name;
  const nc = document.getElementById('np_cat'); if (nc) nc.value = p.category;
  const nv = document.getElementById('np_vendor'); if (nv) nv.value = p.vendor;
  const np = document.getElementById('np_price'); if (np) np.value = p.price;
  const no = document.getElementById('np_orig'); if (no) no.value = p.origPrice || '';
  const ns = document.getElementById('np_stock'); if (ns) ns.value = p.stock;
  const ne = document.getElementById('np_emoji'); if (ne) ne.value = p.emoji;
  const nd = document.getElementById('np_desc'); if (nd) nd.value = p.desc;
  const nsi = document.getElementById('np_sizes'); if (nsi) nsi.value = p.sizes.join(',');
  const nco = document.getElementById('np_colors'); if (nco) nco.value = p.colors.map(c => c.name + ':' + c.hex).join(',');
  const nsu = document.getElementById('np_subs'); if (nsu) nsu.value = p.subs.map(s => s.name + ':' + s.price).join(',');
  const nm = document.getElementById('np_material'); if (nm) nm.value = p.material || '';
  const nb = document.getElementById('np_badge'); if (nb) nb.value = p.badge || '';
  const m = document.getElementById('addProdModal');
  if (m) m.classList.add('open');
}
function closeAddProd() { const m = document.getElementById('addProdModal'); if (m) m.classList.remove('open'); }
function saveProduct() {
  const name = document.getElementById('np_name').value.trim(), price = parseInt(document.getElementById('np_price').value), stock = parseInt(document.getElementById('np_stock').value);
  if (!name || !price || isNaN(stock)) { showToast('Fill required fields.', 'error'); return; }
  const cs = document.getElementById('np_colors').value || 'Black:#1a1a1a';
  const colors = cs.split(',').map(s => { const p = s.trim().split(':'); return { name: p[0]?.trim() || 'Black', hex: p[1]?.trim() || '#1a1a1a' }; });
  const ss = document.getElementById('np_subs').value;
  const subs = ss ? ss.split(',').map(s => { const p = s.trim().split(':'); return { name: p[0]?.trim() || 'Default', emoji: document.getElementById('np_emoji').value || '👗', price: parseInt(p[1]) || price }; }).filter(s => s.name) : [];
  const op = document.getElementById('np_orig').value;
  const data = { name, price, origPrice: op ? parseInt(op) : null, stock, vendor: document.getElementById('np_vendor').value, category: document.getElementById('np_cat').value, emoji: document.getElementById('np_emoji').value || '👗', desc: document.getElementById('np_desc').value || '', sizes: document.getElementById('np_sizes').value.split(',').map(s => s.trim()).filter(Boolean), colors, subs, material: document.getElementById('np_material').value, badge: document.getElementById('np_badge').value || '', sold: 0 };
  if (editProdId) { 
    updateProductAPI(editProdId, data).then(() => {
      loadProductsFromAPI().then(() => { closeAddProd(); renderInv(); renderAll(); updateDash(); showToast('Updated.', 'success'); });
    });
  } else { 
    createProductAPI(data).then(() => {
      loadProductsFromAPI().then(() => { closeAddProd(); renderInv(); renderAll(); updateDash(); showToast('Product added.', 'success'); });
    });
  }
}
async function delProd(id) { 
  if (!confirm('Delete?')) return; 
  const ok = await deleteProductAPI(id);
  if (ok) {
    await loadProductsFromAPI();
    renderInv(); renderAll(); updateDash(); showToast('Removed.');
  }
}
async function dupProd(id) { 
  const p = products.find(x => x.id === id); 
  if (!p) return; 
  const np = { ...p, name: p.name + ' (Copy)', stock: 0, sold: 0 };
  delete np.id;
  await createProductAPI(np);
  await loadProductsFromAPI();
  renderInv(); renderAll(); updateDash(); showToast('Duplicated.');
}

// ─── CRM ───
function buildCRM() { const cm = {}; orders.forEach(o => { if (!cm[o.email]) cm[o.email] = { name: o.name, email: o.email, phone: o.phone, city: o.city, orders: [] }; cm[o.email].orders.push(o); }); return Object.values(cm); }
function getScore(e) { return crmScores[e] || 'cold'; }
function renderCRMList(filter = '', tab = 'all') {
  const custs = buildCRM();
  let fl = custs;
  if (filter) fl = fl.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()) || c.email.toLowerCase().includes(filter.toLowerCase()));
  if (tab === 'hot') fl = fl.filter(c => getScore(c.email) === 'hot');
  if (tab === 'vip') fl = fl.filter(c => getScore(c.email) === 'vip');
  if (tab === 'fu') fl = fl.filter(c => (crmFU[c.email] || []).some(f => !f.done));
  const spent = c => c.orders.reduce((s, o) => s + (o.total || 0), 0);
  const cl = document.getElementById('crmList');
  if (cl) cl.innerHTML = fl.length ? fl.map(c => {
    const sc = getScore(c.email), pend = (crmFU[c.email] || []).filter(f => !f.done).length;
    return `<div class="crm-cust-item ${selCRMEmail === c.email ? 'active' : ''}" onclick="openCRMCust('${c.email}')">
      <div class="crm-cust-name">${c.name}</div>
      <div class="crm-cust-meta">${c.city} · ${c.orders.length} order(s) · ৳${spent(c).toLocaleString()}</div>
      <span class="crm-score score-${sc}">${sc.toUpperCase()}</span>
      ${pend ? `<span style="margin-left:5px;font-size:8px;background:var(--error);color:white;padding:2px 5px;font-family:'DM Mono',monospace">${pend} pending</span>` : ''}
    </div>`;
  }).join('') : `<div style="padding:28px;text-align:center;color:var(--slate);font-size:11px">No customers.</div>`;
}
function filterCRM(v) { renderCRMList(v, document.querySelector('.crm-tab.active')?.dataset?.tab || 'all'); }
function filterCRMTab(tab, btn) {
  document.querySelectorAll('.crm-tab').forEach(b => b.classList.remove('active'));
  if (btn) { btn.classList.add('active'); btn.dataset.tab = tab; }
  renderCRMList(document.getElementById('crmSearch')?.value || '', tab);
}
function openCRMCust(email) {
  selCRMEmail = email; renderCRMList();
  const custs = buildCRM(), c = custs.find(x => x.email === email); if (!c) return;
  const sc = getScore(email), fus = crmFU[email] || [];
  const spent = c.orders.reduce((s, o) => s + (o.total || 0), 0);
  const pend = fus.filter(f => !f.done).length;
  const tl = c.orders.flatMap(o => [{ event: `Order ${o.id}`, date: o.date, detail: `${o.items.length} items · ৳${o.total} · ${o.payment} · ${o.status}` }, ...o.items.map(i => ({ event: `Bought ${i.name}`, date: o.date, detail: `${i.color || ''} · Size ${i.size}` }))]).sort((a, b) => new Date(b.date) - new Date(a.date));
  const cm = document.getElementById('crmMain');
  if (cm) cm.innerHTML = `
    <div class="crm-cust-header">
      <div>
        <div class="crm-cust-name-big display">${c.name}</div>
        <div class="crm-cust-sub">${c.email} · ${c.phone} · ${c.city}</div>
        <div style="margin-top:6px"><span class="crm-score score-${sc}" style="font-size:10px">${sc.toUpperCase()}</span></div>
      </div>
      <div style="display:flex;gap:7px;flex-wrap:wrap">
        <button class="admin-btn sm" onclick="schedFU('${email}','email')">+ Email</button>
        <button class="admin-btn sm" onclick="schedFU('${email}','sms')">+ SMS</button>
        <button class="admin-btn sm" onclick="schedFU('${email}','call')">+ Call</button>
        <button class="admin-btn sm ok" onclick="askAI('${email}')">🧠 AI Insight</button>
      </div>
    </div>
    <div class="crm-stats-row">
      <div class="crm-stat"><div class="crm-stat-val">${c.orders.length}</div><div class="crm-stat-key">Orders</div></div>
      <div class="crm-stat"><div class="crm-stat-val">৳${spent.toLocaleString()}</div><div class="crm-stat-key">Total Spent</div></div>
      <div class="crm-stat"><div class="crm-stat-val">৳${Math.round(spent / c.orders.length).toLocaleString()}</div><div class="crm-stat-key">Avg Order</div></div>
      <div class="crm-stat"><div class="crm-stat-val">${pend}</div><div class="crm-stat-key">Pending FUs</div></div>
    </div>
    <div class="crm-body">
      <div class="crm-timeline">
        <div class="crm-timeline-title">Activity & Follow-ups</div>
        ${fus.map((fu, i) => `<div class="timeline-item">
          <div class="t-dot" style="background:${fu.done ? 'var(--dust)' : 'var(--ai)'}"></div>
          <div class="t-content">
            <div class="t-event"><span class="fu-tag fu-${fu.type}">${fu.type.toUpperCase()}</span> ${fu.msg}</div>
            <div class="t-date">${fu.date}</div>
            ${!fu.done ? `<button onclick="markFUDone('${email}',${i})" style="margin-top:3px;font-size:9px;padding:2px 8px;background:none;border:1px solid var(--dust);cursor:pointer;font-family:'DM Sans',sans-serif;color:var(--slate)">Mark done</button>` : '<span class="fu-tag fu-done">DONE</span>'}
          </div>
        </div>`).join('')}
        ${tl.map(t => `<div class="timeline-item"><div class="t-dot"></div><div class="t-content"><div class="t-event">${t.event}</div><div class="t-date">${t.date}</div><div class="t-detail">${t.detail}</div></div></div>`).join('')}
      </div>
      <div class="ai-panel">
        <div class="ai-panel-header"><span class="ai-panel-title">AI Follow-up Assistant</span><span class="ai-badge">Claude AI</span></div>
        <div class="ai-messages" id="aiMsgs-${email}">
          <div class="ai-msg assistant">Hi! I am your AI CRM assistant for <strong>${c.name}</strong>. I can draft follow-up emails, suggest upsell products, analyse buying patterns, or generate outreach scripts. What would you like?</div>
        </div>
        <div class="ai-quick-actions">
          <button class="ai-quick-btn" onclick="sendQ('${email}','Draft a win-back email for this customer')">✉ Win-back email</button>
          <button class="ai-quick-btn" onclick="sendQ('${email}','What products should I upsell to this customer based on their purchase history?')">🎯 Upsell ideas</button>
          <button class="ai-quick-btn" onclick="sendQ('${email}','Write an SMS script for a flash sale discount for this customer')">📱 SMS script</button>
          <button class="ai-quick-btn" onclick="sendQ('${email}','Summarise this customer profile and give me a retention risk score out of 10')">📊 Risk score</button>
          <button class="ai-quick-btn" onclick="sendQ('${email}','Generate a personalised loyalty reward offer for this customer')">⭐ Loyalty offer</button>
        </div>
        <div class="ai-input-row">
          <input class="ai-input" id="aiIn-${email}" placeholder="Ask AI about this customer..." onkeydown="if(event.key==='Enter')sendAI('${email}')">
          <button class="ai-send" onclick="sendAI('${email}')">Send →</button>
        </div>
      </div>
    </div>`;
}
function openCRMCust_admin(email) { showPage('crm'); setTimeout(() => openCRMCust(email), 100); }
function schedFU(email, type) { if (!crmFU[email]) crmFU[email] = []; const msg = prompt(`Follow-up note for ${type.toUpperCase()}:`); if (!msg) return; crmFU[email].unshift({ type, msg, date: new Date().toISOString().split('T')[0], done: false }); saveState(); openCRMCust(email); showToast(`${type.toUpperCase()} scheduled.`, 'success'); }
function markFUDone(email, idx) { if (crmFU[email]) crmFU[email][idx].done = true; saveState(); openCRMCust(email); renderCRMList(); showToast('Follow-up done.', 'success'); }
function askAI(email) { sendQ(email, 'Give me a complete AI analysis of this customer: buying patterns, risk level, best next action, and a personalised outreach message.'); }
function sendQ(email, msg) { const inp = document.getElementById('aiIn-' + email); if (inp) inp.value = msg; sendAI(email); }

// ─── AI with graceful fallback ───
async function sendAI(email) {
  const inp = document.getElementById('aiIn-' + email), msgs = document.getElementById('aiMsgs-' + email);
  if (!inp || !msgs) return;
  const txt = inp.value.trim(); if (!txt) return; inp.value = '';
  msgs.innerHTML += `<div class="ai-msg user">${txt}</div>`;
  const lid = 'load' + Date.now();
  msgs.innerHTML += `<div class="ai-msg loading" id="${lid}">Thinking...</div>`;
  msgs.scrollTop = msgs.scrollHeight;
  const custs = buildCRM(), c = custs.find(x => x.email === email);
  const spent = c ? c.orders.reduce((s, o) => s + (o.total || 0), 0) : 0;
  const sys = `You are an AI CRM assistant for DRAPE, a premium fashion brand in Bangladesh with 5 vendor partners: LOOM & GRACE (dresses), THREAD REPUBLIC (tops/knitwear), NAKSHI STUDIO (ethnic/embroidered), ZEPHYR CUTS (tailored bottoms/outerwear), ADORN CO. (accessories/jewellery).
Customer: ${c?.name}, ${c?.email}, ${c?.city}
Orders: ${c?.orders.length}, Total spent: ৳${spent.toLocaleString()}
History: ${c?.orders.map(o => `${o.id} (${o.status}, ৳${o.total}, items: ${o.items.map(i => i.name).join(', ')})`).join(' | ')}
Score: ${getScore(email)}
Pending follow-ups: ${(crmFU[email] || []).filter(f => !f.done).map(f => f.msg).join(', ') || 'none'}
Be concise, specific, actionable. Under 180 words. Write in English.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, system: sys, messages: [{ role: 'user', content: txt }] })
    });
    if (!res.ok) throw new Error('API error ' + res.status);
    const data = await res.json();
    const el = document.getElementById(lid); if (el) el.remove();
    const reply = data.content?.[0]?.text || 'Could not get a response. Please try again.';
    msgs.innerHTML += `<div class="ai-msg assistant">${reply.replace(/\n/g, '<br>')}</div>`;
  } catch (e) {
    const el = document.getElementById(lid); if (el) el.remove();
    // Graceful fallback: generate context-aware mock response
    const mockReply = generateMockAIResponse(txt, c, spent);
    msgs.innerHTML += `<div class="ai-msg assistant">${mockReply.replace(/\n/g, '<br>')}</div>`;
  }
  msgs.scrollTop = msgs.scrollHeight;
}

function generateMockAIResponse(query, customer, spent) {
  const q = query.toLowerCase();
  const name = customer?.name?.split(' ')[0] || 'there';
  if (q.includes('win-back')) {
    return `Hi ${name}, we noticed you haven't shopped with us in a while. Your last order was a hit — how about 15% off your next purchase? Code: COMEBACK15. Valid 7 days. Let us know if you'd like personalised recommendations!`;
  }
  if (q.includes('upsell') || q.includes('recommend')) {
    return `Based on ${name}'s history (৳${spent?.toLocaleString()} spent), top upsell picks: 1) Kantha Jacket (matches their ethnic wear preference), 2) Silk Slip Top in a new colour, 3) Leather Mini Bag for cross-category growth. Consider bundling for 10% off.`;
  }
  if (q.includes('sms') || q.includes('script')) {
    return `SMS: "Hi ${name}! DRAPE flash sale: 20% off ALL items this weekend only. Shop now: drape.fashion. Code: FLASH20. Ends Sunday midnight. 🛍"`;
  }
  if (q.includes('risk') || q.includes('score')) {
    return `Retention Risk Score: 4/10 (Low-Medium). ${name} has ${customer?.orders?.length || 0} orders, strong spend. Risk factors: no order in 14+ days. Recommended action: Send personalised email with new arrivals from their favourite vendor.`;
  }
  if (q.includes('loyalty') || q.includes('reward')) {
    return `Loyalty Offer for ${name}: "As a valued DRAPE customer, enjoy EARLY ACCESS to our SS/27 preview + 15% off. Code: LOYAL15. Plus free shipping on your next 3 orders."`;
  }
  return `Analysis for ${name}: ${customer?.orders?.length || 0} orders, ৳${spent?.toLocaleString()} lifetime value. Primary category: ${customer?.orders?.[0]?.items?.[0]?.category || 'N/A'}. Best next action: personalised outreach with new arrivals from their preferred vendor. Average order value trend: stable. Recommend increasing frequency via SMS reminders.`;
}

// ─── SOCIAL ───
function renderSocialOverview() {
  const total = 12400 + 8100 + 6200 + 2100;
  const sf = document.getElementById('soc_followers');
  if (sf) sf.textContent = (total / 1000).toFixed(1) + 'K';
  const sr = document.getElementById('soc_reach');
  if (sr) sr.textContent = '84.2K';
  const platforms = [
    { icon: '📸', bg: 'linear-gradient(135deg,#f09433,#dc2743,#bc1888)', name: 'Instagram', handle: '@drape.fashion', followers: '12.4K', posts: 342, eng: '5.2%' },
    { icon: '👥', bg: '#1877F2', name: 'Facebook', handle: 'drape.fashion.bd', followers: '8.1K', posts: 156, eng: '3.9%' },
    { icon: '🎵', bg: '#000', name: 'TikTok', handle: '@drape.fashion', followers: '6.2K', posts: 48, eng: '7.1%' },
    { icon: '💼', bg: '#0A66C2', name: 'LinkedIn', handle: 'drape-fashion-bd', followers: '2.1K', posts: 34, eng: '2.3%' },
  ];
  const pc = document.getElementById('platformCards');
  if (pc) pc.innerHTML = platforms.map(p => `
    <div class="platform-card" style="margin-bottom:2px">
      <div class="platform-header">
        <div class="platform-icon" style="background:${p.bg}">${p.icon}</div>
        <div class="platform-info"><div class="platform-name">${p.name}</div><div class="platform-handle">${p.handle}</div></div>
        <div class="platform-stats">
          <div class="plat-stat"><div class="plat-stat-val">${p.followers}</div><div class="plat-stat-key">Followers</div></div>
          <div class="plat-stat"><div class="plat-stat-val">${p.posts}</div><div class="plat-stat-key">Posts</div></div>
          <div class="plat-stat"><div class="plat-stat-val">${p.eng}</div><div class="plat-stat-key">Eng.Rate</div></div>
        </div>
      </div>
    </div>`).join('');
}
function renderPlatformPosts(platform, gridId) {
  const posts = socialPosts[platform] || [];
  const el = document.getElementById(gridId);
  if (el) el.innerHTML = posts.map(p => `
    <div class="post-card">
      <div class="post-card-img">${p.emoji}</div>
      <div class="post-card-body">
        <div class="post-card-status status-${p.status}">${p.status.toUpperCase()}</div>
        <div class="post-card-text">${p.text.substring(0, 90)}${p.text.length > 90 ? '...' : ''}</div>
        <div class="post-card-stats">
          <span class="post-card-stat">❤ ${p.likes.toLocaleString()}</span>
          <span class="post-card-stat">💬 ${p.comments}</span>
          <span class="post-card-stat mono" style="font-size:9px">${p.date}</span>
        </div>
      </div>
    </div>`).join('') || '<div style="padding:32px;color:var(--slate);font-size:12px">No posts yet.</div>';
}
function renderSchedule() {
  const sb = document.getElementById('scheduleBody');
  if (sb) sb.innerHTML = scheduledPosts.length ?
    scheduledPosts.map((p, i) => `<tr>
      <td style="font-size:11px">${p.platform}</td>
      <td style="font-size:11px;max-width:200px">${p.content.substring(0, 60)}...</td>
      <td style="font-size:11px;font-family:'DM Mono',monospace">${p.datetime}</td>
      <td><span class="status-badge badge-pending">Scheduled</span></td>
      <td><button class="admin-btn sm danger" onclick="removeScheduled(${i})">✗</button></td>
    </tr>`).join('') :
    '<tr><td colspan="5" style="text-align:center;color:var(--slate);padding:24px;font-size:12px">No scheduled posts. Create one above.</td></tr>';
}
function removeScheduled(i) { scheduledPosts.splice(i, 1); renderSchedule(); saveState(); showToast('Post removed.'); }
function updateCharCount(taId, countId, max) {
  const v = document.getElementById(taId)?.value?.length || 0;
  const el = document.getElementById(countId);
  if (el) el.textContent = v + ' / ' + max;
}

// AI Caption with fallback
async function aiCaption(platform) {
  const prompts = {
    instagram: 'Write an engaging Instagram caption for DRAPE, a premium Bangladesh fashion brand with 5 artisan vendor partners. Include 5 relevant hashtags. Tone: aspirational, modern, South Asian. Under 150 words.',
    facebook: 'Write a Facebook post for DRAPE fashion. Warm, community-focused tone. Mention one of our brands: LOOM & GRACE (dresses), THREAD REPUBLIC (tops), NAKSHI STUDIO (ethnic), ZEPHYR CUTS (tailored), ADORN CO. (accessories). Under 200 words.',
    tiktok: 'Write a TikTok caption + 3-line script hook for DRAPE, a fashion brand in Bangladesh. Gen-Z friendly, trendy. Include trending hashtags. Under 100 words.',
    linkedin: 'Write a LinkedIn post for DRAPE, a fashion-tech company in Bangladesh. Professional, founder-voice tone. Focus on sustainability, brand partnerships, or business growth. Under 250 words.',
    scheduler: 'Write a cross-platform social media post for DRAPE fashion Bangladesh. Versatile, engaging. Under 150 words.'
  };
  const taid = { instagram: 'ig_caption', facebook: 'fb_caption', tiktok: 'tt_caption', linkedin: 'li_caption', scheduler: 'sch_content' };
  const ta = document.getElementById(taid[platform]);
  if (!ta) return;
  ta.value = '✨ Generating...'; ta.disabled = true;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, messages: [{ role: 'user', content: prompts[platform] || prompts.scheduler }] })
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    ta.value = data.content?.[0]?.text || 'Could not generate caption.';
  } catch (e) {
    // Fallback mock captions
    const mockCaptions = {
      instagram: '✨ New drop alert! The SS/26 collection is here — 5 artisan brands, one vision. Crafted in Dhaka, worn everywhere. Which piece speaks to you? 🌿\n\n#DRAPE #DhakaFashion #SustainableStyle #SlowFashion #Bangladesh #ArtisanMade',
      facebook: 'We are thrilled to share the stories behind every stitch. This season, DRAPE partners with 5 incredible artisan brands — from handloom weavers in Old Dhaka to kantha embroiders in Rajshahi. Every purchase supports fair wages and keeps heritage craft alive. Thank you for being part of this journey. 💚',
      tiktok: 'POV: you discover Bangladesh\'s most ethical fashion brand 🇧🇩\n\nHook: "I thought sustainable fashion had to be expensive... then I found DRAPE."\n\n#DRAPE #FashionTok #Bangladesh #OOTD #SustainableStyle',
      linkedin: 'Building a fashion company that runs entirely on systems. No spreadsheets. No gut calls. Just data, design, and five incredible artisan brand partners. Here is what DRAPE FashionOS looks like under the hood. 👇',
      scheduler: '✨ New drop! The SS/26 collection is live. 5 artisan brands, crafted in Dhaka. Shop the full collection at drape.fashion. 🌿 #DRAPE #DhakaFashion #SustainableStyle'
    };
    ta.value = mockCaptions[platform] || mockCaptions.scheduler;
  }
  ta.disabled = false;
}
function schedulePost(platform) {
  const taid = { instagram: 'ig_caption', facebook: 'fb_caption', tiktok: 'tt_caption', linkedin: 'li_caption' };
  const content = document.getElementById(taid[platform])?.value;
  if (!content) { showToast('Write some content first.', 'error'); return; }
  socialPosts[platform] = socialPosts[platform] || [];
  socialPosts[platform].unshift({ text: content, emoji: '📝', likes: 0, comments: 0, status: 'live', date: new Date().toISOString().split('T')[0] });
  renderPlatformPosts(platform, { instagram: 'igPostsGrid', facebook: 'fbPostsGrid', tiktok: 'ttPostsGrid', linkedin: 'liPostsGrid' }[platform]);
  const ta = document.getElementById(taid[platform]);
  if (ta) ta.value = '';
  showToast('Post published to ' + platform + '!', 'success');
}
function scheduleSave() {
  const content = document.getElementById('sch_content').value;
  const platform = document.getElementById('sch_platform').value;
  const dt = document.getElementById('sch_datetime').value;
  if (!content || !dt) { showToast('Fill content and date.', 'error'); return; }
  scheduledPosts.push({ content, platform, datetime: dt.replace('T', ' ') });
  document.getElementById('sch_content').value = '';
  renderSchedule(); saveState(); showToast('Post scheduled!', 'success');
}

// ─── WHATSAPP ───
function initWaChats() {
  waChats = [
    { id: 'nusrat', name: 'Nusrat Jahan', phone: '+880 171 1234567', avatar: 'N', unread: 0, lastMsg: 'Thank you! I love the blazer 😍', time: '10:32', msgs: [
      { text: 'Hi! I just placed an order #DRAPE-1001', dir: 'in', time: '09:14' },
      { text: 'Hi Nusrat! Thank you for your order 🙏 Your Muslin Wrap Dress + Silk Slip Top are confirmed and being prepared.', dir: 'out', time: '09:16' },
      { text: 'When will it arrive?', dir: 'in', time: '09:20' },
      { text: 'Estimated delivery: 2-3 working days in Dhaka. We will send you a tracking update.', dir: 'out', time: '09:22' },
      { text: 'Thank you! I love the blazer 😍', dir: 'in', time: '10:32' },
    ] },
    { id: 'rafiq', name: 'Rafiq Ahmed', phone: '+880 181 9876543', avatar: 'R', unread: 2, lastMsg: 'Is the blazer available in XL?', time: 'Yesterday', msgs: [
      { text: 'Hello, do you have the Linen Blazer in XL?', dir: 'in', time: '14:00' },
      { text: 'Hi Rafiq! Yes, the Linen Blazer is available in XL — limited stock of 3 units remaining.', dir: 'out', time: '14:05' },
      { text: 'Great! I ordered it via the website', dir: 'in', time: '14:12' },
      { text: 'Is the blazer available in XL?', dir: 'in', time: '16:30' },
    ] },
    { id: 'sabrina', name: 'Sabrina Islam', phone: '+880 170 5554433', avatar: 'S', unread: 1, lastMsg: 'What is your return policy?', time: '2 days ago', msgs: [
      { text: 'Hi! What is your return policy?', dir: 'in', time: '11:00' },
      { text: 'Hi Sabrina! We offer 7-day returns for unworn items with tags attached. Free pickup from Dhaka. DM for the return form.', dir: 'out', time: '11:08' },
      { text: 'What is your return policy?', dir: 'in', time: '14:45' },
    ] },
    { id: 'broadcast', name: '📣 Broadcast List', phone: 'All Customers', avatar: '📣', unread: 0, lastMsg: 'Tap to send a broadcast message', time: '', msgs: [] },
  ];
  renderWaChatList();
}
function renderWaChatList(filter = '') {
  const list = document.getElementById('waChatList');
  if (!list) return;
  const filtered = waChats.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()) || c.phone.includes(filter));
  list.innerHTML = filtered.map(c => `
    <div class="wa-chat-item ${activeWaChat === c.id ? 'active' : ''}" onclick="openWaChat('${c.id}')">
      <div class="wa-avatar" style="background:${c.id === 'broadcast' ? '#F7941D' : '#25D366'}">${c.avatar}</div>
      <div class="wa-chat-info">
        <div class="wa-chat-name">${c.name}</div>
        <div class="wa-chat-preview">${c.lastMsg}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
        <div class="wa-chat-time">${c.time}</div>
        ${c.unread ? `<div class="wa-unread">${c.unread}</div>` : ''}
      </div>
    </div>`).join('');
}
function filterWaChats(v) { renderWaChatList(v); }
function openWaChat(id) {
  activeWaChat = id;
  const chat = waChats.find(c => c.id === id);
  if (chat) chat.unread = 0;
  renderWaChatList();
  if (id === 'broadcast') { renderWaBroadcast(); return; }
  if (id === 'template') { renderWaTemplates(); return; }
  if (!chat) return;
  const wm = document.getElementById('waMain');
  if (wm) wm.innerHTML = `
    <div class="wa-main-header">
      <div class="wa-main-avatar">${chat.avatar}</div>
      <div><div class="wa-main-name">${chat.name}</div><div class="wa-main-status">${chat.phone}</div></div>
      <div class="wa-main-actions">
        <button class="wa-action-btn" onclick="openCRMCust('${chat.id === 'nusrat' ? 'nusrat@email.com' : chat.id === 'rafiq' ? 'rafiq@email.com' : 'sabrina@email.com'}');showPage('crm')" title="Open in CRM">🧠</button>
        <button class="wa-action-btn" title="Call">📞</button>
        <button class="wa-action-btn" title="More">⋮</button>
      </div>
    </div>
    <div class="wa-messages" id="waMsgs">
      <div class="wa-date-divider">Today</div>
      ${chat.msgs.map(m => `
        <div class="wa-msg ${m.dir}">
          ${m.text}
          <div class="wa-msg-time">${m.time} ${m.dir === 'out' ? '<span class="wa-msg-tick">✓✓</span>' : ''}</div>
        </div>`).join('')}
    </div>
    <div class="wa-template-bar">
      <button class="wa-template-btn" onclick="waQuickReply('Thank you for your order! It is being prepared and will ship within 24 hours. 📦')">📦 Order confirmed</button>
      <button class="wa-template-btn" onclick="waQuickReply('Your order has been shipped! Track here: drape.fashion/track 🚚')">🚚 Shipped</button>
      <button class="wa-template-btn" onclick="waQuickReply('We have a special 15% discount for loyal customers like you! Use code LOYAL15 at checkout 🎁')">🎁 Loyalty offer</button>
      <button class="wa-template-btn" onclick="waQuickReply('Hi! Can I help you with sizing? Our size guide: XS (32-34), S (34-36), M (36-38), L (38-40), XL (40-42)')">📏 Size guide</button>
      <button class="wa-template-btn" onclick="waQuickReply('Return policy: 7 days, unworn with tags. Free pickup in Dhaka. Reply RETURN to start.')">↩ Return policy</button>
    </div>
    <div class="wa-input-area">
      <input class="wa-input" id="waInput-${id}" placeholder="Type a message..." onkeydown="if(event.key==='Enter')sendWaMsg('${id}')">
      <button class="wa-send-btn" onclick="sendWaMsg('${id}')">➤</button>
    </div>`;
  const msgs = document.getElementById('waMsgs');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}
function waQuickReply(text) { const input = document.getElementById('waInput-' + activeWaChat); if (input) input.value = text; }
function sendWaMsg(id) {
  const input = document.getElementById('waInput-' + id);
  if (!input || !input.value.trim()) return;
  const text = input.value.trim(); input.value = '';
  const chat = waChats.find(c => c.id === id);
  if (!chat) return;
  const now = new Date().toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit', hour12: false });
  chat.msgs.push({ text, dir: 'out', time: now });
  chat.lastMsg = text; chat.time = 'Now';
  openWaChat(id); showToast('Message sent via WhatsApp.', 'success');
}
function renderWaBroadcast() {
  const wm = document.getElementById('waMain');
  if (wm) wm.innerHTML = `
    <div style="padding:28px;overflow-y:auto;flex:1">
      <div style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:300;margin-bottom:20px">Broadcast Message</div>
      <div class="wa-broadcast">
        <div class="wa-broadcast-title">📣 Send to all customers <span class="wa-bc-badge">BROADCAST</span></div>
        <div class="form-group"><label class="form-label">Select Audience</label>
          <select class="form-select" id="waAudience"><option>All Customers (${orders.length > 0 ? [...new Set(orders.map(o => o.email))].length : 3})</option><option>VIP Customers</option><option>Customers with pending orders</option><option>Customers in Dhaka</option></select></div>
        <div class="form-group"><label class="form-label">Message</label>
          <textarea class="form-input" id="waBcMsg" rows="4" placeholder="Hi {name}! We have an exciting update for you from DRAPE... Use {name} for personalization."></textarea></div>
        <div class="form-group"><label class="form-label">Template</label>
          <select class="form-select" onchange="waLoadTemplate(this.value)">
            <option value="">Choose a template...</option>
            <option value="sale">Flash Sale Announcement</option>
            <option value="new">New Collection Drop</option>
            <option value="loyalty">Loyalty Reward</option>
            <option value="track">Order Tracking Update</option>
          </select></div>
        <button class="admin-btn ok" onclick="sendWaBroadcast()" style="margin-top:8px">📣 Send Broadcast</button>
      </div>
      <div class="table-wrapper">
        <div style="padding:16px 20px;font-size:13px;font-weight:500">Recent Broadcasts</div>
        <table class="admin-table"><thead><tr><th>Message</th><th>Sent To</th><th>Date</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td style="font-size:11px">Hi {name}! The SS/26 collection is live. Shop now 🛍</td><td>3 customers</td><td>2026-06-20</td><td><span class="status-badge badge-delivered">Delivered</span></td></tr>
          <tr><td style="font-size:11px">Your loyalty discount is ready: LOYAL15 🎁</td><td>1 customer (VIP)</td><td>2026-06-18</td><td><span class="status-badge badge-delivered">Delivered</span></td></tr>
        </tbody></table>
      </div>
    </div>`;
}
function waLoadTemplate(type) {
  const templates = {
    sale: '🔥 Flash Sale Alert! Hi {name}, DRAPE is offering 20% off all sale items this weekend only. Shop now: drape.fashion\n\nUse code: FLASH20\n\nOffers ends Sunday midnight. 🛍',
    new: '✨ New Collection Drop! Hi {name}, our SS/26 collection is now live — featuring pieces from all 5 of our artisan brand partners.\n\nShop the collection: drape.fashion\n\nLimited stock. Order now.',
    loyalty: '🎁 Exclusive for You, {name}! As a valued DRAPE customer, you get early access + 15% off your next order.\n\nCode: LOYAL15\nExpires in 48 hours.',
    track: '📦 Order Update for {name}! Your DRAPE order is on its way. Expected delivery: 1-2 working days.\n\nTrack your order: drape.fashion/track\n\nQuestions? Reply to this message.',
  };
  const ta = document.getElementById('waBcMsg');
  if (ta && templates[type]) ta.value = templates[type];
}
function sendWaBroadcast() {
  const msg = document.getElementById('waBcMsg')?.value;
  if (!msg) { showToast('Write a message first.', 'error'); return; }
  const count = [...new Set(orders.map(o => o.email))].length || 3;
  showToast(`Broadcast sent to ${count} customer${count !== 1 ? 's' : ''}! ✅`, 'success');
  const ta = document.getElementById('waBcMsg');
  if (ta) ta.value = '';
}
function renderWaTemplates() {
  const wm = document.getElementById('waMain');
  if (wm) wm.innerHTML = `
    <div style="padding:28px;overflow-y:auto;flex:1">
      <div style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:300;margin-bottom:20px">Message Templates</div>
      ${[
        { name: 'Order Confirmed', icon: '📦', text: 'Hi {name}! Your order {order_id} has been confirmed. We are preparing it now and will ship within 24 hours. Thank you for shopping with DRAPE! 🛍' },
        { name: 'Order Shipped', icon: '🚚', text: 'Hi {name}! Great news — your order {order_id} has been shipped. Track here: drape.fashion/track\n\nExpected delivery: 2-3 working days.' },
        { name: 'Loyalty Reward', icon: '⭐', text: 'Hi {name}! You have unlocked a special reward for being a valued DRAPE customer. Use code LOYAL15 for 15% off your next order. Valid 7 days.' },
        { name: 'Return Initiated', icon: '↩', text: 'Hi {name}! Your return for order {order_id} has been initiated. Our team will pick up within 48 hours. Refund processed in 3-5 days.' },
        { name: 'Flash Sale', icon: '🔥', text: 'Hi {name}! Flash Sale: 20% off all items this weekend. Shop now at drape.fashion. Code: FLASH20. Ends Sunday midnight! 🛍' },
      ].map(t => `
        <div style="background:var(--white);border:1px solid var(--dust);padding:16px 20px;margin-bottom:8px;display:flex;gap:14px;align-items:flex-start">
          <span style="font-size:24px">${t.icon}</span>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:500;margin-bottom:6px">${t.name}</div>
            <div style="font-size:11px;color:var(--slate);line-height:1.7">${t.text}</div>
          </div>
          <button class="admin-btn sm" onclick="activeWaChat&&waUseTemplate('${t.text.replace(/'/g, "\\'")}')">Use</button>
        </div>`).join('')}
    </div>`;
}
function waUseTemplate(text) {
  if (activeWaChat && activeWaChat !== 'broadcast' && activeWaChat !== 'template') {
    const chat = waChats.find(c => c.id === activeWaChat);
    const personalised = text.replace('{name}', chat?.name?.split(' ')[0] || 'there').replace('{order_id}', orders.find(o => o.name.toLowerCase().includes(chat?.name?.split(' ')[0].toLowerCase()))?.id || 'DRAPE-XXXX');
    openWaChat(activeWaChat);
    setTimeout(() => { const input = document.getElementById('waInput-' + activeWaChat); if (input) input.value = personalised; }, 100);
  }
}
function addWaNotification(order) {
  const chat = waChats.find(c => c.phone === order.phone) || null;
  const msg = `✅ Order Confirmed! Hi ${order.name.split(' ')[0]}! Your order ${order.id} has been placed successfully. Total: ৳${order.total.toLocaleString()}. Estimated delivery: 2-3 working days. 🛍`;
  if (chat) {
    chat.msgs.push({ text: msg, dir: 'out', time: new Date().toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit', hour12: false }) });
    chat.lastMsg = 'Order confirmation sent ✓';
  } else {
    const name = order.name, phone = order.phone;
    waChats.unshift({ id: 'new_' + Date.now(), name, phone, avatar: name[0], unread: 0, lastMsg: 'Order confirmation sent ✓', time: 'Just now', msgs: [{ text: msg, dir: 'out', time: 'Now' }] });
  }
  renderWaChatList();
}
function showWaTab(tab) { if (tab === 'broadcast') openWaChat('broadcast'); }

// ─── ORDER TRACKING ───
function trackOrder() {
  const input = document.getElementById('trackInput');
  if (!input) return;
  const id = input.value.trim().toUpperCase();
  const result = document.getElementById('trackResult');
  if (!result) return;
  if (!id) { showToast('Enter an order ID.', 'error'); return; }
  const order = orders.find(o => o.id.toUpperCase() === id);
  if (!order) {
    result.innerHTML = `<div style="text-align:center;padding:40px;color:var(--slate)"><div style="font-size:48px;margin-bottom:16px">🔍</div><div style="font-size:14px">No order found with ID <strong>${id}</strong></div><div style="font-size:12px;margin-top:8px">Check your confirmation email or try DRAPE-1001 to DRAPE-1004</div></div>`;
    result.classList.add('open');
    return;
  }
  const steps = [
    { title: 'Order Placed', desc: 'Your order has been received and confirmed.', time: order.date + ' 09:00', status: 'completed' },
    { title: 'Payment Confirmed', desc: 'Payment received via ' + order.payment + '.', time: order.date + ' 09:15', status: 'completed' },
    { title: 'Processing', desc: 'Items are being prepared and quality-checked.', time: order.date + ' 14:30', status: order.status === 'pending' ? 'active' : 'completed' },
    { title: 'Shipped', desc: 'Order handed to courier. Track live updates.', time: order.status === 'shipped' || order.status === 'delivered' ? order.date + ' 16:00' : '—', status: order.status === 'shipped' ? 'active' : (order.status === 'delivered' ? 'completed' : 'pending') },
    { title: 'Out for Delivery', desc: 'Courier is on the way to your address.', time: order.status === 'delivered' ? order.date + ' 11:00' : '—', status: order.status === 'delivered' ? 'completed' : 'pending' },
    { title: 'Delivered', desc: 'Order delivered successfully.', time: order.status === 'delivered' ? order.date + ' 14:20' : '—', status: order.status === 'delivered' ? 'completed' : 'pending' },
  ];
  const statusColors = { pending: 'background:#FFF3CD;color:#856404', processing: 'background:#CCE5FF;color:#004085', shipped: 'background:#D4EDDA;color:#155724', delivered: 'background:#D1ECF1;color:#0C5460', cancelled: 'background:#F8D7DA;color:#C0392B' };
  result.innerHTML = `
    <div class="track-card">
      <div class="track-card-header">
        <div class="track-card-id">${order.id}</div>
        <div class="track-status-pill" style="${statusColors[order.status] || ''}">${order.status.toUpperCase()}</div>
      </div>
      <div class="track-timeline">
        ${steps.map(s => `<div class="track-step ${s.status}">
          <div class="track-step-dot"></div>
          <div>
            <div class="track-step-title">${s.title}</div>
            <div class="track-step-desc">${s.desc}</div>
            <div class="track-step-time">${s.time}</div>
          </div>
        </div>`).join('')}
      </div>
      <div class="track-items">
        <div style="font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--slate);margin-bottom:12px">Items</div>
        ${order.items.map(i => `<div class="track-item-row"><div class="track-item-emoji">${i.emoji}</div><div><div class="track-item-name">${i.name}</div><div class="track-item-meta">${i.color} · Size ${i.size} · Qty ${i.qty}</div></div></div>`).join('')}
      </div>
      <div style="border-top:1px solid var(--dust);padding-top:16px;margin-top:16px;display:flex;justify-content:space-between;font-size:12px">
        <span style="color:var(--slate)">Total: <strong class="mono">৳${order.total.toLocaleString()}</strong></span>
        <span style="color:var(--slate)">Payment: <strong>${order.payment.toUpperCase()}</strong></span>
      </div>
    </div>
    <div style="text-align:center"><button class="btn-ghost" onclick="showPage('crm');setTimeout(()=>openCRMCust('${order.email}'),200)">Contact Customer Care →</button></div>`;
  result.classList.add('open');
}

// ─── VENDOR PORTAL ───
function renderVendorPortal() {
  const vendorName = 'LOOM & GRACE'; // Simplified: default vendor view
  const vendorProducts = products.filter(p => p.vendor === vendorName);
  const vendorOrders = orders.flatMap(o => o.items.filter(i => i.vendor === vendorName).map(i => ({ ...o, product: i.name, qty: i.qty })));
  const rev = vendorOrders.reduce((s, o) => s + o.total, 0);
  const v_st_rev = document.getElementById('v_st_rev'); if (v_st_rev) v_st_rev.textContent = '৳' + rev.toLocaleString();
  const v_st_ord = document.getElementById('v_st_ord'); if (v_st_ord) v_st_ord.textContent = vendorOrders.length;
  const v_st_prod = document.getElementById('v_st_prod'); if (v_st_prod) v_st_prod.textContent = vendorProducts.length;
  const v_st_stock = document.getElementById('v_st_stock'); if (v_st_stock) v_st_stock.textContent = vendorProducts.reduce((s, p) => s + p.stock, 0);
  const vtb = document.getElementById('vTopBody');
  if (vtb) vtb.innerHTML = vendorProducts.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 5).map(p => `<tr><td>${p.emoji} ${p.name}</td><td style="font-size:10px;color:var(--slate)">${p.category}</td><td class="mono">${p.sold || 0}</td><td class="mono">৳${((p.sold || 0) * p.price).toLocaleString()}</td><td class="mono ${p.stock === 0 ? 'stock-out' : p.stock < 10 ? 'stock-low' : 'stock-ok'}">${p.stock}</td></tr>`).join('');
}
function renderVendorProducts() {
  const vendorName = 'LOOM & GRACE';
  const vp = products.filter(p => p.vendor === vendorName);
  const vpg = document.getElementById('vProdGrid');
  if (vpg) vpg.innerHTML = vp.map(p => pCard(p)).join('');
}
function renderVendorOrders() {
  const vendorName = 'LOOM & GRACE';
  const vo = orders.flatMap(o => o.items.filter(i => i.vendor === vendorName).map(i => ({ ...o, product: i.name, qty: i.qty, price: i.price })));
  const vob = document.getElementById('vOrdBody');
  if (vob) vob.innerHTML = vo.length ? vo.map(o => `<tr><td class="mono" style="font-size:10px;color:var(--copper)">${o.id}</td><td>${o.name}</td><td>${o.product}</td><td class="mono">${o.qty}</td><td style="color:var(--slate);font-size:10px">${o.date}</td><td><span class="status-badge badge-${o.status}">${o.status}</span></td></tr>`).join('') : '<tr><td colspan="6" style="text-align:center;color:var(--slate);padding:24px">No orders yet.</td></tr>';
}
function renderVendorAnalytics() {
  const vendorName = 'LOOM & GRACE';
  const vp = products.filter(p => p.vendor === vendorName);
  const cats = {};
  vp.forEach(p => { cats[p.category] = (cats[p.category] || 0) + (p.sold || 0); });
  const vc = document.getElementById('vCatChart');
  if (vc) vc.innerHTML = Object.entries(cats).map(([cat, sold]) => {
    const max = Math.max(...Object.values(cats));
    return `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px"><span>${cat}</span><span class="mono">${sold} sold</span></div><div style="height:8px;background:var(--dust);border-radius:4px;overflow:hidden"><div style="height:100%;background:var(--copper);width:${max ? (sold / max * 100) : 0}%;transition:width .6s ease;border-radius:4px"></div></div></div>`;
  }).join('');
}

// ─── TOAST ───
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.className = 'show ' + type;
  clearTimeout(window._tt);
  window._tt = setTimeout(() => t.className = '', 3200);
}

// Export functions to window for HTML onclick handlers
window.showPage = showPage;
window.showAdminPage = showAdminPage;
window.showBrand = showBrand;
window.showCat = showCat;
window.showSocialPage = showSocialPage;
window.showVendorTab = showVendorTab;
window.toggleTheme = toggleTheme;
window.openMobileNav = openMobileNav;
window.closeMobileNav = closeMobileNav;
window.toggleCart = toggleCart;
window.openModal = openModal;
window.closeMBg = closeMBg;
window.closeMDirect = closeMDirect;
window.selThumb = selThumb;
window.selColorFn = selColorFn;
window.selSizeFn = selSizeFn;
window.changeQty = changeQty;
window.addToCartModal = addToCartModal;
window.removeFromCart = removeFromCart;
window.goCheckout = goCheckout;
window.filterP = filterP;
window.selectPay = selectPay;
window.fmtCard = fmtCard;
window.fmtExp = fmtExp;
window.placeOrder = placeOrder;
window.openPayGateway = openPayGateway;
window.closePgw = closePgw;
window.selPgwMethod = selPgwMethod;
window.pgwFmtCard = pgwFmtCard;
window.pgwFmtExp = pgwFmtExp;
window.pgwOtpNext = pgwOtpNext;
window.pgwPay = pgwPay;
window.pgwFinish = pgwFinish;
window.openAddProd = openAddProd;
window.editProd = editProd;
window.closeAddProd = closeAddProd;
window.saveProduct = saveProduct;
window.delProd = delProd;
window.updOrdStatus = updOrdStatus;
window.cancelOrd = cancelOrd;
window.filterCRM = filterCRM;
window.filterCRMTab = filterCRMTab;
window.openCRMCust = openCRMCust;
window.openCRMCust_admin = openCRMCust_admin;
window.schedFU = schedFU;
window.markFUDone = markFUDone;
window.askAI = askAI;
window.sendQ = sendQ;
window.sendAI = sendAI;
window.aiCaption = aiCaption;
window.schedulePost = schedulePost;
window.scheduleSave = scheduleSave;
window.removeScheduled = removeScheduled;
window.updateCharCount = updateCharCount;
window.filterWaChats = filterWaChats;
window.openWaChat = openWaChat;
window.waQuickReply = waQuickReply;
window.sendWaMsg = sendWaMsg;
window.waLoadTemplate = waLoadTemplate;
window.sendWaBroadcast = sendWaBroadcast;
window.waUseTemplate = waUseTemplate;
window.showWaTab = showWaTab;
window.trackOrder = trackOrder;
window.renderVendorPortal = renderVendorPortal;
window.renderVendorProducts = renderVendorProducts;
window.renderVendorOrders = renderVendorOrders;
window.renderVendorAnalytics = renderVendorAnalytics;
window.addEventListener('DOMContentLoaded', () => checkLogin());

// ─── LOGIN EXPORTS ───
window.doLogin = doLogin;
window.doLogout = doLogout;
window.sha256 = sha256;
