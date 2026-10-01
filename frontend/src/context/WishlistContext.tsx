import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

const STORAGE_KEY = 'drape-wishlist'

function loadWishlist(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

interface WishlistContextValue {
  ids: Set<string>
  has: (id: string) => boolean
  toggle: (id: string) => void
  count: number
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(() => new Set(loadWishlist()))

  // Persist to localStorage; if storage is unavailable the wishlist
  // quietly degrades to in-memory only.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
    } catch {
      /* ignore */
    }
  }, [ids])

  const toggle = useCallback((id: string) => {
    setIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const has = useCallback((id: string) => ids.has(id), [ids])
  const count = ids.size

  return <WishlistContext.Provider value={{ ids, has, toggle, count }}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return ctx
}