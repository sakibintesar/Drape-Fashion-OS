// @ts-check
// ── AUTH.JS ──
// Customer authentication: login, register, logout, session management,
// auth UI updates, and the account page renderer.

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
      // Refresh checkout page login banner if visible
      const coBanner = document.getElementById('checkoutLoginBanner');
      if (coBanner) coBanner.style.display = 'none';
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
  if (password.length < 8) { errorEl.textContent = 'Password must be at least 8 characters'; errorEl.style.display = ''; return; }
  if (!/[A-Z]/.test(password)) { errorEl.textContent = 'Password must contain an uppercase letter'; errorEl.style.display = ''; return; }
  if (!/[0-9]/.test(password)) { errorEl.textContent = 'Password must contain a number'; errorEl.style.display = ''; return; }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) { errorEl.textContent = 'Password must contain a special character'; errorEl.style.display = ''; return; }
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
      // Refresh checkout page login banner if visible
      const coBanner = document.getElementById('checkoutLoginBanner');
      if (coBanner) coBanner.style.display = 'none';
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
  container.innerHTML = '<div style="text-align:center;padding:56px;color:var(--slate)">Loading account...</div>';
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

// ── EXPORT TO WINDOW ──
window.doCustomerLogin = doCustomerLogin;
window.doCustomerRegister = doCustomerRegister;
window.doCustomerLogout = doCustomerLogout;
window.checkCustomerSession = checkCustomerSession;
window.updateCustomerAuthUI = updateCustomerAuthUI;
window.showCustomerAuth = showCustomerAuth;
window.closeCustomerAuth = closeCustomerAuth;
window.closeCustomerAuthDirect = closeCustomerAuthDirect;
window.showLoginForm = showLoginForm;
window.showRegisterForm = showRegisterForm;
window.renderAccountPage = renderAccountPage;
