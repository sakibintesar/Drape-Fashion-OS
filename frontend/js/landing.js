// @ts-check
// ── LANDING.JS ──
// Premium landing page section renderers for DRAPE Fashion OS.
// Each function returns an HTML string for insertion into the DOM.

// ─── IMMERSIVE HERO ───
function renderLandingHero() {
  return `
  <section class="hero-full">
    <div class="hero-full-bg">
      <div class="hero-full-gradient" style="--mx: 30%; --my: 50%;"></div>
      <div class="hero-full-grain"></div>
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>
      <div class="hero-orb hero-orb-3"></div>
    </div>
    <div class="hero-full-content">
      <div class="hero-full-eyebrow reveal">
        <span class="eyebrow-line"></span>
        <span>Dhaka · SS 2026</span>
        <span class="eyebrow-line"></span>
      </div>
      <h1 class="hero-full-title">
        <span class="title-line" data-line="1">Cloth that</span>
        <span class="title-line" data-line="2">tells your</span>
        <span class="title-line title-accent" data-line="3"><em>story.</em></span>
      </h1>
      <p class="hero-full-sub reveal reveal-delay-2">
        Curated from five artisan brands in Dhaka.<br>
        Every piece made to outlast the season.
      </p>
      <div class="hero-full-cta reveal reveal-delay-3">
        <button class="btn btn-lg btn-primary-dark" onclick="showPage('shop')">
          Shop SS/26 Collection
          <span class="btn-arrow">→</span>
        </button>
        <button class="btn btn-lg btn-ghost-light" onclick="smoothScrollTo('#section-editorial')">
          Meet Our Artisans
        </button>
      </div>
      <div class="hero-trust-badges reveal reveal-delay-4">
        <span class="hero-trust-item">✓ Free Shipping</span>
        <span class="hero-trust-divider">·</span>
        <span class="hero-trust-item">✓ Easy Returns</span>
        <span class="hero-trust-divider">·</span>
        <span class="hero-trust-item">✓ COD Available</span>
      </div>
      <div class="hero-full-scroll-hint reveal reveal-delay-4">
        <div class="scroll-line"></div>
        <span>Scroll to discover</span>
      </div>
    </div>
    <div class="hero-particles" aria-hidden="true">
      <div class="hero-particle" style="--i: 0;"></div>
      <div class="hero-particle" style="--i: 1;"></div>
      <div class="hero-particle" style="--i: 2;"></div>
      <div class="hero-particle" style="--i: 3;"></div>
      <div class="hero-particle" style="--i: 4;"></div>
      <div class="hero-particle" style="--i: 5;"></div>
      <div class="hero-particle" style="--i: 6;"></div>
      <div class="hero-particle" style="--i: 7;"></div>
      <div class="hero-particle" style="--i: 8;"></div>
      <div class="hero-particle" style="--i: 9;"></div>
      <div class="hero-particle" style="--i: 10;"></div>
      <div class="hero-particle" style="--i: 11;"></div>
    </div>
    <div class="hero-full-side">
      <div class="hero-side-tag cursor-layer" data-depth="8">SS/26</div>
      <div class="hero-side-stat cursor-layer" data-depth="12">
        <div class="hero-side-num" data-count="25" data-suffix="+">0</div>
        <div class="hero-side-label">Curated Pieces</div>
      </div>
    </div>
  </section>`;
}

