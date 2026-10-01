import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import Lenis from 'lenis'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion'

const MARQUEE_WORDS = ['Kinetic', 'Typography', 'Weight', 'Rhythm', 'Motion', 'Craft']

function SplitChars({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          aria-hidden="true"
          className="inline-block will-change-transform"
          style={{ animation: 'charRise 700ms var(--ease-out-expo) both', animationDelay: `${delay + i * 26}ms` }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  )
}

function MarqueeRow({ reducedMotion }: { reducedMotion: boolean }) {
  const sequence = (
    <>
      {MARQUEE_WORDS.map(word => (
        <span key={word} className="mx-7 inline-flex items-center gap-7">
          <span className="font-serif italic">{word}</span>
          <span className="w-2 h-2 rounded-full bg-accent inline-block" aria-hidden="true" />
        </span>
      ))}
    </>
  )
  return (
    <div className="overflow-hidden border-y border-border py-5 bg-surface" aria-hidden="true">
      <div
        className="flex w-max whitespace-nowrap will-change-transform text-3xl md:text-5xl text-text"
        style={{ animation: reducedMotion ? undefined : 'marquee 26s linear infinite' }}
      >
        <div className="flex items-center">{sequence}</div>
        <div className="flex items-center">{sequence}</div>
      </div>
    </div>
  )
}

export function Demo2KineticTypography() {
  const reducedMotion = useReducedMotion()
  const skewRef = useRef<HTMLHeadingElement>(null)
  const [weight, setWeight] = useState(560)
  const [tracking, setTracking] = useState(0.02)
  const [italic, setItalic] = useState(false)

  useEffect(() => {
    document.title = 'Demo 2 — Kinetic Typography · DRAPE Fashion OS'
  }, [])

  // Load the Inter variable font on demand so the weight axis has a real
  // 100–900 range. Falls back to the system stack when offline.
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap'
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  // Lenis velocity → skewY. rAF loop with eased interpolation, written
  // straight to the style — no React re-renders per frame.
  useEffect(() => {
    if (reducedMotion) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    let rafId = 0
    let skew = 0
    const raf = (time: number) => {
      lenis.raf(time)
      const target = Math.max(-7, Math.min(7, lenis.velocity * 0.55))
      skew += (target - skew) * 0.12
      if (skewRef.current) {
        skewRef.current.style.transform = `skewY(${skew.toFixed(3)}deg)`
      }
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [reducedMotion])

  const sampleStyle: CSSProperties = {
    fontFamily: "'Inter', var(--font-sans)",
    fontWeight: weight,
    letterSpacing: `${tracking}em`,
    fontStyle: italic ? 'italic' : 'normal',
  }

  return (
    <div className="bg-background">
      {/* Hero with staggered split characters */}
      <section
        className="relative min-h-[65vh] flex items-center justify-center overflow-hidden bg-secondary"
        aria-labelledby="demo2-title"
      >
        <div className="absolute top-0 left-0 right-0 z-10">
          <div className="container pt-8 flex items-center justify-between">
            <span className="text-xs tracking-[0.3em] uppercase text-white/60">Study 02</span>
            <Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">
              ← Back to overview
            </Link>
          </div>
        </div>
        <div className="container relative z-10 text-center py-24">
          <p className="text-xs md:text-sm tracking-[0.35em] uppercase text-white/60">Interaction Study · Type</p>
          <h1 id="demo2-title" className="font-serif text-6xl md:text-8xl lg:text-9xl text-white mt-5 leading-none">
            <SplitChars text="Kinetic Type" />
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/75 max-w-2xl mx-auto">
            Characters rise one by one, the marquee never stops, and the big serif headline below skews with your scroll velocity.
          </p>
        </div>
      </section>

      {/* Marquee */}
      <MarqueeRow reducedMotion={reducedMotion} />

      {/* Velocity skew */}
      <section className="min-h-[80vh] flex items-center justify-center overflow-hidden" aria-labelledby="demo2-velocity">
        <div className="container text-center py-20">
          <p className="text-xs md:text-sm tracking-[0.35em] uppercase text-text-muted">Scroll velocity → skew</p>
          <h2
            ref={skewRef}
            id="demo2-velocity"
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-text mt-5 will-change-transform"
            style={{ transform: 'skewY(0deg)' }}
          >
            Faster is stranger
          </h2>
          <p className="mt-6 text-lg text-text-muted max-w-xl mx-auto">
            Lenis reports velocity every frame; it is eased into a ±7° skewY and written directly to the style.
          </p>
        </div>
      </section>

      {/* Variable weight playground */}
      <section className="container py-24" aria-labelledby="demo2-playground">
        <h2 id="demo2-playground" className="font-serif text-3xl md:text-4xl text-text">Variable font playground</h2>
        <p className="mt-2 text-text-muted max-w-2xl">
          Inter's variable weight axis, loaded on demand for this page. Drag the sliders — the sample re-renders live.
        </p>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr] items-start">
          <div className="space-y-7 rounded-2xl border border-border bg-surface p-6">
            <label className="block">
              <span className="flex items-center justify-between text-sm text-text-muted">
                Font weight
                <span className="font-mono text-xs text-text">{weight}</span>
              </span>
              <input
                type="range"
                min={100}
                max={900}
                step={10}
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
                className="w-full mt-2 accent-primary"
                aria-label="Font weight"
              />
            </label>
            <label className="block">
              <span className="flex items-center justify-between text-sm text-text-muted">
                Letter spacing
                <span className="font-mono text-xs text-text">{tracking.toFixed(3)}em</span>
              </span>
              <input
                type="range"
                min={-0.04}
                max={0.24}
                step={0.005}
                value={tracking}
                onChange={e => setTracking(Number(e.target.value))}
                className="w-full mt-2 accent-primary"
                aria-label="Letter spacing"
              />
            </label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Style</span>
              <button
                type="button"
                onClick={() => setItalic(v => !v)}
                aria-pressed={italic}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  italic ? 'bg-primary text-white' : 'border border-border text-text hover:bg-background'
                }`}
              >
                Italic
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-8 md:p-12 flex items-center justify-center min-h-[280px] overflow-hidden">
            <p className="text-4xl md:text-6xl text-text leading-tight text-center" style={sampleStyle}>
              Handwoven in Dhaka
            </p>
          </div>
        </div>
      </section>

      {/* Outro */}
      <section className="container pb-24">
        <div className="rounded-2xl border border-border bg-surface text-center px-8 py-12">
          <p className="font-serif text-2xl md:text-3xl text-text">Type that moves is type that's read.</p>
          <p className="mt-3 text-sm text-text-muted">
            Study 02 of 05 —{' '}
            <Link to="/demo/3" className="text-primary hover:underline">next: the physics playground</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
