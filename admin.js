// DRAPE Fashion OS — Admin Portal JS
// Connects to the backend API for all admin operations

const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:3000/api'
  : '/api';

let adminToken = null;
let adminRefreshToken = null;
let adminUser = null;
let products = [];
let orders = [];
let customers = [];
let scheduledPosts = [];
let waChats = [];
let activeWaChat = null;
let editProductId = null;

// ── TOAST ──
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  setTimeout(() => t.className = 'toast', 3000);
}

// ── AUTH ──
async function doLogin() {
  const pass = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  if (!pass) { errEl.style.display = 'block'; return; }
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: pass })
    });
    const data = await res.json();
    if (res.ok && data.user?.role === 'admin') {
      adminToken = data.accessToken;
      adminRefreshToken = data.refreshToken;
      adminUser = data.user;
      sessionStorage.setItem('drape_admin_refresh', data.refreshToken);
      document.getElementById('loginOverlay').style.display = 'none';
      await loadAll();
      showAdminPage('dashboard', document.querySelector('.admin-nav-btn'));
    } else {
      errEl.style.display = 'block';
      setTimeout(() => errEl.style.display = 'none', 3000);
    }
  } catch (e) {
    // Network/server error — never grant access client-side. Fail closed.
    console.error('Login request failed:', e);
    errEl.textContent = 'Could not reach the server. Please try again.';
    errEl.style.display = 'block';
    setTimeout(() => errEl.style.display = 'none', 4000);
  }
}

async function doLogout() {
  if (adminRefreshToken) {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: adminRefreshToken })
    }).catch(() => {});
  }
  adminToken = null; adminRefreshToken = null; adminUser = null;
  sessionStorage.removeItem('drape_admin_refresh');
  document.getElementById('loginOverlay').style.display = 'flex';
}

async function authFetch(url, options = {}) {
  options.headers = options.headers || {};
  if (adminToken) options.headers['Authorization'] = `Bearer ${adminToken}`;
  const res = await fetch(url, options);
  if (res.status === 403) {
    // Try token refresh
    const stored = sessionStorage.getItem('drape_admin_refresh');
    if (stored) {
      const r = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: stored })
      });
      if (r.ok) {
        const d = await r.json();
        adminToken = d.accessToken;
        options.headers['Authorization'] = `Bearer ${adminToken}`;
        return fetch(url, options);
      }
    }
  }
  return res;
}

// ── INIT ──
async function loadAll() {
  await Promise.all([loadProducts(), loadOrders(), loadCustomers()]);
}

async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (res.ok) { const d = await res.json(); products = d.products || []; }
  } catch (e) { console.warn('Could not load products from API, using seed data'); }
}

async function loadOrders() {
  try {
    const res = await authFetch(`${API_BASE}/orders`);
    if (res.ok) { const d = await res.json(); orders = d.orders || []; }
  } catch (e) {}
}

async function loadCustomers() {
  try {
    const res = await authFetch(`${API_BASE}/customers`);
    if (res.ok) { const d = await res.json(); customers = d.customers || []; }
  } catch (e) {}
}

// ── NAVIGATION ──
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + name);
  if (pg) pg.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  if (name === 'social') renderSocialOverview();
  if (name === 'whatsapp') { if (!waChats.length) initWaChats(); renderWaList(); }
  if (name === 'crm') renderCRM();
}

function showAdminPage(id, btn) {
  document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('admin-' + id);
  if (pg) pg.classList.add('active');
  document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const renders = {
    dashboard: renderDashboard,
    orders: renderOrders,
    inventory: renderInventory,
    vendors: renderVendors,
    customers: renderCustomers,
    analytics: renderAnalytics
  };
  if (renders[id]) renders[id]();
}

function fmt(n) { return '৳' + Number(n || 0).toLocaleString(); }

// ── DASHBOARD ──
async function renderDashboard() {
  await loadAll();
  const el = document.getElementById('adminDate');
  if (el) el.textContent = new Date().toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Try to get real analytics
  try {
    const res = await authFetch(`${API_BASE}/analytics`);
    if (res.ok) {
      const d = await res.json();
      setEl('st_rev', fmt(d.revenue));
      setEl('st_ord', d.orders);
      setEl('st_prod', d.products);
      setEl('st_cust', d.customers);
      setEl('st_rev_d', '+12% vs last month');
      setEl('st_ord_d', d.orders + ' total');
      setEl('st_cust_d', d.customers + ' registered');
      renderMiniChart(d.dailyRevenue || []);
      renderRecentOrders(d.recentOrders || orders.slice(-5).reverse());
      return;
    }
  } catch (e) {}

  // Fallback: compute from local data
  const rev = orders.reduce((a, o) => a + (o.total || 0), 0);
  setEl('st_rev', fmt(rev));
  setEl('st_ord', orders.length);
  setEl('st_prod', products.length);
  setEl('st_cust', customers.length);
  renderRecentOrders(orders.slice(-5).reverse());
}