// ─── EDITORIAL GRID ───
async function renderEditorialGrid() {
  // Brand display config — maps vendor names to card styles
  const brandConfig = {
    'LOOM & GRACE': { gradient: 'linear-gradient(135deg,#2d1f14,#1a1210)', cat: 'Dresses & Occasion', tag: 'Heritage muslin · Handwoven', catId: 'b_loom' },
    'THREAD REPUBLIC': { gradient: 'linear-gradient(135deg,#1a2a1f,#0d1a12)', cat: 'Tops & Knitwear', tag: 'Recycled cotton · Ethical', catId: 'b_thread' },
    'NAKSHI STUDIO': { gradient: 'linear-gradient(135deg,#2a1a2a,#1a0d1a)', cat: 'Ethnic & Embroidered', tag: '220+ artisans · Fair-trade', catId: 'b_nakshi' },
    'ZEPHYR CUTS': { gradient: 'linear-gradient(135deg,#1a1a2a,#0d0d1a)', cat: 'Tailored Bottoms', tag: '14 QC checks · Precision', catId: 'b_zephyr' },
    'ADORN CO.': { gradient: 'linear-gradient(135deg,#2a2a1a,#1a1a0d)', cat: 'Accessories & Jewellery', tag: 'Full-grain leather · 5yr guarantee', catId: 'b_adorn' }
  };

  // Fallback hardcoded data
  const fallback = [
    { vendor: 'LOOM & GRACE', product_count: 5, total_sold: 120, categories: 'Dresses' },
    { vendor: 'THREAD REPUBLIC', product_count: 3, total_sold: 85, categories: 'Tops,Outerwear' },
    { vendor: 'NAKSHI STUDIO', product_count: 4, total_sold: 200, categories: 'Tops,Outerwear,Accessories' },
    { vendor: 'ZEPHYR CUTS', product_count: 3, total_sold: 60, categories: 'Bottoms,Outerwear' },
    { vendor: 'ADORN CO.', product_count: 3, total_sold: 150, categories: 'Accessories' }
  ];

  let brands = fallback;
  try {
    const res = await fetch('/api/analytics/brands');
    if (res.ok) {
      const data = await res.json();
      if (data.brands?.length > 0) brands = data.brands;
    }
  } catch (e) {
    console.log('[DRAPE] Brands API not available, using defaults');
  }

  const cards = brands.slice(0, 5).map((b, i) => {
    const cfg = brandConfig[b.vendor] || { gradient: 'linear-gradient(135deg,#2a2a2a,#1a1a1a)', cat: b.categories?.split(',')[0] || 'Fashion', tag: `${b.product_count} pieces`, catId: 'shop' };
    const sold = b.total_sold || 0;
    const tagline = sold > 0 ? `${b.product_count} pieces · ${sold}+ sold` : `${b.product_count} pieces · ${cfg.tag}`;
    return `
      <div class="editorial-card ${i === 0 ? 'editorial-tall' : ''} reveal reveal-delay-${i + 1}" onclick="showPage('catalog');setTimeout(()=>showCat('${cfg.catId}',null),100)">
        <div class="editorial-card-bg" style="background:${cfg.gradient}"></div>
        <div class="editorial-card-content">
          <div class="editorial-card-cat">${cfg.cat}</div>
          <div class="editorial-card-name display">${b.vendor.charAt(0) + b.vendor.slice(1).toLowerCase()}</div>
          <div class="editorial-card-meta">${tagline}</div>
        </div>
        <div class="editorial-card-arrow">→</div>
      </div>`;
  }).join('');

  return `
  <section class="section-editorial" id="section-editorial">
    <div class="editorial-header reveal">
      <span class="section-eyebrow">Discover</span>
      <h2 class="editorial-title display">Five Brands.<br>One Vision.</h2>
      <p class="editorial-sub">Each a master of their craft. Sourced directly, quality-checked, fulfilled under one roof.</p>
    </div>
    <div class="editorial-grid">
      ${cards}
    </div>
  </section>`;
}

