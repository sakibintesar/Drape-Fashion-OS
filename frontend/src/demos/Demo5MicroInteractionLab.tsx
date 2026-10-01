import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion'

const INSTALL_COMMAND = 'npm install @drape/fashion-os'

const LAB_ITEMS = [
  { name: 'Magnetic button', detail: 'The button lerps toward your cursor while it is inside the field, then eases home on leave.' },
  { name: '3D tilt card', detail: 'rotateX/rotateY track the pointer position; a glare highlight follows the light.' },
  { name: 'Ripple', detail: 'A scale-fade disc spawns at the press point and evaporates in 400ms.' },
  { name: 'Spring toggle', detail: 'The knob travels on an overshooting cubic-bezier — flick it and watch it settle.' },
  { name: 'Copy feedback', detail: 'Clipboard write with a transient confirmation state — no alert dialogs.' },
  { name: 'Cursor glow', detail: 'A lerped radial gradient trails the pointer — fine pointers only, skipped for reduced motion.' },
]

export function Demo5MicroInteractionLab() {
  const reducedMotion = useReducedMotion()
  const magnetFieldRef = useRef<HTMLDivElement>(null)
  const magnetBtnRef = useRef<HTMLButtonElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const copyTimeoutRef = useRef<number | undefined>(undefined)

  const [finePointer, setFinePointer] = useState(false)
  const [copied, setCopied] = useState(false)
  const [toggled, setToggled] = useState(false)

  useEffect(() => {
    document.title = 'Demo 5 — Micro-interaction Lab · DRAPE Fashion OS'
  }, [])

  // Cursor glow only for fine pointers (mouse/trackpad), never reduced motion.
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    setFinePointer(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setFinePointer(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Magnetic button — lerps toward the pointer, eases home on leave.
  useEffect(() => {
    const field = magnetFieldRef.current
    const button = magnetBtnRef.current
    if (!field || !button || reducedMotion) return
    let rafId = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    const tick = () => {
      cx += (tx - cx) * 0.18
      cy += (ty - cy) * 0.18
      button.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`
      rafId = requestAnimationFrame(tick)
    }
    const onMove = (e: PointerEvent) => {
      const rect = field.getBoundingClientRect()
      tx = (e.clientX - (rect.left + rect.width / 2)) * 0.3
      ty = (e.clientY - (rect.top + rect.height / 2)) * 0.3
    }
    const onLeave = () => {
      tx = 0
      ty = 0
    }
    field.addEventListener('pointermove', onMove)
    field.addEventListener('pointerleave', onLeave)
    rafId = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafId)
      field.removeEventListener('pointermove', onMove)
      field.removeEventListener('pointerleave', onLeave)
      button.style.transform = ''
    }
  }, [reducedMotion])

  // 3D tilt card — rotate toward the pointer, glare follows the light.
  useEffect(() => {
    const card = tiltRef.current
    if (!card || reducedMotion) return
    const onMove = (e: PointerEvent) => {
      const rect = card.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      card.style.transform = `rotateX(${((0.5 - py) * 14).toFixed(2)}deg) rotateY(${((px - 0.5) * 14).toFixed(2)}deg)`
      card.style.setProperty('--glare-x', `${(px * 100).toFixed(1)}%`)
      card.style.setProperty('--glare-y', `${(py * 100).toFixed(1)}%`)
    }
    const onLeave = () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)'
    }
    card.addEventListener('pointermove', onMove)
    card.addEventListener('pointerleave', onLeave)
    return () => {
      card.removeEventListener('pointermove', onMove)
      card.removeEventListener('pointerleave', onLeave)
    }
  }, [reducedMotion])

  // Cursor glow — lerped follower loop.
  useEffect(() => {
    const glow = glowRef.current
    if (!glow || !finePointer || reducedMotion) return
    let rafId = 0
    let tx = -300
    let ty = -300
    let x = -300
    let y = -300
    const tick = () => {
      x += (tx - x) * 0.12
      y += (ty - y) * 0.12
      glow.style.transform = `translate(${(x - 128).toFixed(1)}px, ${(y - 128).toFixed(1)}px)`
      rafId = requestAnimationFrame(tick)
    }
    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    rafId = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onMove)
    }
  }, [finePointer, reducedMotion])

  // Clear any pending copy-feedback timer on unmount.
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current)
    }
  }, [])

  const spawnRipple = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2.2
    const disc = document.createElement('span')
    disc.className = 'animate-scale-fade'
    disc.style.position = 'absolute'
    disc.style.width = `${size}px`
    disc.style.height = `${size}px`
    disc.style.left = `${e.clientX - rect.left - size / 2}px`
    disc.style.top = `${e.clientY - rect.top - size / 2}px`
    disc.style.borderRadius = '9999px'
    disc.style.background = 'rgba(255,255,255,0.55)'
    disc.style.pointerEvents = 'none'
    button.appendChild(disc)
    window.setTimeout(() => disc.remove(), 480)
  }

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND)
      setCopied(true)
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="bg-background">
      {/* Hero */}
      <section
        className="relative min-h-[55vh] flex items-center justify-center overflow-hidden demo-hero-gradient"
        aria-labelledby="demo5-title"
      >
        <div className="absolute top-0 left-0 right-0 z-10">
          <div className="container pt-8 flex items-center justify-between">
            <span className="text-xs tracking-[0.3em] uppercase text-text-muted">Study 05</span>
            <Link to="/" className="text-sm text-text-muted hover:text-primary transition-colors">
              ← Back to overview
            </Link>
          </div>
        </div>
        <div className="container relative z-10 text-center py-20">
          <p className="text-xs md:text-sm tracking-[0.35em] uppercase text-text-muted">Interaction Study · Detail</p>
          <h1 id="demo5-title" className="font-serif text-5xl md:text-7xl lg:text-8xl text-text mt-5">
            Micro-interaction Lab
          </h1>
          <p className="mt-6 text-lg md:text-xl text-text-muted max-w-2xl mx-auto">
            Six small mechanics, each doing one job well. Everything below responds to your pointer — and to nothing else.
          </p>
        </div>
      </section>

      {/* Lab grid */}
      <section className="container py-24" aria-labelledby="demo5-lab">
        <h2 id="demo5-lab" className="font-serif text-3xl md:text-4xl text-text">The lab</h2>
        <p className="mt-2 text-text-muted max-w-2xl">Try each one — these are live components, not recordings.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* 01 — Magnetic button */}
          <div className="demo-card-hover rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-text">Magnetic button</h3>
              <span className="font-mono text-xs text-primary">01</span>
            </div>
            <p className="mt-1 text-sm text-text-muted">{LAB_ITEMS[0].detail}</p>
            <div
              ref={magnetFieldRef}
              className="mt-5 h-44 flex items-center justify-center rounded-xl border border-border bg-primary-light/40 overflow-hidden"
            >
              <button
                ref={magnetBtnRef}
                type="button"
                className="px-10 py-5 rounded-full bg-primary text-white font-medium shadow-lg will-change-transform"
              >
                Pull me
              </button>
            </div>
          </div>

          {/* 02 — 3D tilt card */}
          <div className="demo-card-hover rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-text">3D tilt card</h3>
              <span className="font-mono text-xs text-primary">02</span>
            </div>
            <p className="mt-1 text-sm text-text-muted">{LAB_ITEMS[1].detail}</p>
            <div className="perspective-1000 mt-5">
              <div
                ref={tiltRef}
                className="preserve-3d relative rounded-xl border border-border bg-primary-light/40 p-8 will-change-transform"
                style={{ transition: 'transform 140ms var(--ease-out-cubic)' }}
              >
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(201,169,98,0.25), transparent 55%)',
                  }}
                  aria-hidden="true"
                />
                <p className="font-serif text-2xl text-text">Editorial card</p>
                <p className="mt-2 text-sm text-text-muted">Move your pointer across the surface.</p>
              </div>
            </div>
          </div>

          {/* 03 — Ripple */}
          <div className="demo-card-hover rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-text">Ripple</h3>
              <span className="font-mono text-xs text-primary">03</span>
            </div>
            <p className="mt-1 text-sm text-text-muted">{LAB_ITEMS[2].detail}</p>
            <div className="mt-5 h-44 flex items-center justify-center rounded-xl border border-border bg-primary-light/40">
              <button
                type="button"
                onPointerDown={spawnRipple}
                className="relative overflow-hidden px-10 py-5 rounded-full bg-primary text-white font-medium shadow-lg"
              >
                Press me
              </button>
            </div>
          </div>

          {/* 04 — Spring toggle */}
          <div className="demo-card-hover rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-text">Spring toggle</h3>
              <span className="font-mono text-xs text-primary">04</span>
            </div>
            <p className="mt-1 text-sm text-text-muted">{LAB_ITEMS[3].detail}</p>
            <div className="mt-5 h-44 flex items-center justify-center gap-4 rounded-xl border border-border bg-primary-light/40">
              <button
                type="button"
                role="switch"
                aria-checked={toggled}
                aria-label="Spring toggle"
                onClick={() => setToggled(v => !v)}
                className={`relative w-16 h-9 rounded-full transition-colors duration-300 ${toggled ? 'bg-primary' : 'bg-border'}`}
              >
                <span
                  className="absolute top-1 left-1 w-7 h-7 rounded-full bg-white shadow-md"
                  style={{ transform: `translateX(${toggled ? 28 : 0}px)`, transition: 'transform 420ms var(--ease-spring)' }}
                />
              </button>
              <span className="font-mono text-xs text-text-muted">{toggled ? 'on' : 'off'}</span>
            </div>
          </div>

          {/* 05 — Copy feedback */}
          <div className="demo-card-hover rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-text">Copy feedback</h3>
              <span className="font-mono text-xs text-primary">05</span>
            </div>
            <p className="mt-1 text-sm text-text-muted">{LAB_ITEMS[4].detail}</p>
            <div className="mt-5 h-44 flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-primary-light/40 px-4">
              <code className="font-mono text-xs md:text-sm text-text bg-surface border border-border rounded-lg px-3 py-2">
                {INSTALL_COMMAND}
              </code>
              <button
                type="button"
                onClick={onCopy}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  copied ? 'bg-success text-white' : 'bg-primary text-white hover:bg-primary-hover'
                }`}
              >
                {copied ? 'Copied ✓' : 'Copy command'}
              </button>
              <span className="text-xs text-text-muted h-4" aria-live="polite">
                {copied ? 'Install command is on your clipboard.' : ''}
              </span>
            </div>
          </div>

          {/* 06 — Cursor glow */}
          <div className="demo-card-hover rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-text">Cursor glow</h3>
              <span className="font-mono text-xs text-primary">06</span>
            </div>
            <p className="mt-1 text-sm text-text-muted">{LAB_ITEMS[5].detail}</p>
            <div className="mt-5 h-44 flex items-center justify-center rounded-xl border border-border bg-primary-light/40 px-6 text-center">
              {finePointer && !reducedMotion ? (
                <p className="text-sm text-text-muted">The warm glow trailing your cursor is live right now — keep moving.</p>
              ) : (
                <p className="text-sm text-text-muted">
                  {reducedMotion ? 'Disabled for reduced motion.' : 'Live on fine pointers — try a mouse or trackpad.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {finePointer && !reducedMotion && (
          <div
            ref={glowRef}
            className="fixed top-0 left-0 z-40 pointer-events-none w-64 h-64 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(201,169,98,0.28), transparent 65%)',
              filter: 'blur(28px)',
            }}
            aria-hidden="true"
          />
        )}
      </section>

      {/* Outro */}
      <section className="container pb-24">
        <div className="rounded-2xl bg-secondary text-center px-8 py-14">
          <p className="font-serif text-3xl md:text-4xl text-white">Small hinges swing big doors.</p>
          <p className="mt-3 text-sm text-white/70">Study 05 of 05 — thanks for scrolling through all of them.</p>
        </div>
      </section>
    </div>
  )
}
