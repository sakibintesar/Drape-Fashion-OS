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

const DEFAULT_PRODUCTS = JSON.parse(JSON.stringify(products));
let orders = [];
let cart = [];
let selProd = null;
let selColor = null;
let selSize = null;
let mQty = 1;
let selPay = 'card';
let pgwMethod = 'card';
let pgwOrderData = null;
let scheduledPosts = [];
let activeWaChat = null;
let waChats = [];

const API_BASE = '/api';

async function loadProductsFromAPI() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (res.ok) {
      const data = await res.json();
      products = data.products || [];
      return true;
    }
  } catch (e) { console.error('Failed to load products from API:', e); }
  return false;
}

async function trackOrderAPI(orderId) {
  try {
    const res = await fetch(`${API_BASE}/orders/track/${orderId}`);
    if (res.ok) return await res.json();
  } catch (e) { console.error('Track order error:', e); }
  return null;
}

async function createOrderAPI(order) {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return res.ok ? await res.json() : null;
  } catch (e) { console.error('Create order error:', e); return null; }
}

// ─── CUSTOMER AUTH ───
let customerUser = null;
let customerAccessToken = null;
let customerRefreshToken = null;

async function validateCartAPI(items) {
  try {
    const res = await fetch(`${API_BASE}/orders/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    return res.ok ? await res.json() : null;
  } catch (e) { console.error('Cart validation error:', e); return null; }
}

async function doCustomerLogin() {
  const email = document.getElementById('custEmail').value.trim();
  const password = document.getElementById('custPassword').value;
  const errorEl = document.getElementById('custAuthError');
  if (!email || !password) { errorEl.textContent = 'Email and password required'; errorEl.style.display = ''; return; }
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password })
    });
    const data = await res.json();
    if (res.ok && data.accessToken && data.user.role === 'customer') {
      customerAccessToken = data.accessToken;
      customerRefreshToken = data.refreshToken;
      customerUser = data.user;
      sessionStorage.setItem('drape_customer_refresh', data.refreshToken);
      updateCustomerAuthUI();
      closeCustomerAuthDirect();
      showToast('Welcome back!', 'success');
    } else {
      errorEl.textContent = data.error || 'Invalid credentials';
      errorEl.style.display = '';
    }
  } catch (e) {
    errorEl.textContent = 'Network error. Is the server running?';
    errorEl.style.display = '';
  }
}

async function doCustomerRegister() {
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const fname = document.getElementById('regFname').value.trim();
  const lname = document.getElementById('regLname').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const errorEl = document.getElementById('regAuthError');
  if (!email || !password) { errorEl.textContent = 'Email and password required'; errorEl.style.display = ''; return; }
  if (password.length < 6) { errorEl.textContent = 'Password must be at least 6 characters'; errorEl.style.display = ''; return; }
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fname, lname, phone })
    });
    const data = await res.json();
    if (res.ok && data.accessToken) {
      customerAccessToken = data.accessToken;
      customerRefreshToken = data.refreshToken;
      customerUser = data.user;
      sessionStorage.setItem('drape_customer_refresh', data.refreshToken);
      updateCustomerAuthUI();
      closeCustomerAuthDirect();
      showToast('Account created! Welcome to DRAPE.', 'success');
    } else {
      errorEl.textContent = data.error || 'Registration failed';
      errorEl.style.display = '';
    }
  } catch (e) {
    errorEl.textContent = 'Network error. Is the server running?';
    errorEl.style.display = '';
  }
}

async function doCustomerLogout() {
  try {
    if (customerRefreshToken) {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: customerRefreshToken })
      });
    }
  } catch (e) {}
  customerUser = null;
  customerAccessToken = null;
  customerRefreshToken = null;
  sessionStorage.removeItem('drape_customer_refresh');
  updateCustomerAuthUI();
  showToast('Signed out.');
  if (document.getElementById('page-account').classList.contains('active')) {
    showPage('home');
  }
  closeCustomerAuthDirect();
}

async function checkCustomerSession() {
  const stored = sessionStorage.getItem('drape_customer_refresh');
  if (stored) {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: stored })
      });
      if (res.ok) {
        const data = await res.json();
        customerAccessToken = data.accessToken;
        customerRefreshToken = stored;
        const meRes = await fetch(`${API_BASE}/auth/me`, {
          headers: { 'Authorization': `Bearer ${customerAccessToken}` }
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.user && meData.user.role === 'customer') {
            customerUser = meData.user;
          } else {
            sessionStorage.removeItem('drape_customer_refresh');
            return;
          }
        }
      } else {
        sessionStorage.removeItem('drape_customer_refresh');
      }
    } catch (e) { sessionStorage.removeItem('drape_customer_refresh'); }
  }
  updateCustomerAuthUI();
}

function updateCustomerAuthUI() {
  const btn = document.getElementById('accountBtn');
  const mobileBtn = document.getElementById('mobileAccountBtn');
  if (customerUser) {
    if (btn) btn.textContent = '👤 ' + (customerUser.fname || customerUser.email.split('@')[0]);
    if (mobileBtn) mobileBtn.textContent = '👤 ' + (customerUser.fname || 'Account');
  } else {
    if (btn) btn.textContent = '👤';
    if (mobileBtn) mobileBtn.textContent = '👤 Account';
  }
  if (document.getElementById('page-account').classList.contains('active')) {
    renderAccountPage();
  }
}

function showCustomerAuth() {
  const modal = document.getElementById('customerAuthModal');
  if (modal) {
    modal.classList.add('show');
    if (customerUser) {
      document.getElementById('authLoginForm').style.display = 'none';
      document.getElementById('authRegisterForm').style.display = 'none';
      document.getElementById('authLoggedIn').style.display = '';
      document.getElementById('accountName').textContent = (customerUser.fname || '') + ' ' + (customerUser.lname || '');
      document.getElementById('accountEmail').textContent = customerUser.email;
    } else {
      showLoginForm();
    }
  }
}

function closeCustomerAuth(e) {
  if (e && e.target === document.getElementById('customerAuthModal')) closeCustomerAuthDirect();
}
function closeCustomerAuthDirect() {
  const modal = document.getElementById('customerAuthModal');
  if (modal) modal.classList.remove('show');
}
function showLoginForm() {
  document.getElementById('authLoginForm').style.display = '';
  document.getElementById('authRegisterForm').style.display = 'none';
  document.getElementById('authLoggedIn').style.display = 'none';
  document.getElementById('custAuthError').style.display = 'none';
}
function showRegisterForm() {
  document.getElementById('authLoginForm').style.display = 'none';
  document.getElementById('authRegisterForm').style.display = '';
  document.getElementById('authLoggedIn').style.display = 'none';
  document.getElementById('regAuthError').style.display = 'none';
}

async function renderAccountPage() {
  const container = document.getElementById('accountContent');
  if (!customerUser) {
    container.innerHTML = `
      <div class="track-result open">
        <div style="font-size:12px; color:var(--slate); text-align:center; padding:40px">
          <div style="font-size:48px; margin-bottom:16px">👤</div>
          <div>Sign in to view your orders and profile.</div>
          <button class="btn-primary" style="margin-top:20px" onclick="showCustomerAuth()">Sign In</button>
        </div>
      </div>`;
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/customers/orders`, {
      headers: { 'Authorization': `Bearer ${customerAccessToken}` }
    });
    const data = await res.json();
    const orders = data.orders || [];
    let html = `
      <div class="track-result open" style="margin-bottom:20px">
        <div style="font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--slate); margin-bottom:12px">Profile</div>
        <div style="font-size:16px; margin-bottom:4px">${customerUser.fname || ''} ${customerUser.lname || ''}</div>
        <div style="font-size:12px; color:var(--slate)">${customerUser.email}</div>
        ${customerUser.phone ? `<div style="font-size:12px; color:var(--slate); margin-top:4px">${customerUser.phone}</div>` : ''}
      </div>`;
    if (orders.length === 0) {
      html += `<div class="track-result open"><div style="font-size:12px; color:var(--slate); text-align:center; padding:30px">No orders yet. <a href="#" onclick="showPage('shop')">Start shopping →</a></div></div>`;
    } else {
      html += `<div style="font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--slate); margin-bottom:12px">Order History</div>`;
      for (const o of orders) {
        html += `
          <div class="track-result open" style="margin-bottom:12px">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
              <div style="font-size:14px; font-weight:500">${o.id}</div>
              <div style="font-size:10px; text-transform:uppercase; padding:2px 8px; border-radius:10px; background:var(--dust); color:var(--slate)">${o.status}</div>
            </div>
            <div style="font-size:12px; color:var(--slate); margin-bottom:4px">${o.date} · ${o.items.length} item${o.items.length !== 1 ? 's' : ''}</div>
            <div style="font-size:12px; font-weight:500">Total: ৳${o.total.toLocaleString()}</div>
          </div>`;
      }
    }
    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = `<div class="track-result open"><div style="font-size:12px; color:var(--slate); text-align:center; padding:30px">Failed to load orders. Please try again.</div></div>`;
  }
}

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

