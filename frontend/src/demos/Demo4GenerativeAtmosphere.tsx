import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion'

type AtmosphereKey = 'fog' | 'net' | 'waves'

const EFFECT_SCRIPTS: Record<AtmosphereKey, string> = {
  fog: '/vendor/vanta/vanta.fog.min.js',
  net: '/vendor/vanta/vanta.net.min.js',
  waves: '/vendor/vanta/vanta.waves.min.js',
}

const VANTA_KEYS: Record<AtmosphereKey, 'FOG' | 'NET' | 'WAVES'> = {
  fog: 'FOG',
  net: 'NET',
  waves: 'WAVES',
}

const EFFECT_OPTIONS: Record<AtmosphereKey, Record<string, unknown>> = {
  fog: { highlight: 0xc9a962, midtone: 0x8b7355, lowlight: 0x2d2d2d, base: 0xf5f0eb, blurFactor: 0.55, speed: 0.9, zoom: 1.05 },
  net: { color: 0xc9a962, backgroundColor: 0x1a1a1a, points: 12, maxDistance: 22, spacing: 17, showDots: false },
  waves: { color: 0x8b7355, waveHeight: 16, waveSpeed: 1.05, zoom: 0.92 },
}

// Loaded once per script, deduplicated for the whole session.
const scriptPromises = new Map<string, Promise<void>>()

function loadVantaScript(src: string): Promise<void> {
  let pending = scriptPromises.get(src)
  if (!pending) {
    pending = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => {
        scriptPromises.delete(src)
        reject(new Error(`Failed to load ${src}`))
      }
      document.head.appendChild(script)
    })
    scriptPromises.set(src, pending)
  }
  return pending
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