// ─── BRAND STORY (SPLIT SCREEN) ───
async function renderBrandStory() {
  // Brand story descriptions
  const brandStories = {
    'LOOM & GRACE': { emoji: '🌿', desc: 'Every Loom & Grace garment starts life in a handloom workshop in Old Dhaka. The weaving process for a single dress takes 3–6 days. Their dye house uses only plant-based mordants. Carbon-neutral since 2022.', stats: [{ num: '3–6', label: 'Days per garment' }, { num: '100%', label: 'Plant-based dyes' }, { num: '2022', label: 'Carbon neutral' }], catId: 'b_loom' },
    'NAKSHI STUDIO': { emoji: '🎨', desc: 'Nakshi Studio employs over 220 artisans across rural Bangladesh, preserving centuries-old kantha embroidery traditions. Every stitch tells a story of heritage passed down through generations.', stats: [{ num: '220+', label: 'Skilled artisans' }, { num: '500yr', label: 'Kantha tradition' }, { num: '100%', label: 'Fair-trade' }], catId: 'b_nakshi' },
    'THREAD REPUBLIC': { emoji: '✂️', desc: 'Thread Republic transforms recycled cotton and deadstock fabric into modern essentials. They employ 140 women from underserved communities, providing fair wages and skills training.', stats: [{ num: '140', label: 'Women employed' }, { num: '80%', label: 'Recycled materials' }, { num: 'Zero', label: 'Waste to landfill' }], catId: 'b_thread' },
    'ZEPHYR CUTS': { emoji: '✂️', desc: 'Zephyr Cuts brings precision tailoring to Dhaka\'s fashion scene. With 14 quality checkpoints per garment and Italian canvas interfacing, every piece is built to last.', stats: [{ num: '14', label: 'QC checkpoints' }, { num: 'Italian', label: 'Canvas interfacing' }, { num: '1yr', label: 'Wear guarantee' }], catId: 'b_zephyr' },
    'ADORN CO.': { emoji: '💎', desc: 'Adorn Co. crafts accessories from full-grain leather and recycled brass. Every bag and jewel is hand-finished in their Dhaka workshop, with a 5-year guarantee on all hardware.', stats: [{ num: '5yr', label: 'Hardware guarantee' }, { num: 'Full-grain', label: 'Leather only' }, { num: '100%', label: 'Recycled brass' }], catId: 'b_adorn' }
  };

  // Try to get top-selling brand from API
  let story = brandStories['LOOM & GRACE']; // fallback
  try {
    const res = await fetch('/api/analytics/brands');
    if (res.ok) {
      const data = await res.json();
      if (data.brands?.length > 0) {
        const top = data.brands[0];
        story = brandStories[top.vendor] || story;
      }
    }
  } catch (e) {
    console.log('[DRAPE] Brands API not available for brand story');
  }

  return `
  <section class="section-split">
    <div class="split-left reveal">
      <div class="split-visual">
        <div class="split-visual-inner">
          <div class="split-icon-large">${story.emoji}</div>
          <div class="split-tag">Featured Brand</div>
        </div>
      </div>
    </div>
    <div class="split-right">
      <div class="split-content">
        <span class="section-eyebrow reveal">The Craft</span>
        <h2 class="split-title display reveal reveal-delay-1">From Dhaka's<br>Finest Workshops</h2>
        <p class="split-text reveal reveal-delay-2">${story.desc}</p>
        <div class="split-stats reveal reveal-delay-3">
          ${story.stats.map(s => `
          <div class="split-stat">
            <div class="split-stat-num display">${s.num}</div>
            <div class="split-stat-label">${s.label}</div>
          </div>`).join('')}
        </div>
        <button class="btn-primary reveal reveal-delay-4" onclick="showPage('catalog');setTimeout(()=>showCat('${story.catId}',null),100)">
          Shop ${story.stats[0] ? story.stats[0].label : 'Brand'} →
        </button>
      </div>
    </div>
  </section>`;
}

// ─── HORIZONTAL SCROLL GALLERY ───
function renderHorizontalGallery() {
  return `
  <section class="section-hscroll">
    <div class="hscroll-header">
      <div class="reveal">
        <span class="section-eyebrow">Curated Picks</span>
        <h2 class="hscroll-title display">Editor's Selection</h2>
      </div>
      <div class="hscroll-nav reveal reveal-delay-1">
        <button class="hscroll-btn" onclick="scrollGallery(-1)">←</button>
        <button class="hscroll-btn" onclick="scrollGallery(1)">→</button>
      </div>
    </div>
    <div class="hscroll-container">
      <div class="hscroll-track" id="hscrollTrack">
        <!-- Populated dynamically by landing.js -->
        <div class="hscroll-placeholder">Loading curated picks...</div>
      </div>
    </div>
  </section>`;
}

function renderHscrollItem(product) {
  return `
  <div class="hscroll-item" onclick="openModal(${product.id})">
    <div class="hscroll-item-img">
      ${product.image_url
        ? `<img src="${escapeHtml(product.image_url)}" loading="lazy" alt="${escapeHtml(product.name)}">`
        : `<span class="hscroll-emoji">${product.emoji || '👗'}</span>`
      }
      ${product.badge ? `<span class="hscroll-badge">${escapeHtml(product.badge)}</span>` : ''}
    </div>
    <div class="hscroll-item-info">
      <div class="hscroll-item-cat">${escapeHtml(product.category || '')}</div>
      <div class="hscroll-item-name">${escapeHtml(product.name || '')}</div>
      <div class="hscroll-item-price mono">৳${(product.price || 0).toLocaleString()}</div>
    </div>
  </div>`;
}