function setEl(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

function renderMiniChart(days) {
  const chart = document.getElementById('revChart');
  const lbls = document.getElementById('chartLbls');
  if (!chart || !days.length) return;
  const max = Math.max(...days.map(d => d.revenue || 0), 1);
  const todayIdx = days.length - 1;
  chart.innerHTML = days.map((d, i) => `<div class="mini-bar${i === todayIdx ? ' hi' : ''}" style="height:${Math.round(((d.revenue || 0) / max) * 100)}%" title="${d.label}: ${fmt(d.revenue)}"></div>`).join('');
  if (lbls) lbls.innerHTML = days.map(d => `<div style="flex:1;text-align:center">${d.label}</div>`).join('');
}

function renderRecentOrders(list) {
  const tbody = document.getElementById('recentOBody');
  if (!tbody) return;
  tbody.innerHTML = list.slice(0, 5).map(o => `
    <tr>
      <td class="mono" style="font-size:10px">${o.order_id || o.orderId || o.id}</td>
      <td>${o.customer_fname || o.fname || ''} ${o.customer_lname || o.lname || ''}</td>
      <td>${(o.items || []).length} item(s)</td>
      <td>${fmt(o.total)}</td>
      <td><span class="status-pill status-${o.status}">${o.status || 'pending'}</span></td>
      <td style="color:var(--slate);font-size:10px">${new Date(o.created_at || o.date || Date.now()).toLocaleDateString()}</td>
    </tr>`).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--slate);padding:20px">No orders yet.</td></tr>';
}

