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
        <button class="btn-premium" onclick="smoothScrollTo('#section-editorial')">
          <span>Explore Collection</span>
          <span class="btn-arrow">↓</span>
        </button>
        <button class="btn-ghost-light" onclick="showPage('brands')">Our Brands</button>
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
function renderEditorialGrid() {
  return `
  <section class="section-editorial" id="section-editorial">
    <div class="editorial-header reveal">
      <span class="section-eyebrow">Discover</span>
      <h2 class="editorial-title display">Five Brands.<br>One Vision.</h2>
      <p class="editorial-sub">Each a master of their craft. Sourced directly, quality-checked, fulfilled under one roof.</p>
    </div>
    <div class="editorial-grid">
      <div class="editorial-card editorial-tall reveal reveal-delay-1" onclick="showPage('catalog');setTimeout(()=>showCat('b_loom',null),100)">
        <div class="editorial-card-bg" style="background:linear-gradient(135deg,#2d1f14,#1a1210)"></div>
        <div class="editorial-card-icon">🌿</div>
        <div class="editorial-card-content">
          <div class="editorial-card-cat">Dresses & Occasion</div>
          <div class="editorial-card-name display">Loom & Grace</div>
          <div class="editorial-card-meta">Heritage muslin · 3-6 day weave</div>
        </div>
        <div class="editorial-card-arrow">→</div>
      </div>
      <div class="editorial-card reveal reveal-delay-2" onclick="showPage('catalog');setTimeout(()=>showCat('b_thread',null),100)">
        <div class="editorial-card-bg" style="background:linear-gradient(135deg,#1a2a1f,#0d1a12)"></div>
        <div class="editorial-card-icon">✂️</div>
        <div class="editorial-card-content">
          <div class="editorial-card-cat">Tops & Knitwear</div>
          <div class="editorial-card-name display">Thread Republic</div>
          <div class="editorial-card-meta">Recycled cotton · 140 women employed</div>
        </div>
        <div class="editorial-card-arrow">→</div>
      </div>
      <div class="editorial-card reveal reveal-delay-3" onclick="showPage('catalog');setTimeout(()=>showCat('b_nakshi',null),100)">
        <div class="editorial-card-bg" style="background:linear-gradient(135deg,#2a1a2a,#1a0d1a)"></div>
        <div class="editorial-card-icon">🎨</div>
        <div class="editorial-card-content">
          <div class="editorial-card-cat">Ethnic & Embroidered</div>
          <div class="editorial-card-name display">Nakshi Studio</div>
          <div class="editorial-card-meta">220+ artisans · Fair-trade model</div>
        </div>
        <div class="editorial-card-arrow">→</div>
      </div>
      <div class="editorial-card editorial-wide reveal reveal-delay-3" onclick="showPage('catalog');setTimeout(()=>showCat('b_zephyr',null),100)">
        <div class="editorial-card-bg" style="background:linear-gradient(135deg,#1a1a2a,#0d0d1a)"></div>
        <div class="editorial-card-icon">🔪</div>
        <div class="editorial-card-content">
          <div class="editorial-card-cat">Tailored Bottoms</div>
          <div class="editorial-card-name display">Zephyr Cuts</div>
          <div class="editorial-card-meta">14 QC checkpoints · Italian canvas</div>
        </div>
        <div class="editorial-card-arrow">→</div>
      </div>
      <div class="editorial-card reveal reveal-delay-4" onclick="showPage('catalog');setTimeout(()=>showCat('b_adorn',null),100)">
        <div class="editorial-card-bg" style="background:linear-gradient(135deg,#2a2a1a,#1a1a0d)"></div>
        <div class="editorial-card-icon">💎</div>
        <div class="editorial-card-content">
          <div class="editorial-card-cat">Accessories & Jewellery</div>
          <div class="editorial-card-name display">Adorn Co.</div>
          <div class="editorial-card-meta">Full-grain leather · 5-year guarantee</div>
        </div>
        <div class="editorial-card-arrow">→</div>
      </div>
    </div>
  </section>`;
}

