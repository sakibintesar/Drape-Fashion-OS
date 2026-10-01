import { useEffect, useRef, useState, useCallback } from 'react'

interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
  } = options

  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLElement | null>(null)

  const setRef = useCallback((node: HTMLElement | null) => {
    elementRef.current = node
  }, [])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce])

  return { ref: setRef, isVisible }
}

export function useStaggeredReveal(
  count: number,
  options: ScrollRevealOptions & { staggerDelay?: number } = {}
) {
  const { staggerDelay = 80, ...revealOptions } = options
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set())
  const elementRefs = useRef<(HTMLElement | null)[]>(new Array(count).fill(null))

  const setRef = useCallback((index: number) => (node: HTMLElement | null) => {
    elementRefs.current[index] = node
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number((entry.target as HTMLElement).dataset.revealIndex)
          if (entry.isIntersecting) {
            setVisibleIndices(prev => {
              const next = new Set(prev)
              next.add(index)
              return next
            })
            if (revealOptions.triggerOnce !== false) {
              observer.unobserve(entry.target)
            }
          } else if (revealOptions.triggerOnce === false) {
            setVisibleIndices(prev => {
              const next = new Set(prev)
              next.delete(index)
              return next
            })
          }
        })
      },
      { threshold: revealOptions.threshold, rootMargin: revealOptions.rootMargin }
    )

    elementRefs.current.forEach((el, i) => {
      if (el) {
        el.dataset.revealIndex = String(i)
        observer.observe(el)
      }
    })

    return () => observer.disconnect()
  }, [count, revealOptions.threshold, revealOptions.rootMargin, revealOptions.triggerOnce])

  return { refs: setRef, visibleIndices }
}