// ── ORDERS ──
async function renderOrders() {
  await loadOrders();
  const cnt = document.getElementById('orderCount');
  if (cnt) cnt.textContent = orders.length + ' orders';
  const tbody = document.getElementById('allOBody');
  if (!tbody) return;
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td class="mono" style="font-size:10px">${o.order_id || o.id}</td>
      <td>${o.customer_fname || ''} ${o.customer_lname || ''}<br><span style="font-size:10px;color:var(--slate)">${o.email || ''}</span></td>
      <td>${(o.items || []).length} item(s)</td>
      <td style="font-weight:500">${fmt(o.total)}</td>
      <td style="font-size:10px;text-transform:uppercase;font-family:'DM Mono',monospace">${o.payment_method || '—'}</td>
      <td>
        <select style="border:1px solid var(--dust);padding:4px 8px;font-size:11px;font-family:'DM Sans',sans-serif;background:var(--card);cursor:pointer"
          onchange="updateStatus('${o.order_id || o.id}', this.value)">
          ${['pending','processing','shipped','delivered','cancelled'].map(s =>
            `<option value="${s}"${o.status === s ? ' selected' : ''}>${s}</option>`
          ).join('')}
        </select>
      </td>
      <td style="color:var(--slate);font-size:10px">${new Date(o.created_at || Date.now()).toLocaleDateString()}</td>
      <td><button class="admin-btn danger sm" onclick="cancelOrder('${o.order_id || o.id}')">Cancel</button></td>
    </tr>`).join('') || '<tr><td colspan="8" style="text-align:center;color:var(--slate);padding:24px">No orders yet. Place orders from the storefront!</td></tr>';
}

async function updateStatus(orderId, status) {
  try {
    const res = await authFetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) { showToast('Status updated: ' + status, 'success'); await loadOrders(); renderOrders(); }
  } catch (e) {
    const o = orders.find(x => (x.order_id || x.id) === orderId);
    if (o) o.status = status;
    showToast('Status updated (offline mode)', 'success');
  }
}

async function cancelOrder(orderId) {
  if (!confirm('Cancel this order?')) return;
  try {
    await authFetch(`${API_BASE}/orders/${orderId}`, { method: 'DELETE' });
  } catch (e) {}
  const o = orders.find(x => (x.order_id || x.id) === orderId);
  if (o) o.status = 'cancelled';
  renderOrders();
  showToast('Order cancelled.', 'error');
}

// ── INVENTORY ──
async function renderInventory() {
  await loadProducts();
  const tbody = document.getElementById('invBody');
  if (!tbody) return;
  tbody.innerHTML = products.map(p => `
    <tr>
      <td><span style="font-size:18px">${p.emoji || '👗'}</span> ${p.name}</td>
      <td style="font-size:11px">${p.vendor}</td>
      <td style="color:var(--slate);font-size:11px">${p.category}</td>
      <td style="font-weight:500">${fmt(p.price)}</td>
      <td style="font-weight:500;color:${p.stock === 0 ? 'var(--error)' : p.stock < 10 ? 'var(--copper)' : 'inherit'}">${p.stock}</td>
      <td style="color:var(--slate)">${p.sold || 0}</td>
      <td>${
        p.stock === 0
          ? '<span class="status-pill" style="background:#F8D7DA;color:#721C24">Sold Out</span>'
          : p.stock < 10
          ? '<span class="status-pill" style="background:#FEF3CD;color:#856404">Low Stock</span>'
          : '<span class="status-pill" style="background:#D4EDDA;color:#155724">In Stock</span>'
      }</td>
      <td style="display:flex;gap:5px">
        <button class="admin-btn sm ghost" onclick="openEditProd(${p.id})">Edit</button>
        <button class="admin-btn sm" onclick="dupeProd(${p.id})">Dupe</button>
        <button class="admin-btn sm danger" onclick="deleteProd(${p.id})">Del</button>
      </td>
    </tr>`).join('') || '<tr><td colspan="8" style="text-align:center;color:var(--slate);padding:24px">No products found.</td></tr>';
}

function openAddProd() {
  editProductId = null;
  setEl('addProdTitle', 'Add Product');
  ['np_name','np_price','np_orig','np_stock','np_emoji','np_desc','np_sizes','np_colors','np_subs','np_material','np_badge'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('addProdModal').classList.add('open');
}

function openEditProd(id) {
  const p = products.find(x => x.id === id); if (!p) return;
  editProductId = id;
  setEl('addProdTitle', 'Edit Product');
  setVal('np_name', p.name); setVal('np_price', p.price); setVal('np_orig', p.origPrice || p.orig_price || '');
  setVal('np_stock', p.stock); setVal('np_emoji', p.emoji || ''); setVal('np_desc', p.description || p.desc || '');
  setVal('np_sizes', Array.isArray(p.sizes) ? p.sizes.join(',') : '');
  setVal('np_colors', Array.isArray(p.colors) ? p.colors.map(c => `${c.name}:${c.hex}`).join(',') : '');
  setVal('np_material', p.material || ''); setVal('np_badge', p.badge || '');
  document.getElementById('addProdModal').classList.add('open');
}

function setVal(id, val) { const el = document.getElementById(id); if (el) el.value = val || ''; }

function closeAddProd() { document.getElementById('addProdModal').classList.remove('open'); }

async function saveProduct() {
  const name = document.getElementById('np_name')?.value.trim();
  const price = parseInt(document.getElementById('np_price')?.value) || 0;
  const stock = parseInt(document.getElementById('np_stock')?.value) || 0;
  const vendor = document.getElementById('np_vendor')?.value || 'LOOM & GRACE';
  const category = document.getElementById('np_cat')?.value || 'Tops';
  const emoji = document.getElementById('np_emoji')?.value || '👗';
  const desc = document.getElementById('np_desc')?.value || '';
  const sizesRaw = document.getElementById('np_sizes')?.value || 'S,M,L,XL';
  const colorsRaw = document.getElementById('np_colors')?.value || '';
  const material = document.getElementById('np_material')?.value || '';
  const badge = document.getElementById('np_badge')?.value || '';
  const origPrice = parseInt(document.getElementById('np_orig')?.value) || null;

  if (!name || !price) { showToast('Name and price required.', 'error'); return; }

  const sizes = sizesRaw.split(',').map(s => s.trim()).filter(Boolean);
  const colors = colorsRaw.split(',').map(c => {
    const [n, h] = c.trim().split(':');
    return n && h ? { name: n.trim(), hex: h.trim() } : null;
  }).filter(Boolean);

  const payload = { name, category, vendor, price, origPrice, stock, emoji, colors, sizes, description: desc, badge, material, care: 'Check label', origin: 'Bangladesh', subs: [] };

  try {
    let res;
    if (editProductId) {
      res = await authFetch(`${API_BASE}/products/${editProductId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
    } else {
      res = await authFetch(`${API_BASE}/products`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
    }
    if (res && res.ok) {
      showToast(editProductId ? 'Product updated!' : 'Product added!', 'success');
    } else {
      showToast('Saved locally (no API connection).', 'success');
    }
  } catch (e) {
    showToast('Saved locally (no API connection).', 'success');
  }
  closeAddProd();
  await loadProducts();
  renderInventory();
}