// ─── BRAND STORY (SPLIT SCREEN) ───
function renderBrandStory() {
  return `
  <section class="section-split">
    <div class="split-left reveal">
      <div class="split-visual">
        <div class="split-visual-inner">
          <div class="split-icon-large">🌿</div>
          <div class="split-tag">Featured Brand</div>
        </div>
      </div>
    </div>
    <div class="split-right">
      <div class="split-content">
        <span class="section-eyebrow reveal">The Craft</span>
        <h2 class="split-title display reveal reveal-delay-1">From Dhaka's<br>Finest Workshops</h2>
        <p class="split-text reveal reveal-delay-2">
          Every Loom & Grace garment starts life in a handloom workshop in Old Dhaka.
          The weaving process for a single dress takes 3–6 days. Their dye house uses
          only plant-based mordants. Carbon-neutral since 2022.
        </p>
        <div class="split-stats reveal reveal-delay-3">
          <div class="split-stat">
            <div class="split-stat-num display">3–6</div>
            <div class="split-stat-label">Days per garment</div>
          </div>
          <div class="split-stat">
            <div class="split-stat-num display">100%</div>
            <div class="split-stat-label">Plant-based dyes</div>
          </div>
          <div class="split-stat">
            <div class="split-stat-num display">2022</div>
            <div class="split-stat-label">Carbon neutral</div>
          </div>
        </div>
        <button class="btn-primary reveal reveal-delay-4" onclick="showPage('catalog');setTimeout(()=>showCat('b_loom',null),100)">
          Shop Loom & Grace →
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
function renderStatsBar() {
  return `
  <section class="section-stats">
    <div class="stats-bar">
      <div class="stat-item reveal">
        <div class="stat-num display" data-count="25" data-suffix="+">0</div>
        <div class="stat-label">Curated Pieces</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item reveal reveal-delay-1">
        <div class="stat-num display" data-count="5">0</div>
        <div class="stat-label">Artisan Brands</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item reveal reveal-delay-2">
        <div class="stat-num display" data-count="220" data-suffix="+">0</div>
        <div class="stat-label">Skilled Artisans</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item reveal reveal-delay-3">
        <div class="stat-num display" data-count="100" data-suffix="%">0</div>
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
function renderTestimonials() {
  return `
  <section class="section-testimonials">
    <div class="testimonials-header reveal">
      <span class="section-eyebrow">Social Proof</span>
      <h2 class="testimonials-title display">What People Say</h2>
    </div>
    <div class="testimonials-grid">
      <div class="testimonial-card reveal">
        <div class="testimonial-stars">★★★★★</div>
        <p class="testimonial-text">"The muslin dress from Loom & Grace is the most beautiful thing I own. The quality is incredible for the price."</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">N</div>
          <div>
            <div class="testimonial-name">Nusrat J.</div>
            <div class="testimonial-location">Dhaka, Bangladesh</div>
          </div>
        </div>
      </div>
      <div class="testimonial-card reveal reveal-delay-1">
        <div class="testimonial-stars">★★★★★</div>
        <p class="testimonial-text">"Finally, a fashion brand from Bangladesh that's actually premium. The Nakshi embroidery is museum-quality."</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">R</div>
          <div>
            <div class="testimonial-name">Rahim K.</div>
            <div class="testimonial-location">Chittagong, Bangladesh</div>
          </div>
        </div>
      </div>
      <div class="testimonial-card reveal reveal-delay-2">
        <div class="testimonial-stars">★★★★★</div>
        <p class="testimonial-text">"Ordered from London, arrived in 5 days. The Thread Republic knitwear is better than COS at half the price."</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">S</div>
          <div>
            <div class="testimonial-name">Sarah M.</div>
            <div class="testimonial-location">London, UK</div>
          </div>
        </div>
      </div>
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
      <h2 class="cta-title display">Join the Movement</h2>
      <p class="cta-sub">Be part of Dhaka's emerging fashion revolution. Curated artisan pieces, delivered worldwide.</p>
      <div class="cta-buttons">
        <button class="btn-premium" onclick="showPage('shop')">
          <span>Shop Now</span>
          <span class="btn-arrow">→</span>
        </button>
        <button class="btn-ghost-light" onclick="showPage('brands')">Meet the Brands</button>
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
        <div class="anatomy-core-image reveal-scale">🎽</div>
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
function initLanding(products) {
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
    const sectionsHTML = [
      renderJourneyTimeline(),    // From Fiber to Doorstep — centerpiece
      renderProductAnatomy(),     // Deconstructed garment
      renderEditorialGrid(),      // Five Brands grid
      renderBrandStory(),         // Split screen brand feature
      renderHorizontalGallery(),  // Horizontal scroll gallery
      renderStatsBar(),           // Animated counters
      renderLookbook(),           // Editorial style cards
      renderInfluencerHub(),      // Creator collab program
      renderTestimonials(),       // Social proof
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