// ─── TAMPER DETECTION ───
function hashProductPrices() {
  return products.map(p => `${p.id}:${p.price}:${p.name}`).join('|');
}
function verifyIntegrity() {
  const savedHash = localStorage.getItem('drape_price_hash');
  const currentHash = hashProductPrices();
  if (savedHash && savedHash !== currentHash) {
    const warn = document.getElementById('tamperWarning');
    if (warn) warn.classList.add('show');
    products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
    saveState();
    showToast('Price data was tampered with. Restored defaults.', 'error');
    return false;
  }
  return true;
}

// ─── LOCAL STORAGE PERSISTENCE ───
function loadState() {
  try {
    const savedCart = localStorage.getItem('drape_cart');
    const savedScheduled = localStorage.getItem('drape_scheduled');
    const savedTheme = localStorage.getItem('drape_theme');
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedScheduled) scheduledPosts = JSON.parse(savedScheduled);
    if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
    else document.documentElement.setAttribute('data-theme', 'light');
  } catch (e) { console.warn('LocalStorage load failed:', e); }
}

function saveState() {
  try {
    localStorage.setItem('drape_cart', JSON.stringify(cart));
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
window.addEventListener('DOMContentLoaded', async () => {
  loadState();
  await checkCustomerSession();
  await loadProductsFromAPI();
  initWaChats();
  renderAll();
  let i = 0; const t = setInterval(() => { const el = document.getElementById('heroCount'); if (el) el.textContent = i++; if (i > products.length) clearInterval(t); }, 40);
});

// ─── NAVIGATION ───
function showPage(n) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + n);
  if (page) page.classList.add('active');
  window.scrollTo(0, 0);
  if (n === 'shop') renderShopGrid(products);
  if (n === 'home') renderFeatured();
  if (n === 'checkout') renderCoSummary();
  if (n === 'catalog') renderCatalog('all');
  if (n === 'social') showSocialPage('overview', document.querySelector('.social-nav-btn'));
  if (n === 'whatsapp') { if (waChats.length === 0) initWaChats(); }
  if (n === 'track') { /* static */ }
  if (n === 'account') renderAccountPage();
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const activeLink = document.querySelector('.nav-link[onclick*="showPage(\'' + n + '\')"]');
  if (activeLink) activeLink.classList.add('active');
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

// ─── RENDERING ───
function renderAll() { renderFeatured(); renderShopGrid(products); }

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
function goCheckout() {
  if (!cart.length) return;
  toggleCart();
  showPage('checkout');
  // Pre-fill customer data if logged in
  if (customerUser) {
    const fn = document.getElementById('co_fname');
    const ln = document.getElementById('co_lname');
    const em = document.getElementById('co_email');
    const ph = document.getElementById('co_phone');
    if (fn && customerUser.fname) fn.value = customerUser.fname;
    if (ln && customerUser.lname) ln.value = customerUser.lname;
    if (em && customerUser.email) em.value = customerUser.email;
    if (ph && customerUser.phone) ph.value = customerUser.phone;
  }
}

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
  const cartItems = cart.map(i => ({ id: i.prod.id, price: i.prod.price, qty: i.qty, size: i.size, color: i.color, emoji: i.prod.emoji }));
  validateCartAPI(cartItems).then(validation => {
    if (!validation || !validation.valid) {
      const proc = document.getElementById('pgwProcessing');
      if (proc) proc.classList.remove('show');
      const pf = document.getElementById('pgwForm');
      if (pf) pf.style.display = 'block';
      const errors = validation && validation.errors ? validation.errors.map(e => e.name + ': ' + e.error).join('\n') : 'Cart validation failed. Please try again.';
      showToast(errors, 'error');
      return;
    }
    const orderPayload = {
      customer_id: customerUser ? customerUser.id : null,
      customer_fname: pgwOrderData.fname,
      customer_lname: pgwOrderData.lname,
      email: pgwOrderData.email,
      phone: pgwOrderData.phone,
      address: pgwOrderData.addr,
      city: pgwOrderData.city,
      postcode: '',
      items: validation.items,
      subtotal: validation.subtotal,
      shipping: validation.shipping,
      total: validation.total,
      payment_method: pgwMethod
    };
    createOrderAPI(orderPayload).then(data => {
      if (data && data.orderId) {
        cart.forEach(i => { const p = products.find(x => x.id === i.prod.id); if (p) { p.stock = Math.max(0, p.stock - i.qty); p.sold = (p.sold || 0) + i.qty; } });
        const txnId = 'TXN' + Date.now().toString().slice(-10).toUpperCase();
        const pt = document.getElementById('pgwTxnId');
        if (pt) pt.textContent = 'Transaction ID: ' + txnId + ' · Order: ' + data.orderId;
        const coid = document.getElementById('confirmedOID');
        if (coid) coid.textContent = data.orderId;
        const ps = document.getElementById('pgwSuccess');
        if (ps) ps.classList.add('show');
        cart = []; updateCartUI(); saveState();
      } else {
        showToast('Order failed. Please try again.', 'error');
      }
    });
  });
}
function pgwFinish() { closePgw(); showPage('confirmed'); }