// ─── STATS BAR ───
async function renderStatsBar() {
  // Default values (fallback if API fails)
  const stats = {
    products: 25,
    brands: 5,
    artisans: 220,
    handcrafted: 100
  };

  // Try to fetch real stats from API
  try {
    const res = await fetch('/api/analytics/stats');
    if (res.ok) {
      const data = await res.json();
      if (data.products > 0) stats.products = data.products;
      if (data.orders > 0) stats.artisans = data.orders;
    }
  } catch (err) {
    console.log('[DRAPE] Stats API not available, using defaults');
  }

  return `
  <section class="section-stats">
    <div class="stats-bar">
      <div class="stat-item reveal">
        <div class="stat-num display" data-count="${stats.products}" data-suffix="+">0</div>
        <div class="stat-label">Curated Pieces</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item reveal reveal-delay-1">
        <div class="stat-num display" data-count="${stats.brands}">0</div>
        <div class="stat-label">Artisan Brands</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item reveal reveal-delay-2">
        <div class="stat-num display" data-count="${stats.artisans}" data-suffix="+">0</div>
        <div class="stat-label">Skilled Artisans</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item reveal reveal-delay-3">
        <div class="stat-num display" data-count="${stats.handcrafted}" data-suffix="%">0</div>
        <div class="stat-label">Handcrafted</div>
      </div>
    </div>
  </section>`;
}

// ─── LOOKBOOK / EDITORIAL ───
function renderLookbook() {
  return `
  <section class="section-lookbook">
    <div class="lookbook-header reveal">
      <span class="section-eyebrow">Lookbook</span>
      <h2 class="lookbook-title display">Style Notes</h2>
    </div>
    <div class="lookbook-grid">
      <div class="lookbook-card lookbook-large reveal">
        <div class="lookbook-card-bg" style="background: linear-gradient(160deg, var(--ink) 0%, #2a1f14 100%)"></div>
        <div class="lookbook-card-content">
          <div class="lookbook-card-eyebrow">The Dhaka Edit</div>
          <div class="lookbook-card-title display">Heritage<br>Muslin</div>
          <p class="lookbook-card-text">Ancient craft meets modern silhouette. Each piece tells a story of Old Dhaka's weaving tradition.</p>
          <button class="btn-ghost-light" onclick="showPage('catalog');setTimeout(()=>showCat('b_loom',null),100)">Explore →</button>
        </div>
      </div>
      <div class="lookbook-card reveal reveal-delay-1">
        <div class="lookbook-card-bg" style="background: linear-gradient(160deg, #1a2a1f 0%, #0d1a12 100%)"></div>
        <div class="lookbook-card-content">
          <div class="lookbook-card-eyebrow">Sustainable</div>
          <div class="lookbook-card-title display">Recycled<br>Cotton</div>
          <p class="lookbook-card-text">Post-consumer textile waste transformed into premium knitwear.</p>
          <button class="btn-ghost-light" onclick="showPage('catalog');setTimeout(()=>showCat('b_thread',null),100)">Shop →</button>
        </div>
      </div>
      <div class="lookbook-card reveal reveal-delay-2">
        <div class="lookbook-card-bg" style="background: linear-gradient(160deg, #2a2a1a 0%, #1a1a0d 100%)"></div>
        <div class="lookbook-card-content">
          <div class="lookbook-card-eyebrow">Artisan</div>
          <div class="lookbook-card-title display">Nakshi<br>Embroidery</div>
          <p class="lookbook-card-text">220 artisans preserving centuries-old hand-embroidery techniques.</p>
          <button class="btn-ghost-light" onclick="showPage('catalog');setTimeout(()=>showCat('b_nakshi',null),100)">Discover →</button>
        </div>
      </div>
    </div>
  </section>`;
}

// ─── TESTIMONIALS ───
async function renderTestimonials() {
  // Fallback testimonials
  const fallback = [
    { fname: 'Nusrat', lname: 'J.', rating: 5, comment: 'The muslin dress is the most beautiful thing I own. The quality is incredible for the price.', product_name: 'Muslin Wrap Dress', vendor: 'LOOM & GRACE' },
    { fname: 'Rahim', lname: 'K.', rating: 5, comment: 'Finally, a fashion brand from Bangladesh that\'s actually premium. The embroidery is museum-quality.', product_name: 'Broderie Kurta', vendor: 'NAKSHI STUDIO' },
    { fname: 'Sarah', lname: 'M.', rating: 5, comment: 'Ordered from London, arrived in 5 days. The knitwear is better than COS at half the price.', product_name: 'Silk Slip Top', vendor: 'THREAD REPUBLIC' }
  ];

  let reviews = fallback;
  try {
    const res = await fetch('/api/reviews/recent');
    if (res.ok) {
      const data = await res.json();
      if (data.reviews?.length >= 3) {
        reviews = data.reviews.slice(0, 5).map(r => ({
          fname: r.fname || 'Anonymous',
          lname: r.lname || '',
          rating: r.rating || 5,
          comment: r.comment || '',
          product_name: r.product_name || '',
          vendor: r.vendor || ''
        }));
      }
    }
  } catch (e) {
    console.log('[DRAPE] Reviews API not available, using defaults');
  }

  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  const cards = reviews.slice(0, 3).map((r, i) => {
    const initial = (r.fname || 'A')[0].toUpperCase();
    const name = r.lname ? `${r.fname} ${r.lname}.` : r.fname;
    const loc = r.vendor || '';
    return `
      <div class="testimonial-card reveal${i > 0 ? ' reveal-delay-' + i : ''}">
        <div class="testimonial-stars">${stars(r.rating)}</div>
        <p class="testimonial-text">"${r.comment}"</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">${initial}</div>
          <div>
            <div class="testimonial-name">${name}</div>
            <div class="testimonial-location">${loc}</div>
          </div>
        </div>
      </div>`;
  }).join('');

  return `
  <section class="section-testimonials">
    <div class="testimonials-header reveal">
      <span class="section-eyebrow">Social Proof</span>
      <h2 class="testimonials-title display">What People Say</h2>
    </div>
    <div class="testimonials-grid">
      ${cards}
    </div>
  </section>`;
}

