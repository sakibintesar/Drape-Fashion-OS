// @ts-check
// ── SHARE.JS ──
// Social sharing: WhatsApp, Facebook, copy link, share count tracking

// ─── SHARE PRODUCT ───
function shareProduct(product, platform) {
  const url = `${window.location.origin}/?product=${product.id}`;
  const text = `Check out "${product.name}" on DRAPE — ৳${product.price}\n${url}`;
  const title = product.name;

  switch (platform) {
    case 'whatsapp':
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      break;
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      break;
    case 'copy':
      navigator.clipboard.writeText(text).then(() => {
        showToast('Link copied to clipboard!');
      }).catch(() => {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Link copied to clipboard!');
      });
      break;
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
      break;
  }

  // Track share count
  trackShare(product.id);
}

// ─── TRACK SHARE ───
async function trackShare(productId) {
  try {
    await fetch(`${API_BASE}/products/${productId}/share`, { method: 'POST' });
  } catch (e) {
    // Silent fail — share tracking is non-critical
  }
}

// ─── RENDER SHARE BUTTONS ───
function renderShareButtons(productId, productName, productPrice) {
  const product = { id: productId, name: productName, price: productPrice };
  return `
    <div class="share-buttons">
      <button class="share-btn whatsapp" onclick='shareProduct(${JSON.stringify(product).replace(/'/g, "&#39;")}, "whatsapp")' title="Share on WhatsApp">
        💬 WhatsApp
      </button>
      <button class="share-btn facebook" onclick='shareProduct(${JSON.stringify(product).replace(/'/g, "&#39;")}, "facebook")' title="Share on Facebook">
        👥 Facebook
      </button>
      <button class="share-btn copy" onclick='shareProduct(${JSON.stringify(product).replace(/'/g, "&#39;")}, "copy")' title="Copy link">
        📋 Copy Link
      </button>
    </div>
  `;
}

// ─── EXPORT ───
window.shareProduct = shareProduct;
window.renderShareButtons = renderShareButtons;
