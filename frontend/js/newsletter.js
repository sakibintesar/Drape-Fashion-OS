// @ts-check
// ── NEWSLETTER.JS ──
// Email capture popup and newsletter subscription

let newsletterDismissed = false;

// ─── SHOW NEWSLETTER POPUP ───
function showNewsletterPopup() {
  if (newsletterDismissed) return;
  if (localStorage.getItem('drape_newsletter_dismissed')) return;

  const popup = document.createElement('div');
  popup.className = 'newsletter-popup';
  popup.id = 'newsletterPopup';
  popup.innerHTML = `
    <div class="newsletter-content">
      <button class="newsletter-close" onclick="dismissNewsletter()">×</button>
      <div class="newsletter-icon">✉️</div>
      <h3 class="newsletter-title">Join the DRAPE Community</h3>
      <p class="newsletter-desc">Get early access to new collections, exclusive offers, and style updates. No spam, ever.</p>
      <div class="newsletter-form">
        <input type="email" class="newsletter-input" id="newsletterEmail" placeholder="your@email.com">
        <button class="newsletter-btn" onclick="subscribeNewsletter()">Subscribe</button>
      </div>
      <div class="newsletter-success" id="newsletterSuccess" style="display:none">
        <span>✓</span> Welcome to DRAPE! Check your inbox for a welcome message.
      </div>
      <div class="newsletter-error" id="newsletterError" style="display:none"></div>
    </div>
  `;
  document.body.appendChild(popup);

  // Animate in
  setTimeout(() => popup.classList.add('show'), 100);

  // Auto-show after 30 seconds
  // (already called from app.js after delay)
}

// ─── DISMISS NEWSLETTER ───
function dismissNewsletter() {
  newsletterDismissed = true;
  localStorage.setItem('drape_newsletter_dismissed', '1');
  const popup = document.getElementById('newsletterPopup');
  if (popup) {
    popup.classList.remove('show');
    setTimeout(() => popup.remove(), 300);
  }
}

// ─── SUBSCRIBE ───
async function subscribeNewsletter() {
  const emailInput = document.getElementById('newsletterEmail');
  const successEl = document.getElementById('newsletterSuccess');
  const errorEl = document.getElementById('newsletterError');
  const email = emailInput?.value?.trim();

  if (!email || !email.includes('@')) {
    errorEl.textContent = 'Please enter a valid email address.';
    errorEl.style.display = 'block';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (res.ok) {
      successEl.style.display = 'block';
      errorEl.style.display = 'none';
      emailInput.parentElement.style.display = 'none';
      localStorage.setItem('drape_newsletter_dismissed', '1');
      newsletterDismissed = true;
    } else {
      const data = await res.json();
      errorEl.textContent = data.error?.message || 'Something went wrong. Please try again.';
      errorEl.style.display = 'block';
    }
  } catch (e) {
    errorEl.textContent = 'Network error. Please try again.';
    errorEl.style.display = 'block';
  }
}

// ─── EXPORT ───
window.showNewsletterPopup = showNewsletterPopup;
window.dismissNewsletter = dismissNewsletter;
window.subscribeNewsletter = subscribeNewsletter;