// ─── FINAL CTA ───
function renderCTASection() {
  return `
  <section class="section-cta">
    <div class="cta-bg">
      <div class="cta-grain"></div>
    </div>
    <div class="cta-content reveal">
      <h2 class="cta-title display">Ready to Wear<br>Something Meaningful?</h2>
      <p class="cta-sub">Join thousands who've discovered Dhaka's finest artisan fashion. Every piece tells a story — yours is next.</p>
      <div class="cta-buttons">
        <button class="btn btn-lg btn-primary" onclick="showPage('shop')">
          Shop Collection
          <span class="btn-arrow">→</span>
        </button>
        <button class="btn btn-lg btn-ghost-light" onclick="showPage('brands')">Browse Brands</button>
      </div>
      <div class="cta-trust-badges reveal reveal-delay-1">
        <div class="cta-trust-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>Secure Checkout</span>
        </div>
        <div class="cta-trust-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span>Worldwide Shipping</span>
        </div>
        <div class="cta-trust-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/></svg>
          <span>30-Day Returns</span>
        </div>
      </div>
    </div>
  </section>`;
}

// ─── SCROLL GALLERY HELPER ───
function scrollGallery(dir) {
  const track = document.getElementById('hscrollTrack');
  if (!track) return;
  const scrollAmount = 300;
  track.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
}

// ─── TOUCH SWIPE FOR HORIZONTAL GALLERY ───
function initTouchSwipe() {
  const track = document.getElementById('hscrollTrack');
  if (!track) return;

  let startX = 0;
  let scrollLeft = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.style.scrollSnapType = 'none'; // Disable snap during swipe for smooth feel
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - track.offsetLeft;
    const walk = (startX - x) * 1.5; // Multiply for faster scroll
    track.scrollLeft = scrollLeft + walk;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    isDragging = false;
    track.style.scrollSnapType = 'x mandatory'; // Re-enable snap
  }, { passive: true });
}

// ─── SWIPE TO CLOSE PRODUCT MODAL ───
function initModalSwipe() {
  const modal = document.getElementById('productModal');
  if (!modal) return;

  let startY = 0;
  let isDragging = false;

  modal.addEventListener('touchstart', (e) => {
    // Only track swipes starting from the modal content, not images
    if (e.target.closest('.modal-img-area')) return;
    startY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  modal.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY;
    // If swiping down significantly, close the modal
    if (deltaY > 100) {
      isDragging = false;
      closeMDirect();
    }
  }, { passive: true });

  modal.addEventListener('touchend', () => {
    isDragging = false;
  }, { passive: true });
}

// ─── POPULATE HORIZONTAL GALLERY ───
function populateGallery(products) {
  const track = document.getElementById('hscrollTrack');
  if (!track || !products) return;

  // Pick 8 random products (or all if fewer)
  const picks = [...products]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(8, products.length));

  track.innerHTML = picks.map(renderHscrollItem).join('');
}

