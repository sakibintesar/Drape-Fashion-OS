// @ts-check
// ── APP.JS ──
// Main entry point. Loads LAST. Contains DOMContentLoaded init,
// page navigation, product rendering, shop filtering, and the hero counter.

// ─── INIT ───
window.addEventListener('DOMContentLoaded', async () => {
  loadState();
  await checkCustomerSession();
  await loadProductsFromAPI();
  renderAll();

  // Initialize premium landing page
  if (typeof initLanding === 'function') {
    try {
      console.log('[DRAPE] initLanding called with', products?.length ?? 0, 'products');
      initLanding(products);
      const heroFull = document.querySelector('#page-home .hero-full');
      const heroOld = document.querySelector('#page-home .hero');
      console.log('[DRAPE] After initLanding — hero-full:', !!heroFull, 'old .hero:', !!heroOld);
    } catch (err) {
      console.error('[DRAPE] initLanding FAILED:', err);
    }
  } else {
    console.warn('[DRAPE] initLanding not found — landing.js may not have loaded');
  }

  // Show newsletter popup after 30 seconds (if not dismissed)
  setTimeout(() => {
    if (typeof showNewsletterPopup === 'function') showNewsletterPopup();
  }, 30000);
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
  if (n === 'whatsapp') { /* admin-only — not available on customer frontend */ }
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

// ── EXPORT TO WINDOW ──
window.showPage = showPage;
window.showBrand = showBrand;
window.showCat = showCat;
window.showSocialPage = showSocialPage;
window.renderAll = renderAll;
window.renderFeatured = renderFeatured;
window.renderShopGrid = renderShopGrid;
window.filterP = filterP;
window.renderCatalog = renderCatalog;
