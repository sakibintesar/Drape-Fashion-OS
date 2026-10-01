import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  color: string
  grabbed: boolean
}

const PALETTE = ['#8b7355', '#c9a962', '#2d2d2d', '#b5a488', '#6d5c42', '#e0d3c0', '#a8873f']
const GRAVITY_MIN = 0
const GRAVITY_MAX = 2400
const RESTITUTION_MIN = 0.3
const RESTITUTION_MAX = 1

export function Demo3PhysicsPlayground() {
  const reducedMotion = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<{ setCount: (n: number) => void; reset: () => void; setPaused: (p: boolean) => void } | null>(null)
  const controlsRef = useRef({ gravity: 950, restitution: 0.78 })

  const [gravity, setGravity] = useState(950)
  const [restitution, setRestitution] = useState(0.78)
  const [count, setCount] = useState(26)
  const [running, setRunning] = useState(!reducedMotion)
  const [fps, setFps] = useState(0)

  useEffect(() => {
    document.title = 'Demo 3 — Physics Playground · DRAPE Fashion OS'
  }, [])

  // Keep the live control values reachable from inside the animation loop.
  useEffect(() => {
    controlsRef.current = { gravity, restitution }
  })

  // Pause the simulation for reduced motion (Play opts back in).
  useEffect(() => {
    if (reducedMotion) setRunning(false)
  }, [reducedMotion])

  // Apply ball-count changes to the running engine.
  useEffect(() => {
    engineRef.current?.setCount(count)
  }, [count])

  // Simulation engine: canvas sizing, physics, pointer interaction, loop.
  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = wrap.clientWidth
    let height = wrap.clientHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let paused = false

    const balls: Ball[] = []

    const scatter = (n: number) => {
      balls.length = 0
      for (let i = 0; i < n; i++) {
        const r = 12 + Math.random() * 22
        balls.push({
          x: r + Math.random() * Math.max(1, width - r * 2),
          y: Math.random() * Math.max(1, height * 0.4),
          vx: (Math.random() - 0.5) * 240,
          vy: (Math.random() - 0.5) * 120,
          r,
          color: PALETTE[i % PALETTE.length],
          grabbed: false,
        })
      }
    }
    scatter(count)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = 'rgba(139,115,85,0.25)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, height - 0.5)
      ctx.lineTo(width, height - 0.5)
      ctx.stroke()
      for (const b of balls) {
        ctx.globalAlpha = b.grabbed ? 0.85 : 0.92
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fillStyle = b.color
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.beginPath()
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.35, b.r * 0.28, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.fill()
        if (b.grabbed) {
          ctx.strokeStyle = 'rgba(201,169,98,0.9)'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(b.x, b.y, b.r + 3, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
    }

    const step = (dt: number) => {
      const g = controlsRef.current.gravity
      const e = controlsRef.current.restitution
      for (const b of balls) {
        if (b.grabbed) continue
        b.vy += g * dt
        b.x += b.vx * dt
        b.y += b.vy * dt
        if (b.x - b.r < 0) { b.x = b.r; b.vx = -b.vx * e }
        else if (b.x + b.r > width) { b.x = width - b.r; b.vx = -b.vx * e }
        if (b.y - b.r < 0) { b.y = b.r; b.vy = -b.vy * e }
        else if (b.y + b.r > height) {
          b.y = height - b.r
          b.vy = -b.vy * e
          b.vx *= 0.985
          if (Math.abs(b.vy) < 26) b.vy = 0
        }
      }
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const a = balls[i]
          const b = balls[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.hypot(dx, dy)
          const min = a.r + b.r
          if (dist <= 0 || dist >= min) continue
          const nx = dx / dist
          const ny = dy / dist
          const overlap = min - dist
          const im1 = a.grabbed ? 0 : 1 / (a.r * a.r)
          const im2 = b.grabbed ? 0 : 1 / (b.r * b.r)
          const imSum = im1 + im2
          if (imSum <= 0) continue
          a.x -= nx * overlap * (im1 / imSum)
          a.y -= ny * overlap * (im1 / imSum)
          b.x += nx * overlap * (im2 / imSum)
          b.y += ny * overlap * (im2 / imSum)
          const rvx = b.vx - a.vx
          const rvy = b.vy - a.vy
          const velAlongNormal = rvx * nx + rvy * ny
          if (velAlongNormal < 0) {
            const impulse = (-(1 + e) * velAlongNormal) / imSum
            a.vx -= impulse * im1 * nx
            a.vy -= impulse * im1 * ny
            b.vx += impulse * im2 * nx
            b.vy += impulse * im2 * ny
          }
        }
      }
    }

    // Pointer interaction — grab the topmost ball under the cursor, throw on release.
    let dragBall: Ball | null = null
    let prev = { x: 0, y: 0, t: 0 }
    const pointerVel = { x: 0, y: 0 }
    const toLocal = (evt: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: ((evt.clientX - rect.left) / rect.width) * width,
        y: ((evt.clientY - rect.top) / rect.height) * height,
      }
    }
    const onPointerDown = (evt: PointerEvent) => {
      const p = toLocal(evt)
      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i]
        if (Math.hypot(p.x - b.x, p.y - b.y) <= b.r + 6) {
          dragBall = b
          b.grabbed = true
          b.vx = 0
          b.vy = 0
          prev = { x: p.x, y: p.y, t: performance.now() }
          pointerVel.x = 0
          pointerVel.y = 0
          canvas.setPointerCapture(evt.pointerId)
          draw()
          return
        }
      }
    }
    const onPointerMove = (evt: PointerEvent) => {
      if (!dragBall) return
      const p = toLocal(evt)
      const now = performance.now()
      const dt = Math.max(8, now - prev.t) / 1000
      pointerVel.x = pointerVel.x * 0.5 + ((p.x - prev.x) / dt) * 0.5
      pointerVel.y = pointerVel.y * 0.5 + ((p.y - prev.y) / dt) * 0.5
      dragBall.x = Math.min(Math.max(p.x, dragBall.r), width - dragBall.r)
      dragBall.y = Math.min(Math.max(p.y, dragBall.r), height - dragBall.r)
      prev = { x: p.x, y: p.y, t: now }
      draw()
    }
    const onPointerUp = (evt: PointerEvent) => {
      if (!dragBall) return
      dragBall.grabbed = false
      dragBall.vx = Math.max(-2400, Math.min(2400, pointerVel.x))
      dragBall.vy = Math.max(-2400, Math.min(2400, pointerVel.y))
      dragBall = null
      if (canvas.hasPointerCapture(evt.pointerId)) canvas.releasePointerCapture(evt.pointerId)
      draw()
    }
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)

    // Engine API for the React controls.
    engineRef.current = {
      setCount: (n: number) => {
        if (n === balls.length) return
        while (balls.length > n) balls.pop()
        while (balls.length < n) {
          const i = balls.length
          const r = 12 + Math.random() * 22
          balls.push({
            x: r + Math.random() * Math.max(1, width - r * 2),
            y: Math.random() * Math.max(1, height * 0.4),
            vx: (Math.random() - 0.5) * 240,
            vy: (Math.random() - 0.5) * 120,
            r,
            color: PALETTE[i % PALETTE.length],
            grabbed: false,
          })
        }
        draw()
      },
      reset: () => {
        scatter(balls.length)
        draw()
      },
      setPaused: (p: boolean) => {
        paused = p
      },
    }

    const resize = () => {
      width = wrap.clientWidth
      height = wrap.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      for (const b of balls) {
        b.x = Math.min(b.x, Math.max(b.r, width - b.r))
        b.y = Math.min(b.y, Math.max(b.r, height - b.r))
      }
      draw()
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    let rafId = 0
    let last = performance.now()
    let frames = 0
    let elapsed = 0
    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick)
      const dt = Math.min((now - last) / 1000, 0.032)
      last = now
      if (!paused) step(dt)
      draw()
      frames++
      elapsed += dt
      if (elapsed >= 0.5) {
        setFps(Math.round(frames / elapsed))
        frames = 0
        elapsed = 0
      }
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      engineRef.current = null
    }
  }, [])

  // Mirror React running state into the engine.
  useEffect(() => {
    engineRef.current?.setPaused(!running)
  }, [running])

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative min-h-[45vh] flex items-center justify-center overflow-hidden demo-hero-gradient" aria-labelledby="demo3-title">
        <div className="absolute top-0 left-0 right-0 z-10">
          <div className="container pt-8 flex items-center justify-between">
            <span className="text-xs tracking-[0.3em] uppercase text-text-muted">Study 03</span>
            <Link to="/" className="text-sm text-text-muted hover:text-primary transition-colors">
              ← Back to overview
            </Link>
          </div>
        </div>
        <div className="container relative z-10 text-center py-16">
          <p className="text-xs md:text-sm tracking-[0.35em] uppercase text-text-muted">Interaction Study · Physics</p>
          <h1 id="demo3-title" className="font-serif text-5xl md:text-7xl lg:text-8xl text-text mt-5">
            Physics Playground
          </h1>
          <p className="mt-6 text-lg md:text-xl text-text-muted max-w-2xl mx-auto">
            A hand-rolled 2D engine — gravity, restitution, collisions and drag-to-throw. Grab a ball and throw it.
          </p>
        </div>
      </section>

      {/* Playground */}
      <section className="container pb-24" aria-labelledby="demo3-controls">
        <h2 id="demo3-controls" className="font-serif text-3xl md:text-4xl text-text">Tune the engine</h2>
        <p className="mt-2 text-text-muted max-w-2xl">
          Sliders write straight into the simulation. Drag balls with the pointer — velocity at release becomes the throw.
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <label className="block">
              <span className="flex items-center justify-between text-sm text-text-muted">
                Gravity
                <span className="font-mono text-xs text-text">{gravity} px/s²</span>
              </span>
              <input
                type="range"
                min={GRAVITY_MIN}
                max={GRAVITY_MAX}
                step={20}
                value={gravity}
                onChange={e => setGravity(Number(e.target.value))}
                className="w-full mt-2 accent-primary"
                aria-label="Gravity"
              />
            </label>
            <label className="block">
              <span className="flex items-center justify-between text-sm text-text-muted">
                Restitution
                <span className="font-mono text-xs text-text">{restitution.toFixed(2)}</span>
              </span>
              <input
                type="range"
                min={RESTITUTION_MIN}
                max={RESTITUTION_MAX}
                step={0.02}
                value={restitution}
                onChange={e => setRestitution(Number(e.target.value))}
                className="w-full mt-2 accent-primary"
                aria-label="Restitution"
              />
            </label>
            <label className="block">
              <span className="flex items-center justify-between text-sm text-text-muted">
                Ball count
                <span className="font-mono text-xs text-text">{count}</span>
              </span>
              <input
                type="range"
                min={6}
                max={60}
                step={1}
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="w-full mt-2 accent-primary"
                aria-label="Ball count"
              />
            </label>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setRunning(r => !r)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                running ? 'border border-border text-text hover:bg-background' : 'bg-primary text-white hover:bg-primary-hover'
              }`}
            >
              {running ? 'Pause' : 'Play'}
            </button>
            <button
              type="button"
              onClick={() => engineRef.current?.reset()}
              className="px-6 py-2.5 rounded-full text-sm font-medium border border-border text-text hover:bg-background transition-colors"
            >
              Reset
            </button>
            <span className="font-mono text-xs text-text-muted ml-auto" aria-live="polite">
              {fps} fps · {count} balls
            </span>
          </div>
          <div ref={wrapRef} className="mt-6 h-[480px] md:h-[560px] rounded-xl border border-border bg-primary-light/30">
            <canvas
              ref={canvasRef}
              className="block rounded-xl"
              style={{ touchAction: 'none', cursor: 'grab' }}
              aria-label="Physics ball pit — drag balls to throw them"
            />
          </div>
          {reducedMotion && (
            <p className="mt-4 text-xs text-text-muted">
              Reduced motion detected — the simulation starts paused. Press Play to opt in.
            </p>
          )}
        </div>
      </section>

      {/* Outro */}
      <section className="container pb-24">
        <div className="rounded-2xl border border-border bg-surface text-center px-8 py-12">
          <p className="font-serif text-2xl md:text-3xl text-text">Every engine is just integration by parts.</p>
          <p className="mt-3 text-sm text-text-muted">
            Study 03 of 05 —{' '}
            <Link to="/demo/4" className="text-primary hover:underline">next: the generative atmosphere</Link>
          </p>
        </div>
      </section>
    </div>
  )
}