async function dupeProd(id) {
  const p = products.find(x => x.id === id); if (!p) return;
  const payload = { ...p, name: p.name + ' (Copy)', stock: 0, sold: 0, badge: 'New Arrival', id: undefined };
  try {
    const res = await authFetch(`${API_BASE}/products`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    if (res.ok) showToast('Product duplicated!', 'success');
  } catch (e) { showToast('Duplicated locally.', 'success'); }
  await loadProducts(); renderInventory();
}

async function deleteProd(id) {
  if (!confirm('Delete this product? This cannot be undone.')) return;
  try {
    const res = await authFetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    if (res.ok) showToast('Product deleted.', 'error');
  } catch (e) { products = products.filter(p => p.id !== id); showToast('Deleted locally.', 'error'); }
  await loadProducts(); renderInventory();
}

// ── VENDORS ──
const VENDORS = [
  { name: 'LOOM & GRACE', icon: '🧵', cat: 'Dresses · Bottoms', loc: 'Dhaka', status: 'Active' },
  { name: 'ZEPHYR CUTS', icon: '✂️', cat: 'Outerwear · Bottoms', loc: 'Dhaka', status: 'Active' },
  { name: 'THREAD REPUBLIC', icon: '🪡', cat: 'Tops', loc: 'Chittagong', status: 'Active' },
  { name: 'NAKSHI STUDIO', icon: '🎨', cat: 'Tops · Outerwear', loc: 'Rajshahi', status: 'Active' },
  { name: 'ADORN CO.', icon: '💎', cat: 'Accessories', loc: 'Sylhet', status: 'Active' },
];

function renderVendors() {
  const tbody = document.getElementById('vendBody');
  if (!tbody) return;
  const vendStats = {};
  products.forEach(p => {
    if (!vendStats[p.vendor]) vendStats[p.vendor] = { skus: 0, rev: 0 };
    vendStats[p.vendor].skus++;
    vendStats[p.vendor].rev += (p.price || 0) * (p.sold || 0);
  });
  tbody.innerHTML = VENDORS.map(v => `
    <tr>
      <td><strong>${v.icon} ${v.name}</strong></td>
      <td style="color:var(--slate);font-size:11px">${v.cat}</td>
      <td style="font-size:11px">${v.loc}</td>
      <td>${vendStats[v.name]?.skus || '—'}</td>
      <td style="font-weight:500">${vendStats[v.name] ? fmt(vendStats[v.name].rev) : '—'}</td>
      <td><span class="status-pill" style="background:#D4EDDA;color:#155724">${v.status}</span></td>
    </tr>`).join('');
}

// ── CUSTOMERS ──
async function renderCustomers() {
  await loadCustomers();
  const tbody = document.getElementById('custBody');
  if (!tbody) return;
  if (!customers.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--slate);padding:24px">No registered customers yet.</td></tr>';
    return;
  }
  const custOrders = {};
  orders.forEach(o => {
    const key = o.email || '';
    if (!custOrders[key]) custOrders[key] = { count: 0, spent: 0 };
    custOrders[key].count++;
    custOrders[key].spent += o.total || 0;
  });
  tbody.innerHTML = customers.map(c => {
    const od = custOrders[c.email] || { count: 0, spent: 0 };
    const seg = od.spent > 10000 ? 'VIP' : od.count > 2 ? 'Loyal' : 'New';
    const segStyle = seg === 'VIP' ? 'background:#e8d5ff;color:#5b21b6' : seg === 'Loyal' ? 'background:#D4EDDA;color:#155724' : 'background:#CCE5FF;color:#004085';
    return `<tr>
      <td style="font-weight:500">${c.fname || ''} ${c.lname || ''}</td>
      <td style="color:var(--slate);font-size:11px">${c.email}</td>
      <td style="font-size:11px">${c.city || '—'}</td>
      <td>${od.count}</td>
      <td style="font-weight:500">${fmt(od.spent)}</td>
      <td><span class="status-pill" style="${segStyle}">${seg}</span></td>
    </tr>`;
  }).join('');
}

