import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useStaggeredReveal } from '../hooks/useScrollReveal'

const GALLERY_ITEMS = [
  { title: 'The Loom Room', caption: 'Hand-dyed thread walls · 240 count', swatch: 'linear-gradient(135deg, #f5f0eb, #e0d3c0)' },
  { title: 'Indigo Vats', caption: 'Natural indigo, fermented 14 days', swatch: 'linear-gradient(135deg, #2d3a4a, #1a2430)' },
  { title: 'Weaving Shed', caption: 'Pit looms · Jamdani motifs', swatch: 'linear-gradient(135deg, #8b7355, #6d5c42)' },
  { title: 'Gold Thread', caption: 'Zari embroidery · real metallic', swatch: 'linear-gradient(135deg, #c9a962, #a8873f)' },
  { title: 'Finishing Table', caption: 'Stone-washed · air dried', swatch: 'linear-gradient(135deg, #faf6f0, #ddd0c4)' },
  { title: 'The Archive', caption: 'Every pattern since 1998', swatch: 'linear-gradient(135deg, #3a342c, #241f1e)' },
]

const STUDY_ASPECTS = [
  { name: 'Inertia smoothing', detail: 'Lenis 1.3 drives the native scroller with lerp 0.085 — wheel input is interpolated, never snapped.' },
  { name: 'Parallax depth', detail: 'Hero layers translate at different rates, sampled from the real scroll position every frame.' },
  { name: 'Pinned gallery', detail: 'A 300vh section with a sticky viewport converts vertical scroll into horizontal travel.' },
  { name: 'Staggered reveal', detail: 'IntersectionObserver plus per-card delays keep entrances choreographed, not synchronized.' },
  { name: '60fps discipline', detail: 'Scroll-driven writes are rAF-throttled and mutate styles directly — zero per-frame React renders.' },
  { name: 'Reduced motion', detail: 'prefers-reduced-motion disables Lenis, parallax and pinning; content falls back to a static stack.' },
]

