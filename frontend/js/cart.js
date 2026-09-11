// @ts-check
// ── CART.JS ──
// Product card rendering (pCard, subCard), product modal (openModal and
// its helpers), shopping cart operations, and checkout navigation.

function pCard(p) {
  const bt = p.stock === 0 ? 'Sold Out' : (p.origPrice ? 'Sale' : (p.badge || ''));
  const bc = p.stock === 0 ? 'badge-out' : (p.origPrice ? 'badge-sale' : '');
  return `<div class="product-card" onclick="openModal(${p.id})">
    ${bt ? `<div class="product-badge ${bc}">${escapeHtml(bt)}</div>` : ''}
    <div class="product-img">${p.image_url ? `<img src="${escapeHtml(p.image_url)}" style="width:100%;height:100%;object-fit:cover" alt="${escapeHtml(p.name)}">` : p.emoji}</div>
    <div class="product-overlay"><button class="overlay-btn">Quick View</button></div>
    <div class="product-info">
      <div class="product-category">${escapeHtml(p.category)}</div>
      <div class="product-name">${escapeHtml(p.name)}</div>
      <div class="product-vendor">${escapeHtml(p.vendor)}</div>
      <div class="product-price-row">
        <div class="product-price mono">৳${p.price.toLocaleString()}</div>
        ${p.origPrice ? `<div class="product-orig mono">৳${p.origPrice.toLocaleString()}</div>` : ''}
      </div>
      <div class="variant-dots">${p.colors.slice(0, 5).map(c => `<div class="variant-dot" style="background:${c.hex}" title="${escapeHtml(c.name)}"></div>`).join('')}</div>
    </div>
  </div>`;
}

function subCard(p) {
  return `<div class="sub-card" onclick="openModal(${p.id})">
    <div class="sub-card-img">${p.image_url ? `<img src="${escapeHtml(p.image_url)}" style="width:100%;height:100%;object-fit:cover" alt="${escapeHtml(p.name)}">` : p.emoji}</div>
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
  if (mi) mi.innerHTML = selProd.image_url ? `<img src="${escapeHtml(selProd.image_url)}" style="max-width:100%;max-height:320px;object-fit:contain;border-radius:8px" alt="${escapeHtml(selProd.name)}">` : `<span style="font-size:88px">${selProd.emoji}</span>`;
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
  if (mt) mt.innerHTML = selProd.subs.map((s, i) => `<div class="modal-thumb ${i === 0 ? 'active' : ''}" onclick="selThumb(this,${s.price})" title="${escapeHtml(s.name)}"><span>${s.emoji}</span><div class="modal-thumb-label">${escapeHtml(s.name)}</div></div>`).join('');
  const cs = document.getElementById('colorSwatches');
  if (cs) cs.innerHTML = selProd.colors.map(c => `<div class="swatch" style="background:${c.hex}" onclick="selColorFn('${escapeHtml(c.name)}','${c.hex}',this)" title="${escapeHtml(c.name)}"></div>`).join('');
  const cl = document.getElementById('colorLabel');
  if (cl) cl.textContent = '';
  const so = document.getElementById('sizeOptions');
  if (so) so.innerHTML = selProd.sizes.map(s => `<button class="size-btn" onclick="selSizeFn('${escapeHtml(s)}',this)">${escapeHtml(s)}</button>`).join('');
  const sl = document.getElementById('sizeLabel');
  if (sl) sl.textContent = '';
  const st = document.getElementById('specTable');
  if (st) st.innerHTML = `<tr><td>Material</td><td>${escapeHtml(selProd.material) || '—'}</td></tr><tr><td>Care</td><td>${escapeHtml(selProd.care) || '—'}</td></tr><tr><td>Origin</td><td>${escapeHtml(selProd.origin) || '—'}</td></tr><tr><td>Variants</td><td>${selProd.subs.length} cuts · ${selProd.colors.length} colors</td></tr>`;
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
  if (mi) mi.innerHTML = (selProd.image_url ? `<img src="${escapeHtml(selProd.image_url)}" style="max-width:100%;max-height:320px;object-fit:contain;border-radius:8px" alt="${escapeHtml(selProd.name)}">` : `<span style="font-size:88px">${selProd.emoji}</span>`) + `<div style="width:28px;height:28px;border-radius:50%;background:${hex};border:2px solid rgba(0,0,0,.1);margin-top:8px"></div>`;
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
  if (con) con.innerHTML = cart.map(i => `<div class="cart-item"><div class="cart-item-img">${i.prod.image_url ? `<img src="${escapeHtml(i.prod.image_url)}" style="width:100%;height:100%;object-fit:cover;border-radius:4px" alt="${escapeHtml(i.prod.name)}">` : i.prod.emoji}</div><div class="cart-item-details"><div class="cart-item-name">${escapeHtml(i.prod.name)}</div><div class="cart-item-meta">${escapeHtml(i.color)} · ${escapeHtml(i.size)} · Qty ${i.qty}</div><div class="cart-item-price mono">৳${(i.prod.price * i.qty).toLocaleString()}</div></div><button class="cart-item-remove" onclick="removeFromCart('${escapeHtml(i.key)}')">×</button></div>`).join('');
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
  // Require login before entering checkout
  if (!customerUser) {
    showToast('Please log in to continue to checkout.', 'error');
    showCustomerAuth();
    return;
  }
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

// ── EXPORT TO WINDOW ──
window.pCard = pCard;
window.subCard = subCard;
window.openModal = openModal;
window.selThumb = selThumb;
window.selColorFn = selColorFn;
window.selSizeFn = selSizeFn;
window.changeQty = changeQty;
window.closeMBg = closeMBg;
window.closeMDirect = closeMDirect;
window.addToCartModal = addToCartModal;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartUI = updateCartUI;
window.toggleCart = toggleCart;
window.goCheckout = goCheckout;