export function Demo4GenerativeAtmosphere() {
  const reducedMotion = useReducedMotion()
  const vantaRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<AtmosphereKey>('fog')
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading')

  useEffect(() => {
    document.title = 'Demo 4 — Generative Atmosphere · DRAPE Fashion OS'
  }, [])

  // Expose the bundled THREE before any Vanta script evaluates.
  useEffect(() => {
    window.THREE = THREE
  }, [])

  // Initialize or switch the active Vanta effect; destroy on cleanup.
  useEffect(() => {
    const el = vantaRef.current
    if (!el) return

    if (reducedMotion || !supportsWebGL()) {
      setStatus('fallback')
      return
    }

    let cancelled = false
    let instance: VantaEffect | null = null
    setStatus('loading')

    loadVantaScript(EFFECT_SCRIPTS[active])
      .then(() => {
        if (cancelled) return
        const ctor = window.VANTA?.[VANTA_KEYS[active]]
        if (typeof ctor !== 'function') {
          setStatus('fallback')
          return
        }
        instance = ctor({
          el,
          THREE: window.THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          ...EFFECT_OPTIONS[active],
        })
        if (cancelled) {
          instance?.destroy()
          instance = null
          return
        }
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('fallback')
      })

    return () => {
      cancelled = true
      instance?.destroy()
      instance = null
    }
  }, [active, reducedMotion])

  const isLight = status !== 'fallback' && active === 'fog'

  return (
    <div className="bg-background">
      {/* Immersive hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-labelledby="demo4-title">
        <div className="absolute inset-0" aria-hidden="true">
          <div
            ref={vantaRef}
            className="vanta-canvas"
            style={{ backgroundColor: isLight ? '#f5f0eb' : '#1a1a1a' }}
          />
          {status === 'fallback' && (
            <div className="absolute inset-0 bg-secondary" />
          )}
        </div>
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="container pt-8 flex items-center justify-between">
            <span className={`text-xs tracking-[0.3em] uppercase ${isLight ? 'text-text-muted' : 'text-white/60'}`}>Study 04</span>
            <Link
              to="/"
              className={`text-sm transition-colors ${isLight ? 'text-text-muted hover:text-primary' : 'text-white/60 hover:text-white'}`}
            >
              ← Back to overview
            </Link>
          </div>
        </div>
        <div className="container relative z-10 text-center py-28">
          <p className={`text-xs md:text-sm tracking-[0.35em] uppercase ${isLight ? 'text-text-muted' : 'text-white/60'}`}>
            Interaction Study · Generative
          </p>
          <h1 id="demo4-title" className={`font-serif text-5xl md:text-7xl lg:text-8xl mt-5 ${isLight ? 'text-text' : 'text-white'}`}>
            Generative Atmosphere
          </h1>
          <p className={`mt-6 text-lg md:text-xl max-w-2xl mx-auto ${isLight ? 'text-text-muted' : 'text-white/75'}`}>
            THREE.js scenes rendered by Vanta — fog, net and waves — with graceful fallbacks for WebGL-less browsers and reduced motion.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {(Object.keys(EFFECT_SCRIPTS) as AtmosphereKey[]).map(key => (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                aria-pressed={active === key}
                className={`px-5 py-2 rounded-full capitalize transition-colors ${
                  active === key
                    ? 'bg-primary text-white'
                    : isLight
                      ? 'border border-border text-text hover:bg-surface'
                      : 'border border-white/25 text-white/80 hover:bg-white/10'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
          <p
            className={`mt-4 font-mono text-xs ${isLight ? 'text-text-muted' : 'text-white/60'}`}
            aria-live="polite"
          >
            {status === 'loading'
              ? 'loading scene…'
              : status === 'fallback'
                ? reducedMotion
                  ? 'css fallback — reduced motion'
                  : 'css fallback — webgl unavailable'
                : `vanta.${active} · three r${THREE.REVISION}`}
          </p>
        </div>
      </section>

      {/* How the atmosphere is wired */}
      <section className="container py-24" aria-labelledby="demo4-info">
        <h2 id="demo4-info" className="font-serif text-3xl md:text-4xl text-text">How the atmosphere is wired</h2>
        <p className="mt-2 text-text-muted max-w-2xl">
          Three moving parts, none of them global side effects on the main site.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="demo-card-hover rounded-2xl border border-border bg-surface p-6">
            <span className="font-mono text-xs text-primary">01</span>
            <h3 className="mt-3 text-lg font-medium text-text">Bundled THREE</h3>
            <p className="mt-2 text-sm text-text-muted leading-relaxed">
              three.js ships as a real dependency and is code-split into this route's chunk, then assigned to
              <span className="font-mono"> window.THREE </span>
              before any Vanta script evaluates.
            </p>
          </div>
          <div className="demo-card-hover rounded-2xl border border-border bg-surface p-6">
            <span className="font-mono text-xs text-primary">02</span>
            <h3 className="mt-3 text-lg font-medium text-text">Runtime scripts</h3>
            <p className="mt-2 text-sm text-text-muted leading-relaxed">
              <span className="font-mono">vanta.fog / net / waves.min.js</span> are served from
              <span className="font-mono"> /vendor/vanta </span>
              and injected as classic script tags on demand — deduplicated per session.
            </p>
          </div>
          <div className="demo-card-hover rounded-2xl border border-border bg-surface p-6">
            <span className="font-mono text-xs text-primary">03</span>
            <h3 className="mt-3 text-lg font-medium text-text">Fallbacks</h3>
            <p className="mt-2 text-sm text-text-muted leading-relaxed">
              WebGL detection and prefers-reduced-motion switch to a CSS gradient; instances are destroyed on unmount
              and on every effect switch.
            </p>
          </div>
        </div>
      </section>

      {/* Outro */}
      <section className="container pb-24">
        <div className="rounded-2xl border border-border bg-surface text-center px-8 py-12">
          <p className="font-serif text-2xl md:text-3xl text-text">Atmosphere is a render target, not a backdrop image.</p>
          <p className="mt-3 text-sm text-text-muted">
            Study 04 of 05 —{' '}
            <Link to="/demo/5" className="text-primary hover:underline">next: the micro-interaction lab</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