export function Demo1ImmersiveScroll() {
  const reducedMotion = useReducedMotion()
  const progressRef = useRef<HTMLDivElement>(null)
  const heroBgRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const gallerySectionRef = useRef<HTMLElement>(null)
  const galleryTrackRef = useRef<HTMLDivElement>(null)
  const { refs, visibleIndices } = useStaggeredReveal(STUDY_ASPECTS.length)

  useEffect(() => {
    document.title = 'Demo 1 — Immersive Scroll · DRAPE Fashion OS'
  }, [])

  // Lenis smooth scrolling — skipped entirely for reduced motion.
  useEffect(() => {
    if (reducedMotion) return
    const lenis = new Lenis({
      lerp: 0.085,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    })
    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [reducedMotion])

  // Progress bar, parallax and pinned gallery — rAF-throttled direct style
  // writes. Works identically with Lenis (which animates native scroll) and
  // with the plain fallback.
  useEffect(() => {
    let ticking = false
    const update = () => {
      ticking = false
      const y = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${maxScroll > 0 ? Math.min(1, y / maxScroll) : 0})`
      }
      if (reducedMotion) return

      if (heroTitleRef.current) {
        heroTitleRef.current.style.transform = `translateY(${(y * 0.32).toFixed(1)}px)`
      }
      if (heroBgRef.current) {
        heroBgRef.current.style.transform = `translateY(${(y * 0.16).toFixed(1)}px)`
      }
      const section = gallerySectionRef.current
      const track = galleryTrackRef.current
      if (section && track) {
        const rect = section.getBoundingClientRect()
        const total = rect.height - window.innerHeight
        const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0
        const shift = Math.max(0, track.scrollWidth - window.innerWidth)
        track.style.transform = `translate3d(${(-progress * shift).toFixed(1)}px, 0, 0)`
      }
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reducedMotion])

  return (
    <div className="bg-background">
      {/* Reading progress */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-border/50" aria-hidden="true">
        <div
          ref={progressRef}
          className="h-full bg-primary origin-left will-change-transform"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Parallax hero */}
      <section
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden demo-hero-gradient"
        aria-labelledby="demo1-title"
      >
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="container pt-8 flex items-center justify-between">
            <span className="text-xs tracking-[0.3em] uppercase text-text-muted">Study 01</span>
            <Link to="/" className="text-sm text-text-muted hover:text-primary transition-colors">
              ← Back to overview
            </Link>
          </div>
        </div>
        <div ref={heroBgRef} className="absolute inset-0 will-change-transform" aria-hidden="true">
          <div
            className="absolute -top-32 -left-24 w-[440px] h-[440px] rounded-full opacity-50"
            style={{ background: 'radial-gradient(circle, rgba(201,169,98,0.45), transparent 68%)', filter: 'blur(36px)' }}
          />
          <div
            className="absolute -bottom-40 -right-20 w-[520px] h-[520px] rounded-full opacity-40"
            style={{ background: 'radial-gradient(circle, rgba(139,115,85,0.4), transparent 68%)', filter: 'blur(44px)' }}
          />
        </div>
        <div className="container relative z-10 text-center py-20">
          <p className="text-xs md:text-sm tracking-[0.35em] uppercase text-text-muted">Interaction Study · Scroll</p>
          <h1
            ref={heroTitleRef}
            id="demo1-title"
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-text mt-5 will-change-transform"
          >
            Immersive Scroll
          </h1>
          <p className="mt-6 text-lg md:text-xl text-text-muted max-w-2xl mx-auto">
            Inertia-smoothed scrolling, parallax depth and a pinned horizontal gallery — scroll slowly and watch the machinery work.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-text-muted">
            {['lenis 1.3', 'lerp 0.085', 'rAF-throttled', 'reduced-motion aware'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full border border-border bg-surface/70">{tag}</span>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Pinned horizontal gallery */}
      {reducedMotion ? (
        <section className="container py-24" aria-label="Collection gallery">
          <h2 className="font-serif text-3xl md:text-4xl text-text">The atelier, end to end</h2>
          <p className="mt-2 text-text-muted">Static layout — pinning and parallax are disabled for reduced motion.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY_ITEMS.map(item => (
              <figure key={item.title} className="rounded-2xl overflow-hidden border border-border bg-surface">
                <div className="h-48" style={{ background: item.swatch }} />
                <figcaption className="p-5">
                  <p className="font-medium text-text">{item.title}</p>
                  <p className="text-sm text-text-muted mt-1">{item.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : (
        <section ref={gallerySectionRef} className="relative" style={{ height: '300vh' }} aria-label="Collection gallery">
          <div className="sticky top-0 h-screen overflow-hidden flex items-center">
            <div className="w-full">
              <div className="container flex items-end justify-between mb-8">
                <h2 className="font-serif text-3xl md:text-4xl text-text">The atelier, end to end</h2>
                <span className="text-xs font-mono text-text-muted hidden md:block">vertical scroll → horizontal travel</span>
              </div>
              <div ref={galleryTrackRef} className="flex gap-6 pl-[6vw] pr-[10vw] w-max will-change-transform">
                {GALLERY_ITEMS.map((item, i) => (
                  <figure
                    key={item.title}
                    className="relative shrink-0 w-[74vw] sm:w-[46vw] lg:w-[30vw] rounded-2xl overflow-hidden border border-border bg-surface shadow-lg"
                  >
                    <div className="h-[46vh]" style={{ background: item.swatch }} />
                    <figcaption className="p-5 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text">{item.title}</p>
                        <p className="text-sm text-text-muted mt-1">{item.caption}</p>
                      </div>
                      <span className="font-mono text-xs text-text-muted">{String(i + 1).padStart(2, '0')}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Staggered reveal grid */}
      <section className="container py-24" aria-labelledby="demo1-aspects">
        <h2 id="demo1-aspects" className="font-serif text-3xl md:text-4xl text-text">What makes it feel expensive</h2>
        <p className="mt-2 text-text-muted max-w-2xl">
          Six details doing the heavy lifting, each entering the viewport on its own beat.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STUDY_ASPECTS.map((aspect, i) => {
            const revealed = visibleIndices.has(i)
            return (
              <div
                key={aspect.name}
                ref={refs(i)}
                className="demo-card-hover rounded-2xl border border-border bg-surface p-6"
                style={revealed ? { animation: 'slideUp 650ms var(--ease-out-cubic) both', animationDelay: `${(i % 3) * 90}ms` } : { opacity: 0 }}
              >
                <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 text-lg font-medium text-text">{aspect.name}</h3>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">{aspect.detail}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Outro */}
      <section className="container pb-24">
        <div className="rounded-2xl bg-secondary text-center px-8 py-14">
          <p className="font-serif text-3xl md:text-4xl text-white">That's the whole trick.</p>
          <p className="mt-3 text-sm text-white/70">
            Study 01 of 05 —{' '}
            <Link to="/demo/2" className="text-accent hover:underline">next: kinetic typography</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
