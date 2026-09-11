// @ts-check
// ── CHECKOUT.JS ──
// Checkout page rendering, payment method selection, form validation,
// and the simulated payment gateway (Pgw) flow.

function renderCoSummary() {
  // Show login banner if not authenticated
  const loginBanner = document.getElementById('checkoutLoginBanner');
  if (loginBanner) loginBanner.style.display = customerUser ? 'none' : 'block';
  const csi = document.getElementById('coSummaryItems');
  if (csi) csi.innerHTML = cart.map(i => `<div style="display:flex;gap:12px;margin-bottom:16px"><div style="width:56px;height:70px;background:var(--dust);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${i.prod.emoji}</div><div><div style="font-size:12px;font-weight:500">${escapeHtml(i.prod.name)}</div><div style="font-size:10px;color:var(--slate)">${escapeHtml(i.color)} · ${escapeHtml(i.size)} · Qty ${i.qty}</div><div style="font-family:'DM Mono',monospace;font-size:11px;margin-top:2px">৳${(i.prod.price * i.qty).toLocaleString()}</div></div></div>`).join('');
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
      // FIX: API returns 'issues' not 'errors'
      const errors = validation && validation.issues ? validation.issues.map(e => (e.name || e.id) + ': ' + e.reason).join('\n') : 'Cart validation failed. Please try again.';
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
      // FIX: API returns 'validated' not 'items'
      items: validation.validated,
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

// ── EXPORT TO WINDOW ──
window.renderCoSummary = renderCoSummary;
window.selectPay = selectPay;
window.fmtCard = fmtCard;
window.fmtExp = fmtExp;
window.validateCo = validateCo;
window.openPayGateway = openPayGateway;
window.closePgw = closePgw;
window.selPgwMethod = selPgwMethod;
window.pgwFmtCard = pgwFmtCard;
window.pgwFmtExp = pgwFmtExp;
window.pgwOtpNext = pgwOtpNext;
window.pgwPay = pgwPay;
window.runPgwProcessing = runPgwProcessing;
window.finalizePgwOrder = finalizePgwOrder;
window.pgwFinish = pgwFinish;