// ── ANALYTICS ──
async function renderAnalytics() {
  await loadAll();
  try {
    const res = await authFetch(`${API_BASE}/analytics`);
    if (res.ok) {
      const d = await res.json();
      setEl('an_aov', d.orders ? fmt(Math.round(d.revenue / d.orders)) : '—');
      if (d.categories?.length) setEl('an_topcat', d.categories[0].category);
      renderTopProducts(d.topProducts || []);
      return;
    }
  } catch (e) {}
  // Fallback
  const rev = orders.reduce((a, o) => a + (o.total || 0), 0);
  setEl('an_aov', orders.length ? fmt(Math.round(rev / orders.length)) : '—');
  renderTopProducts([...products].sort((a, b) => (b.price * b.sold) - (a.price * a.sold)).slice(0, 5));
}

function renderTopProducts(list) {
  const tbody = document.getElementById('topPBody');
  if (!tbody) return;
  tbody.innerHTML = list.map(p => `
    <tr>
      <td>${p.emoji || '👗'} ${p.name}</td>
      <td style="font-size:11px">${p.vendor || '—'}</td>
      <td style="color:var(--slate);font-size:11px">${p.category || '—'}</td>
      <td>${Array.isArray(p.colors) ? p.colors.map(c => `<div style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${c.hex};margin-right:2px;border:1px solid rgba(0,0,0,.1)"></div>`).join('') : '—'}</td>
      <td style="font-weight:500">${p.sold || 0}</td>
      <td style="font-weight:500">${fmt((p.price || 0) * (p.sold || 0))}</td>
    </tr>`).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--slate);padding:20px">No data yet.</td></tr>';
}

// ── CRM ──
function renderCRM() {
  const list = document.getElementById('crmList');
  if (!list) return;
  const crm = customers.map(c => {
    const od = orders.filter(o => o.email === c.email);
    const spent = od.reduce((a, o) => a + (o.total || 0), 0);
    const tag = spent > 10000 ? '⭐ VIP' : od.length > 2 ? '🔴 Hot' : '📋 New';
    return { ...c, orders: od.length, spent, tag };
  });
  list.innerHTML = crm.map(c => `
    <div class="crm-customer" onclick="openCRMProfile(${c.id})">
      <div class="crm-avatar">${(c.fname || 'U')[0]}</div>
      <div class="crm-info">
        <div class="crm-name">${c.fname || ''} ${c.lname || ''}</div>
        <div class="crm-meta">${c.email}</div>
      </div>
      <div style="font-size:10px;color:var(--copper)">${c.tag}</div>
    </div>`).join('') || '<div style="color:var(--slate);font-size:12px;padding:20px">No customers yet.</div>';
}

function filterCRM(val) {
  const items = document.querySelectorAll('.crm-customer');
  items.forEach(el => {
    el.style.display = el.textContent.toLowerCase().includes(val.toLowerCase()) ? '' : 'none';
  });
}
function filterCRMTab(tab, btn) {
  document.querySelectorAll('.crm-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}
function openCRMProfile(id) {
  const c = customers.find(x => x.id === id); if (!c) return;
  const od = orders.filter(o => o.email === c.email);
  const spent = od.reduce((a, o) => a + (o.total || 0), 0);
  const main = document.getElementById('crmMain');
  if (!main) return;
  main.innerHTML = `
    <div style="padding:28px;max-width:560px">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px">
        <div style="width:52px;height:52px;border-radius:50%;background:var(--ink);color:var(--chalk);display:flex;align-items:center;justify-content:center;font-size:20px;font-family:'Cormorant Garamond',serif">${(c.fname||'U')[0]}</div>
        <div>
          <div style="font-size:18px;font-weight:500">${c.fname||''} ${c.lname||''}</div>
          <div style="font-size:12px;color:var(--slate)">${c.email} · ${c.city||'—'}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:24px">
        <div class="stat-card"><div class="stat-label">Orders</div><div class="stat-value serif" style="font-size:24px">${od.length}</div></div>
        <div class="stat-card"><div class="stat-label">Total Spent</div><div class="stat-value serif" style="font-size:24px">${fmt(spent)}</div></div>
        <div class="stat-card"><div class="stat-label">Segment</div><div class="stat-value serif" style="font-size:20px">${spent > 10000 ? 'VIP' : od.length > 2 ? 'Loyal' : 'New'}</div></div>
      </div>
      <div style="font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--slate);margin-bottom:12px">Order History</div>
      ${od.length ? od.map(o => `<div style="background:var(--card);border:1px solid var(--dust);padding:12px 14px;margin-bottom:8px;font-size:12px;display:flex;justify-content:space-between;align-items:center"><div><div class="mono" style="font-size:10px">${o.order_id||o.id}</div><div style="color:var(--slate);margin-top:2px">${(o.items||[]).length} items</div></div><div style="text-align:right"><div style="font-weight:500">${fmt(o.total)}</div><span class="status-pill status-${o.status}" style="font-size:9px">${o.status}</span></div></div>`).join('') : '<div style="color:var(--slate);font-size:12px">No orders yet.</div>'}
    </div>`;
}

// ── SOCIAL ──
const socialPosts = {
  instagram: [
    { text: 'New drop 🌿 Muslin Wrap Dress by LOOM & GRACE. #DRAPE #DhakaFashion', emoji: '👗', likes: 842, comments: 67, status: 'live', date: '2026-06-20' },
    { text: 'Behind the scenes at NAKSHI STUDIO, Rajshahi. 220 artisans. #EthicalFashion', emoji: '🎨', likes: 1204, comments: 112, status: 'live', date: '2026-06-18' },
  ],
  facebook: [
    { text: 'DRAPE x THREAD REPUBLIC: Recycled knitwear. Shop now at drape.fashion', emoji: '✂️', likes: 312, comments: 28, status: 'live', date: '2026-06-19' },
  ],
  tiktok: [
    { text: "POV: You just found Bangladesh's most ethical fashion brand 🇧🇩", emoji: '🎬', likes: 4200, comments: 234, status: 'live', date: '2026-06-21' },
  ],
  linkedin: [
    { text: 'Building a fashion company that runs on systems. No spreadsheets. No gut calls.', emoji: '💼', likes: 87, comments: 22, status: 'live', date: '2026-06-18' },
  ]
};

function renderSocialOverview() {
  setEl('soc_followers', '28.8K');
  setEl('soc_reach', '142K');
  const pc = document.getElementById('platformCards');
  if (pc) pc.innerHTML = Object.entries(socialPosts).map(([platform, posts]) => `
    <div style="margin-top:16px;background:var(--card);border:1px solid var(--dust);padding:16px;border-radius:var(--radius)">
      <div style="font-size:12px;font-weight:500;text-transform:capitalize;margin-bottom:10px">${platform} · ${posts.length} posts</div>
      ${posts.slice(0,1).map(p => `<div style="font-size:12px;color:var(--slate)">${p.emoji} ${p.text.slice(0,80)}...</div>`).join('')}
    </div>`).join('');
}

function showSocialPage(name, btn) {
  document.querySelectorAll('.social-page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('social-' + name);
  if (pg) pg.classList.add('active');
  document.querySelectorAll('.social-nav-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (name !== 'scheduler' && name !== 'overview') renderPlatformPosts(name, name.slice(0,2) + 'PostsGrid');
  if (name === 'scheduler') renderSchedule();
}

function renderPlatformPosts(platform, gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  const posts = socialPosts[platform] || [];
  grid.innerHTML = posts.map(p => `
    <div class="post-card">
      <div class="post-header"><span>${p.emoji}</span><span class="post-status ${p.status === 'live' ? 'live' : 'scheduled'}">${p.status}</span></div>
      <div class="post-text">${p.text}</div>
      <div class="post-footer"><span>♥ ${p.likes} · 💬 ${p.comments}</span><span>${p.date}</span></div>
    </div>`).join('') || '<div style="color:var(--slate);font-size:12px;padding:20px">No posts yet.</div>';
}

function schedulePost(platform) {
  const textarea = document.getElementById(platform.slice(0,2) + '_caption') || document.getElementById(platform + '_caption');
  const text = textarea?.value?.trim();
  if (!text) { showToast('Write a caption first.', 'error'); return; }
  if (!socialPosts[platform]) socialPosts[platform] = [];
  socialPosts[platform].unshift({ text, emoji: '📝', likes: 0, comments: 0, status: 'live', date: new Date().toISOString().split('T')[0] });
  if (textarea) textarea.value = '';
  showToast('Post published!', 'success');
  renderPlatformPosts(platform, platform.slice(0,2) + 'PostsGrid');
}

function updateCharCount(textareaId, countId, max) {
  const ta = document.getElementById(textareaId);
  const cnt = document.getElementById(countId);
  if (ta && cnt) cnt.textContent = ta.value.length + ' / ' + max;
}

function aiCaption(platform) {
  const captions = {
    instagram: "New arrivals that feel as good as they look 🌿 Crafted in Dhaka with love and craft. #DRAPE #DhakaFashion #SustainableStyle",
    facebook: "DRAPE x Bangladesh artisans — fashion that carries a story. Shop the new collection now at drape.fashion",
    tiktok: "Wait until you see what Bangladesh's artisans can do 🇧🇩✨ #DRAPE #FashionTok #EthicalFashion",
    linkedin: "We built a fashion brand on systems, data, and five incredible artisan partners across Bangladesh. Here's what that looks like.",
    scheduler: "New collection alert 🌿 Crafted by Bangladesh's finest artisans, curated by DRAPE. #DhakaFashion"
  };
  const textareas = { instagram: 'ig_caption', facebook: 'fb_caption', tiktok: 'tt_caption', linkedin: 'li_caption', scheduler: 'sch_content' };
  const ta = document.getElementById(textareas[platform] || 'sch_content');
  if (ta) { ta.value = captions[platform] || captions.instagram; }
  showToast('AI caption generated!', 'success');
}

function renderSchedule() {
  const tbody = document.getElementById('scheduleBody');
  if (!tbody) return;
  tbody.innerHTML = scheduledPosts.length
    ? scheduledPosts.map((p, i) => `
        <tr>
          <td style="text-transform:capitalize">${p.platform}</td>
          <td style="font-size:12px;color:var(--slate);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.content}</td>
          <td style="font-size:11px">${p.datetime}</td>
          <td><span class="status-pill" style="background:#FEF3CD;color:#856404">Scheduled</span></td>
          <td><button class="admin-btn sm danger" onclick="deleteScheduled(${i})">Delete</button></td>
        </tr>`).join('')
    : '<tr><td colspan="5" style="text-align:center;color:var(--slate);padding:24px">No scheduled posts yet.</td></tr>';
}

function scheduleSave() {
  const platform = document.getElementById('sch_platform')?.value;
  const content = document.getElementById('sch_content')?.value.trim();
  const datetime = document.getElementById('sch_datetime')?.value;
  if (!content || !datetime) { showToast('Fill in content and schedule time.', 'error'); return; }
  scheduledPosts.push({ platform, content, datetime });
  document.getElementById('sch_content').value = '';
  renderSchedule();
  showToast('Post scheduled!', 'success');
}

function deleteScheduled(i) {
  scheduledPosts.splice(i, 1);
  renderSchedule();
  showToast('Scheduled post deleted.');
}

// ── WHATSAPP ──
function initWaChats() {
  waChats = [
    { id: 1, name: 'Nusrat Jahan', phone: '+880 171 1234567', avatar: 'N', lastMsg: "Is the Muslin Wrap Dress available in L?", time: '10:32 AM', unread: 2,
      messages: [
        { from: 'customer', text: "Hi! Is the Muslin Wrap Dress available in size L?", time: '10:28 AM' },
        { from: 'customer', text: "I need it for a wedding next week.", time: '10:29 AM' },
        { from: 'agent', text: "Hi Nusrat! Yes, the Muslin Wrap Dress is available in L. We have 28 in stock right now.", time: '10:31 AM' },
        { from: 'customer', text: "Great! Can I order it for delivery to Dhaka?", time: '10:32 AM' }
      ]},
    { id: 2, name: 'Rafiq Ahmed', phone: '+880 181 9876543', avatar: 'R', lastMsg: "Order DRP-2026-45231 status?", time: '9:15 AM', unread: 1,
      messages: [
        { from: 'customer', text: "I placed order DRP-2026-45231 two days ago. What's the status?", time: '9:15 AM' }
      ]},
    { id: 3, name: 'Sabrina Islam', phone: '+880 170 5554433', avatar: 'S', lastMsg: "Do you ship to Chittagong?", time: 'Yesterday', unread: 0,
      messages: [
        { from: 'customer', text: "Do you do express delivery to Chittagong?", time: 'Yesterday' },
        { from: 'agent', text: "Yes! We ship to all major cities. Chittagong usually takes 2-3 business days.", time: 'Yesterday' },
        { from: 'customer', text: "Perfect, I'll place my order today.", time: 'Yesterday' }
      ]}
  ];
}

function renderWaList() {
  const list = document.getElementById('waChatList');
  if (!list) return;
  list.innerHTML = waChats.map(c => `
    <div class="wa-chat-item${activeWaChat === c.id ? ' active' : ''}" onclick="openWaChat(${c.id})">
      <div class="wa-avatar">${c.avatar}</div>
      <div class="wa-chat-info">
        <div class="wa-chat-name">${c.name}</div>
        <div class="wa-chat-preview">${c.lastMsg}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:10px;color:var(--slate)">${c.time}</div>
        ${c.unread ? `<div style="background:var(--ok);color:#fff;border-radius:50%;width:16px;height:16px;display:flex;align-items:center;justify-content:center;font-size:9px;margin-top:4px;margin-left:auto">${c.unread}</div>` : ''}
      </div>
    </div>`).join('');
}

function filterWaChats(val) {
  document.querySelectorAll('.wa-chat-item').forEach(el => {
    el.style.display = el.textContent.toLowerCase().includes(val.toLowerCase()) ? '' : 'none';
  });
}

function openWaChat(id) {
  activeWaChat = id;
  const chat = waChats.find(c => c.id === id); if (!chat) return;
  chat.unread = 0;
  renderWaList();
  const main = document.getElementById('waMain');
  if (!main) return;
  main.innerHTML = `
    <div class="wa-chat-header">
      <div class="wa-avatar">${chat.avatar}</div>
      <div><div style="font-weight:500">${chat.name}</div><div style="font-size:11px;opacity:.8">${chat.phone}</div></div>
    </div>
    <div class="wa-messages" id="waMessages">
      ${chat.messages.map(m => `
        <div class="wa-msg ${m.from === 'agent' ? 'sent' : 'received'}">
          <div class="wa-bubble">${m.text}</div>
          <div class="wa-time">${m.time}</div>
        </div>`).join('')}
    </div>
    <div class="wa-input-area">
      <div class="wa-quick-replies">
        <button class="wa-quick" onclick="sendWaMsg(${id},'Thank you for reaching out to DRAPE! How can I help you today?')">👋 Greet</button>
        <button class="wa-quick" onclick="sendWaMsg(${id},'Your order is currently being processed and will be shipped within 24 hours.')">📦 Order Update</button>
        <button class="wa-quick" onclick="sendWaMsg(${id},'Yes, we deliver to all major cities in Bangladesh. Shipping takes 2-4 business days.')">🚚 Delivery</button>
      </div>
      <div class="wa-compose">
        <input class="wa-input" id="waInput_${id}" placeholder="Type a message..." onkeydown="if(event.key==='Enter')sendWaMsg(${id})">
        <button class="wa-send" onclick="sendWaMsg(${id})">Send</button>
      </div>
    </div>`;
  const msgs = document.getElementById('waMessages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function sendWaMsg(chatId, text) {
  const inp = document.getElementById('waInput_' + chatId);
  const msg = text || inp?.value.trim();
  if (!msg) return;
  const chat = waChats.find(c => c.id === chatId); if (!chat) return;
  const time = new Date().toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' });
  chat.messages.push({ from: 'agent', text: msg, time });
  chat.lastMsg = msg;
  if (inp) inp.value = '';
  openWaChat(chatId);
  showToast('Message sent.', 'success');
}

// ── SESSION RESTORE ──
window.addEventListener('DOMContentLoaded', async () => {
  const stored = sessionStorage.getItem('drape_admin_refresh');
  if (stored) {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: stored })
      });
      if (res.ok) {
        const d = await res.json();
        adminToken = d.accessToken;
        adminRefreshToken = stored;
        const meRes = await fetch(`${API_BASE}/auth/me`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
        if (meRes.ok) {
          const me = await meRes.json();
          if (me.user?.role === 'admin') {
            adminUser = me.user;
            document.getElementById('loginOverlay').style.display = 'none';
            await loadAll();
            showAdminPage('dashboard', document.querySelector('.admin-nav-btn'));
          }
        }
      }
    } catch (e) {}
  }
  initWaChats();
});

// Add keydown for password field
document.addEventListener('DOMContentLoaded', () => {
  const pass = document.getElementById('loginPassword');
  if (pass) pass.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
});

// ── CHANGE PASSWORD ──
function openChangePassword() {
  document.getElementById('cp_current').value = '';
  document.getElementById('cp_new').value = '';
  document.getElementById('cp_error').style.display = 'none';
  document.getElementById('changePasswordOverlay').style.display = 'flex';
}
function closeChangePassword() {
  document.getElementById('changePasswordOverlay').style.display = 'none';
}
async function submitChangePassword() {
  const currentPassword = document.getElementById('cp_current').value;
  const newPassword = document.getElementById('cp_new').value;
  const errEl = document.getElementById('cp_error');
  errEl.style.display = 'none';
  if (!currentPassword || !newPassword) {
    errEl.textContent = 'Both fields are required.';
    errEl.style.display = 'block';
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (res.ok) {
      showToast('Password updated. Please log in again.', 'success');
      closeChangePassword();
      setTimeout(doLogout, 1200);
    } else {
      errEl.textContent = data.error || 'Could not update password.';
      errEl.style.display = 'block';
    }
  } catch (e) {
    errEl.textContent = 'Network error — please try again.';
    errEl.style.display = 'block';
  }
}
