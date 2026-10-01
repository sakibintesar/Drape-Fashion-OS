import { useEffect, useRef, useCallback, useState } from 'react'
import Lenis from 'lenis'
import type { ScrollToOptions } from 'lenis'

// Hoisted so the default easing keeps a stable identity across renders
// (it is part of the effect dependency list below).
const DEFAULT_EASING = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))

interface UseLenisOptions {
  lerp?: number
  duration?: number
  easing?: (t: number) => number
  orientation?: 'vertical' | 'horizontal'
  gestureOrientation?: 'vertical' | 'horizontal' | 'both'
  smoothWheel?: boolean
  wheelMultiplier?: number
  syncTouch?: boolean
  touchMultiplier?: number
  infinite?: boolean
  autoRaf?: boolean
}

export function useLenis(options: UseLenisOptions = {}) {
  const lenisInstanceRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number | undefined>(undefined)
  const [lenis, setLenis] = useState<Lenis | null>(null)

  const {
    lerp = 0.1,
    duration = 1.2,
    easing = DEFAULT_EASING,
    orientation = 'vertical',
    gestureOrientation = 'vertical',
    smoothWheel = true,
    wheelMultiplier = 1,
    syncTouch = false,
    touchMultiplier = 2,
    infinite = false,
    autoRaf = true,
  } = options

  useEffect(() => {
    const instance = new Lenis({
      lerp,
      duration,
      easing,
      orientation,
      gestureOrientation,
      smoothWheel,
      wheelMultiplier,
      syncTouch,
      touchMultiplier,
      infinite,
    })
    lenisInstanceRef.current = instance
    // Expose through state so consumers re-render once the instance exists.
    setLenis(instance)

    if (autoRaf) {
      const raf = (time: number) => {
        instance.raf(time)
        rafRef.current = requestAnimationFrame(raf)
      }
      rafRef.current = requestAnimationFrame(raf)
    }

    return () => {
      instance.destroy()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lenisInstanceRef.current = null
      setLenis(null)
    }
  }, [lerp, duration, easing, orientation, gestureOrientation, smoothWheel, wheelMultiplier, syncTouch, touchMultiplier, infinite, autoRaf])

  const scrollTo = useCallback((target: string | number | HTMLElement, scrollOptions?: ScrollToOptions) => {
    lenisInstanceRef.current?.scrollTo(target, scrollOptions)
  }, [])

  const start = useCallback(() => lenisInstanceRef.current?.start(), [])
  const stop = useCallback(() => lenisInstanceRef.current?.stop(), [])

  return {
    lenis,
    scrollTo,
    start,
    stop,
  }
}

export function useLenisScroll() {
  const { lenis } = useLenis()
  const [scrollY, setScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const lastScrollY = useRef(0)

  useEffect(() => {
    if (!lenis) return

    // Lenis 'scroll' callbacks receive the instance itself.
    const onScroll = () => {
      const currentY = lenis.scroll
      setScrollY(currentY)
      setScrollDirection(currentY > lastScrollY.current ? 'down' : 'up')
      lastScrollY.current = currentY
    }

    lenis.on('scroll', onScroll)
    return () => lenis.off('scroll', onScroll)
  }, [lenis])

  return { scrollY, scrollDirection, lenis }
}