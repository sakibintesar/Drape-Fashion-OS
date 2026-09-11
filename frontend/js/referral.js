// @ts-check
// ── REFERRAL.JS ──
// Referral system: generate codes, share via WhatsApp, track referrals

// ─── GET REFERRAL CODE ───
async function getReferralCode(userId, email) {
  try {
    const response = await fetch(`${API_BASE}/referrals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, email }),
    });
    if (!response.ok) throw new Error('Failed to get referral code');
    return await response.json();
  } catch (e) {
    console.error('Referral code error:', e);
    return null;
  }
}

// ─── SHARE REFERRAL ───
function shareReferral(code, platform) {
  const link = `${window.location.origin}?ref=${code}`;
  const text = `Join DRAPE Fashion OS! Use my referral code ${code} for exclusive access 👗\n${link}`;

  switch (platform) {
    case 'whatsapp':
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      break;
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, '_blank');
      break;
    case 'copy':
      navigator.clipboard.writeText(text).then(() => {
        showToast('Referral link copied!');
      }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Referral link copied!');
      });
      break;
  }
}

// ─── APPLY REFERRAL FROM URL ───
function applyReferralFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const refCode = params.get('ref');
  if (refCode) {
    sessionStorage.setItem('drape_referral_code', refCode);
    console.log('[referral] Code stored:', refCode);
  }
  return refCode;
}

// ─── GET STORED REFERRAL ───
function getStoredReferral() {
  return sessionStorage.getItem('drape_referral_code');
}

// ─── RENDER REFERRAL SECTION ───
function renderReferralSection(userId, email) {
  return `
    <div class="referral-section" id="referral-section">
      <div class="referral-card">
        <h3>🎉 Refer Friends, Earn Rewards!</h3>
        <p>Share your unique code and earn discounts when friends join DRAPE.</p>
        <div class="referral-code-box">
          <span id="referral-code-display">Loading...</span>
          <button onclick="copyReferralCode()" class="btn-copy-code">📋 Copy</button>
        </div>
        <div class="referral-share-buttons">
          <button onclick="shareReferralCode('whatsapp')" class="share-btn whatsapp">💬 Share on WhatsApp</button>
          <button onclick="shareReferralCode('facebook')" class="share-btn facebook">👥 Share on Facebook</button>
        </div>
        <div class="referral-stats" id="referral-stats">
          <span>Friends referred: <strong id="referral-count">0</strong></span>
        </div>
      </div>
    </div>
  `;
}

// ─── COPY REFERRAL CODE ───
function copyReferralCode() {
  const code = document.getElementById('referral-code-display')?.textContent;
  if (code && code !== 'Loading...') {
    navigator.clipboard.writeText(code).then(() => {
      showToast('Referral code copied!');
    });
  }
}

// ─── SHARE REFERRAL CODE ───
function shareReferralCode(platform) {
  const code = document.getElementById('referral-code-display')?.textContent;
  if (code && code !== 'Loading...') {
    shareReferral(code, platform);
  }
}

// ─── INIT REFERRAL SECTION ───
async function initReferralSection(userId, email) {
  const container = document.getElementById('referral-section');
  if (!container) return;

  const data = await getReferralCode(userId, email);
  if (data) {
    const codeEl = document.getElementById('referral-code-display');
    const countEl = document.getElementById('referral-count');
    if (codeEl) codeEl.textContent = data.code;
    if (countEl) countEl.textContent = data.total_referrals || 0;
  }
}

// ─── EXPORT ───
window.getReferralCode = getReferralCode;
window.shareReferral = shareReferral;
window.applyReferralFromUrl = applyReferralFromUrl;
window.getStoredReferral = getStoredReferral;
window.renderReferralSection = renderReferralSection;
window.initReferralSection = initReferralSection;
window.copyReferralCode = copyReferralCode;
window.shareReferralCode = shareReferralCode;
