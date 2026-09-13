// @ts-check
// ── ANIMATIONS.JS ──
// Lightweight scroll animation engine using IntersectionObserver + RAF.
// No external dependencies. GPU-accelerated (transform + opacity only).

// ─── SCROLL REVEAL ───
function initScrollAnimations() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// ─── COUNT UP ANIMATION ───
function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCount(el) {
  const target = parseInt(el.getAttribute('data-count') || '0', 10);
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const duration = 1800;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ─── NAVIGATION SCROLL EFFECT ───
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 80) {
          nav.classList.add('nav-scrolled');
        } else {
          nav.classList.remove('nav-scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ─── PARALLAX ───
function initParallax() {
  const layers = document.querySelectorAll('.parallax-layer');
  if (!layers.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        layers.forEach(layer => {
          const speed = parseFloat(layer.getAttribute('data-speed') || '0.3');
          const rect = layer.parentElement?.getBoundingClientRect();
          if (rect && rect.bottom > 0 && rect.top < window.innerHeight) {
            const offset = (scrollY - layer.parentElement.offsetTop) * speed;
            layer.style.transform = `translate3d(0, ${offset}px, 0)`;
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ─── HERO CURSOR FOLLOW ───
function initHeroCursor() {
  const hero = document.querySelector('.hero-full');
  if (!hero) return;

  const layers = hero.querySelectorAll('.cursor-layer');
  const gradient = hero.querySelector('.hero-full-gradient');
  let pending = false;
  let lastX = 0, lastY = 0;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    lastX = (e.clientX - rect.left) / rect.width - 0.5;
    lastY = (e.clientY - rect.top) / rect.height - 0.5;

    if (!pending) {
      pending = true;
      requestAnimationFrame(() => {
        layers.forEach(layer => {
          const depth = parseFloat(layer.getAttribute('data-depth') || '10');
          layer.style.transform = `translate(${lastX * depth}px, ${lastY * depth}px)`;
        });

        if (gradient) {
          gradient.style.setProperty('--mx', `${30 + lastX * 20}%`);
          gradient.style.setProperty('--my', `${50 + lastY * 20}%`);
        }
        pending = false;
      });
    }
  }, { passive: true });
}

// ─── SMOOTH SCROLL TO SECTION ───
function smoothScrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ─── HORIZONTAL SCROLL DRAG ───
function initDragScroll() {
  document.querySelectorAll('.hscroll-track').forEach(track => {
    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.style.cursor = 'grabbing';
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mouseup', () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });
  });
}

// ─── STAGGER CHILDREN ───
function staggerReveal(parentSelector, childSelector, delay = 100) {
  const parent = document.querySelector(parentSelector);
  if (!parent) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll(childSelector);
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * delay}ms`;
          child.classList.add('revealed');
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(parent);
}

// ─── SCROLL TIMELINE DETECTION ───
function hasScrollTimeline() {
  return CSS.supports && CSS.supports('animation-timeline', 'view()');
}

// ─── JOURNEY PROGRESS LINE ───
function initJourneyProgress() {
  // If native CSS scroll-driven animations are supported, the CSS handles it.
  // Otherwise, we drive the progress line with JS.
  if (hasScrollTimeline()) return;

  const fill = document.querySelector('.journey-progress-fill');
  if (!fill) return;

  const timeline = document.querySelector('.journey-timeline');
  if (!timeline) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const rect = timeline.getBoundingClientRect();
        const viewH = window.innerHeight;
        const total = rect.height;
        const scrolled = viewH - rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / (total + viewH * 0.3)));
        fill.style.transform = `translateX(-50%) scaleY(${progress})`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ─── INIT ALL ───
function initAnimations() {
  initScrollAnimations();
  initCountUp();
  initNavScroll();
  initParallax();
  initHeroCursor();
  initDragScroll();
  initJourneyProgress();

  // Stagger product cards
  staggerReveal('.product-grid', '.product-card', 80);
  staggerReveal('.editorial-grid', '.editorial-card', 120);
  staggerReveal('.stats-bar', '.stat-item', 150);
  staggerReveal('.influencer-benefits', '.influencer-benefit', 100);
}

// ─── EXPORT ───
window.initAnimations = initAnimations;
window.smoothScrollTo = smoothScrollTo;
