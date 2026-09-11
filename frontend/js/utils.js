// @ts-check
// ── UTILS.JS ──
// Shared utility functions: XSS protection, toasts, local storage persistence,
// theme toggle, mobile navigation, API helpers, and banner dismissal.

// ── XSS PROTECTION ──
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── TOAST ───
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.className = 'show ' + type;
  clearTimeout(window._tt);
  window._tt = setTimeout(() => t.className = '', 3200);
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

// ─── BANNER ───
function dismissBanner() {
  const banner = document.getElementById('demoBanner');
  if (banner) banner.style.display = 'none';
  localStorage.setItem('drape_banner_dismissed', '1');
}

// ─── API HELPERS ───
async function loadProductsFromAPI() {
  // Show loading state in shop grid
  const shopGrid = document.getElementById('shopGrid');
  const featuredGrid = document.getElementById('featuredGrid');
  if (shopGrid) shopGrid.innerHTML = '<div style="text-align:center;padding:56px;color:var(--slate)">Loading products...</div>';
  if (featuredGrid) featuredGrid.innerHTML = '<div style="text-align:center;padding:56px;color:var(--slate)">Loading...</div>';
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
    const headers = { 'Content-Type': 'application/json' };
    if (customerAccessToken) headers['Authorization'] = `Bearer ${customerAccessToken}`;
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(order)
    });
    return res.ok ? await res.json() : null;
  } catch (e) { console.error('Create order error:', e); return null; }
}

async function validateCartAPI(items) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (customerAccessToken) headers['Authorization'] = `Bearer ${customerAccessToken}`;
    const res = await fetch(`${API_BASE}/orders/validate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ items })
    });
    return res.ok ? await res.json() : null;
  } catch (e) { console.error('Cart validation error:', e); return null; }
}

// ── EXPORT TO WINDOW ──
window.escapeHtml = escapeHtml;
window.showToast = showToast;
window.loadState = loadState;
window.saveState = saveState;
window.toggleTheme = toggleTheme;
window.openMobileNav = openMobileNav;
window.closeMobileNav = closeMobileNav;
window.dismissBanner = dismissBanner;
window.loadProductsFromAPI = loadProductsFromAPI;
window.trackOrderAPI = trackOrderAPI;
window.createOrderAPI = createOrderAPI;
window.validateCartAPI = validateCartAPI;