// ─── SOCIAL ───
function renderSocialOverview() {
  const total = 12400 + 8100 + 6200 + 2100;
  const sf = document.getElementById('soc_followers');
  if (sf) sf.textContent = (total / 1000).toFixed(1) + 'K';
  const sr = document.getElementById('soc_reach');
  if (sr) sr.textContent = '84.2K';
  const platforms = [
    { icon: '📸', bg: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', name: 'Instagram', handle: '@drape.fashion', followers: '12.4K', posts: 342, eng: '5.2%' },
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
function waQuickReply(text) {
  const input = document.getElementById('waInput-' + activeWaChat);
  if (input) input.value = text;
}
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
async function trackOrder() {
  const input = document.getElementById('trackInput');
  if (!input) return;
  const id = input.value.trim().toUpperCase();
  const result = document.getElementById('trackResult');
  if (!result) return;
  if (!id) { showToast('Enter an order ID.', 'error'); return; }
  const data = await trackOrderAPI(id);
  if (!data || !data.order) {
    result.innerHTML = `<div style="text-align:center;padding:40px;color:var(--slate)"><div style="font-size:48px;margin-bottom:16px">🔍</div><div style="font-size:14px">No order found with ID <strong>${id}</strong></div><div style="font-size:12px;margin-top:8px">Check your confirmation email or try a recent order ID</div></div>`;
    result.classList.add('open');
    return;
  }
  const order = data.order;
  const steps = [
    { title: 'Order Placed', desc: 'Your order has been received and confirmed.', time: order.date + ' 09:00', status: 'completed' },
    { title: 'Payment Confirmed', desc: 'Payment received.', time: order.date + ' 09:15', status: 'completed' },
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
        <span style="color:var(--slate)">Payment: <strong>CARD</strong></span>
      </div>
    </div>`;
  result.classList.add('open');
}

// ─── TOAST ───
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.className = 'show ' + type;
  clearTimeout(window._tt);
  window._tt = setTimeout(() => t.className = '', 3200);
}

// Export functions to window
window.showPage = showPage;
window.showBrand = showBrand;
window.showCat = showCat;
window.showSocialPage = showSocialPage;
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
window.openPayGateway = openPayGateway;
window.closePgw = closePgw;
window.selPgwMethod = selPgwMethod;
window.pgwFmtCard = pgwFmtCard;
window.pgwFmtExp = pgwFmtExp;
window.pgwOtpNext = pgwOtpNext;
window.pgwPay = pgwPay;
window.pgwFinish = pgwFinish;
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
window.showToast = showToast;