// ─── JOURNEY TIMELINE ───
function renderJourneyTimeline() {
  const steps = [
    {
      num: '01', title: 'Raw Fibers & Materials',
      desc: 'Organic cotton sourced from Sylhet, heritage muslin from Neeru, jute-silk blends from Rangpur. Every fiber traceable to its origin.',
      icon: '🌿'
    },
    {
      num: '02', title: 'Artisan Weaving',
      desc: 'Master weavers in Old Dhaka spend 3–6 days per garment on handlooms. The rhythm of the loom has barely changed in a century.',
      icon: '🧶'
    },
    {
      num: '03', title: 'Natural Dyeing',
      desc: 'Plant-based mordants — indigo from Jessore, madder root from Comilla, turmeric from Rajshahi. Zero synthetic chemicals.',
      icon: '🎨'
    },
    {
      num: '04', title: 'Cutting & Assembly',
      desc: 'Precision pattern cutting with Italian shears. Hand-stitched seams at 12 stitches per inch. Every garment built to last.',
      icon: '✂️'
    },
    {
      num: '05', title: 'Quality Control',
      desc: '14-point inspection by master tailors. Fabric weight, stitch density, colorfastness, symmetry — nothing leaves unchecked.',
      icon: '🔍'
    },
    {
      num: '06', title: 'Sustainable Packaging',
      desc: 'Plastic-free. Recycled paper, cloth dust bags, compostable mailers. The packaging is as considered as the garment.',
      icon: '📦'
    },
    {
      num: '07', title: 'Doorstep Delivery',
      desc: 'Carbon-neutral courier across Bangladesh. Worldwide air freight via DHL. Track every step from workshop to wardrobe.',
      icon: '🚚'
    }
  ];

  return `
  <section class="section-journey" id="section-journey">
    <div class="journey-header reveal">
      <span class="section-eyebrow">From Fiber to Doorstep</span>
      <h2 class="journey-title display">The Garment Lifecycle</h2>
      <p class="journey-sub">Track every hand-touched stage of creation across Dhaka's artisan workshops.</p>
    </div>
    <div class="journey-timeline">
      <div class="journey-line"></div>
      <div class="journey-progress-fill"></div>
      ${steps.map((step, i) => `
      <div class="journey-step reveal">
        <div class="journey-content">
          <div class="journey-step-number">Step ${step.num}</div>
          <h3 class="journey-step-title display">${step.title}</h3>
          <p class="journey-step-desc">${step.desc}</p>
        </div>
        <div class="journey-node"></div>
        <div class="journey-visual">
          <div class="journey-icon">${step.icon}</div>
        </div>
      </div>`).join('')}
    </div>
  </section>`;
}

// ─── PRODUCT ANATOMY ───
function renderProductAnatomy() {
  const leftCards = [
    { tag: 'Material', title: 'Fabric & Origin', text: 'Handloom muslin from Old Dhaka. 140gsm weight. Breathable, lightweight, naturally textured. Sourced directly from family-owned looms.' },
    { tag: 'Heritage', title: 'Branding & Labels', text: 'Hand-stamped brand seal on woven label. Care instructions in English and Bangla. Each piece numbered in the collection.' }
  ];
  const rightCards = [
    { tag: 'Construction', title: 'Thread & Stitching', text: 'Waxed cotton thread for durability. 12 stitches per inch — double the industry standard. French seams for a clean interior finish.' },
    { tag: 'Hardware', title: 'Buttons & Zippers', text: 'Recycled brass buttons, hand-polished. YKK antique copper zippers. Every closure chosen to complement the fabric.' }
  ];

  // SVG garment illustration — replaces emoji
  const garmentSVG = `
    <svg class="anatomy-garment-svg" viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <!-- Main body -->
      <path d="M60 20 L140 20 L145 60 L160 140 L160 220 L40 220 L40 140 L55 60 Z" stroke="var(--ink)" stroke-width="2" fill="var(--chalk)" opacity="0.9"/>
      <!-- Neckline -->
      <path d="M80 20 Q100 10 120 20" stroke="var(--ink)" stroke-width="2" fill="none"/>
      <!-- Sleeves -->
      <path d="M55 60 Q30 80 30 120 Q30 160 55 140" stroke="var(--ink)" stroke-width="2" fill="var(--chalk)" opacity="0.9"/>
      <path d="M145 60 Q170 80 170 120 Q170 160 145 140" stroke="var(--ink)" stroke-width="2" fill="var(--chalk)" opacity="0.9"/>
      <!-- Waist seam -->
      <path d="M50 120 Q100 110 150 120" stroke="var(--copper)" stroke-width="1.5" fill="none" stroke-dasharray="4,4"/>
      <!-- Side seams -->
      <path d="M55 60 L40 140" stroke="var(--ink)" stroke-width="1.5" fill="none"/>
      <path d="M145 60 L160 140" stroke="var(--ink)" stroke-width="1.5" fill="none"/>
      <!-- Button detail -->
      <circle cx="100" cy="150" r="4" fill="var(--copper)"/>
      <circle cx="100" cy="170" r="4" fill="var(--copper)"/>
      <circle cx="100" cy="190" r="4" fill="var(--copper)"/>
    </svg>
  `;

  return `
  <section class="section-anatomy" id="section-anatomy">
    <div class="anatomy-header reveal">
      <span class="section-eyebrow">Deconstructed Perfection</span>
      <h2 class="anatomy-title display">Inside the Garment</h2>
      <p class="anatomy-sub">Every component matters. Scroll to see how individual artisan elements come together as one.</p>
    </div>
    <div class="anatomy-stage">
      <div class="anatomy-column">
        ${leftCards.map(c => `
        <div class="anatomy-callout reveal">
          <div class="anatomy-callout-tag">${c.tag}</div>
          <div class="anatomy-callout-title display">${c.title}</div>
          <div class="anatomy-callout-text">${c.text}</div>
        </div>`).join('')}
      </div>
      <div class="anatomy-garment-core">
        <div class="anatomy-core-image reveal-scale">${garmentSVG}</div>
        <div class="anatomy-core-label display">Signature Piece</div>
      </div>
      <div class="anatomy-column anatomy-callout-right">
        ${rightCards.map(c => `
        <div class="anatomy-callout reveal">
          <div class="anatomy-callout-tag">${c.tag}</div>
          <div class="anatomy-callout-title display">${c.title}</div>
          <div class="anatomy-callout-text">${c.text}</div>
        </div>`).join('')}
      </div>
    </div>
  </section>`;
}

