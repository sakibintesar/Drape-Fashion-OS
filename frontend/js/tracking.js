// @ts-check
// ── TRACKING.JS ──
// Order tracking: looks up an order by ID and renders a timeline view.

async function trackOrder() {
  const input = document.getElementById('trackInput');
  if (!input) return;
  const id = input.value.trim().toUpperCase();
  const result = document.getElementById('trackResult');
  if (!result) return;
  if (!id) { showToast('Enter an order ID.', 'error'); return; }
  result.innerHTML = '<div style="text-align:center;padding:40px;color:var(--slate)">Looking up order...</div>';
  result.classList.add('open');
  const data = await trackOrderAPI(id);
  if (!data || !data.order) {
    result.innerHTML = `<div style="text-align:center;padding:40px;color:var(--slate)"><div style="font-size:48px;margin-bottom:16px">🔍</div><div style="font-size:14px">No order found with ID <strong>${escapeHtml(id)}</strong></div><div style="font-size:12px;margin-top:8px">Check your confirmation email or try a recent order ID</div></div>`;
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
        <div class="track-card-id">${escapeHtml(order.id)}</div>
        <div class="track-status-pill" style="${statusColors[order.status] || ''}">${escapeHtml(order.status.toUpperCase())}</div>
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
        ${order.items.map(i => `<div class="track-item-row"><div class="track-item-emoji">${i.emoji}</div><div><div class="track-item-name">${escapeHtml(i.name)}</div><div class="track-item-meta">${escapeHtml(i.color)} · Size ${escapeHtml(i.size)} · Qty ${i.qty}</div></div></div>`).join('')}
      </div>
      <div style="border-top:1px solid var(--dust);padding-top:16px;margin-top:16px;display:flex;justify-content:space-between;font-size:12px">
        <span style="color:var(--slate)">Total: <strong class="mono">৳${order.total.toLocaleString()}</strong></span>
        <span style="color:var(--slate)">Payment: <strong>CARD</strong></span>
      </div>
    </div>`;
  result.classList.add('open');
}

// ── EXPORT TO WINDOW ──
window.trackOrder = trackOrder;
