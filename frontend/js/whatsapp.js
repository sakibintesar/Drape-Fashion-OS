// @ts-check
// ── WHATSAPP.JS ──
// WhatsApp Business chat interface: chat list, individual chat view,
// quick replies, message sending, broadcast messaging, and templates.

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
    <div class="wa-chat-item ${activeWaChat === c.id ? 'active' : ''}" onclick="openWaChat('${escapeHtml(c.id)}')">
      <div class="wa-avatar" style="background:${c.id === 'broadcast' ? '#F7941D' : '#25D366'}">${c.avatar}</div>
      <div class="wa-chat-info">
        <div class="wa-chat-name">${escapeHtml(c.name)}</div>
        <div class="wa-chat-preview">${escapeHtml(c.lastMsg)}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
        <div class="wa-chat-time">${escapeHtml(c.time)}</div>
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

// ── EXPORT TO WINDOW ──
window.initWaChats = initWaChats;
window.renderWaChatList = renderWaChatList;
window.filterWaChats = filterWaChats;
window.openWaChat = openWaChat;
window.waQuickReply = waQuickReply;
window.sendWaMsg = sendWaMsg;
window.renderWaBroadcast = renderWaBroadcast;
window.waLoadTemplate = waLoadTemplate;
window.sendWaBroadcast = sendWaBroadcast;
window.renderWaTemplates = renderWaTemplates;
window.waUseTemplate = waUseTemplate;
window.addWaNotification = addWaNotification;
window.showWaTab = showWaTab;