// ─── INFLUENCER COLLAB HUB ───
function renderInfluencerHub() {
  return `
  <section class="section-influencer" id="section-influencer">
    <div class="influencer-layout">
      <div class="influencer-pitch">
        <span class="section-eyebrow reveal">Creator Program</span>
        <h2 class="influencer-title display reveal reveal-delay-1">Create<br>With Us</h2>
        <p class="influencer-desc reveal reveal-delay-2">
          Rising fashion creators — we want to collab. Get early access to new drops,
          VIP membership, and feature your content on our platform.
        </p>
        <div class="influencer-benefits">
          <div class="influencer-benefit reveal">
            <div class="influencer-benefit-icon">🎁</div>
            <div class="influencer-benefit-title display">Early Bird Access</div>
            <div class="influencer-benefit-text">New collections 2 weeks before launch</div>
          </div>
          <div class="influencer-benefit reveal reveal-delay-1">
            <div class="influencer-benefit-icon">👑</div>
            <div class="influencer-benefit-title display">VIP Membership</div>
            <div class="influencer-benefit-text">Exclusive discounts + free shipping</div>
          </div>
          <div class="influencer-benefit reveal reveal-delay-2">
            <div class="influencer-benefit-icon">📱</div>
            <div class="influencer-benefit-title display">Feature on DRAPE</div>
            <div class="influencer-benefit-text">Your content on our social &amp; landing page</div>
          </div>
          <div class="influencer-benefit reveal reveal-delay-3">
            <div class="influencer-benefit-icon">🤝</div>
            <div class="influencer-benefit-title display">Direct Collab</div>
            <div class="influencer-benefit-text">Co-create limited edition pieces</div>
          </div>
        </div>
      </div>
      <div class="influencer-form-wrapper reveal">
        <div class="influencer-form-title display">Apply to Collaborate</div>
        <div class="inf-error" id="infError"></div>
        <div class="inf-success" id="infSuccess">
          <div class="inf-success-icon">🎉</div>
          <div class="inf-success-title display">Application Received!</div>
          <div class="inf-success-text">We'll review your profile and get back to you within 48 hours. Keep creating!</div>
        </div>
        <form class="influencer-form" id="infForm" onsubmit="submitInfluencer(event)">
          <div class="inf-field-row">
            <div class="inf-field">
              <label>Your Name</label>
              <input type="text" name="name" required placeholder="e.g. Aisha Rahman">
            </div>
            <div class="inf-field">
              <label>Platform</label>
              <select name="platform" required>
                <option value="">Select...</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div class="inf-field-row">
            <div class="inf-field">
              <label>Social Handle</label>
              <input type="text" name="handle" required placeholder="@yourhandle">
            </div>
            <div class="inf-field">
              <label>Followers</label>
              <select name="followers" required>
                <option value="">Select range...</option>
                <option value="1k-10k">1K – 10K</option>
                <option value="10k-50k">10K – 50K</option>
                <option value="50k-100k">50K – 100K</option>
                <option value="100k-500k">100K – 500K</option>
                <option value="500k+">500K+</option>
              </select>
            </div>
          </div>
          <div class="inf-field">
            <label>Content Niche</label>
            <input type="text" name="niche" placeholder="e.g. Sustainable fashion, street style, modest wear">
          </div>
          <div class="inf-field">
            <label>Why DRAPE?</label>
            <textarea name="message" placeholder="Tell us why you'd love to collaborate with DRAPE..." rows="3"></textarea>
          </div>
          <button type="submit" class="inf-submit" id="infSubmit">Submit Application →</button>
        </form>
      </div>
    </div>
  </section>`;
}

// ─── INFLUENCER FORM SUBMISSION ───
async function submitInfluencer(e) {
  e.preventDefault();
  const form = document.getElementById('infForm');
  const errorEl = document.getElementById('infError');
  const successEl = document.getElementById('infSuccess');
  const submitBtn = document.getElementById('infSubmit');

  const data = Object.fromEntries(new FormData(form));

  errorEl.classList.remove('show');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  try {
    const res = await fetch('/api/influencer/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();

    if (!res.ok) throw new Error(result.error || 'Submission failed');

    form.style.display = 'none';
    successEl.classList.add('show');
  } catch (err) {
    errorEl.textContent = err.message || 'Something went wrong. Please try again.';
    errorEl.classList.add('show');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Application →';
  }
}

// ─── INIT LANDING ───
async function initLanding(products) {
  // Inject all sections into the home page
  const homePage = document.getElementById('page-home');
  if (!homePage) return;

  // Replace hero
  const oldHero = homePage.querySelector('.hero');
  if (oldHero) {
    oldHero.outerHTML = renderLandingHero();
  }

  // Find the featured grid section
  const featuredSection = homePage.querySelector('.section');
  if (featuredSection) {
    // Insert sections before the featured grid — order matters for narrative flow
    // Some renderers are async (fetch from API), so resolve them all
    const [statsBarHTML, editorialHTML, brandStoryHTML, testimonialsHTML] = await Promise.all([
      renderStatsBar(),
      renderEditorialGrid(),
      renderBrandStory(),
      renderTestimonials()
    ]);
    const sectionsHTML = [
      renderJourneyTimeline(),    // From Fiber to Doorstep — centerpiece
      renderProductAnatomy(),     // Deconstructed garment
      editorialHTML,              // Five Brands grid (dynamic from API)
      brandStoryHTML,             // Split screen brand feature (dynamic)
      renderHorizontalGallery(),  // Horizontal scroll gallery
      statsBarHTML,               // Animated counters (with real data)
      renderLookbook(),           // Editorial style cards
      renderInfluencerHub(),      // Creator collab program
      testimonialsHTML,           // Social proof (real reviews from API)
      renderCTASection(),         // Final CTA
    ].join('');

    featuredSection.insertAdjacentHTML('beforebegin', sectionsHTML);

    // Update featured grid header
    const header = featuredSection.querySelector('.section-header');
    if (header) {
      header.innerHTML = `
        <div class="reveal">
          <span class="section-eyebrow">New Arrivals</span>
          <h2 class="section-title display">The Collection</h2>
        </div>
        <button class="nav-link reveal reveal-delay-1" onclick="showPage('shop')">View all →</button>
      `;
    }
  }

  // Populate gallery
  if (products && products.length) {
    try {
      populateGallery(products);
    } catch (err) {
      console.error('[DRAPE] populateGallery FAILED:', err);
    }
  }

  // Initialize animations after DOM is ready
  requestAnimationFrame(() => {
    try {
      initAnimations();
    } catch (err) {
      console.error('[DRAPE] initAnimations FAILED:', err);
    }
    // Touch interactions for mobile
    try {
      initTouchSwipe();
      initModalSwipe();
    } catch (err) {
      console.error('[DRAPE] Touch init FAILED:', err);
    }
  });
}

// ─── EXPORT ───
window.initLanding = initLanding;
window.renderLandingHero = renderLandingHero;
window.renderJourneyTimeline = renderJourneyTimeline;
window.renderProductAnatomy = renderProductAnatomy;
window.renderInfluencerHub = renderInfluencerHub;
window.submitInfluencer = submitInfluencer;
window.populateGallery = populateGallery;
window.scrollGallery = scrollGallery;
window.initTouchSwipe = initTouchSwipe;
window.initModalSwipe = initModalSwipe;
