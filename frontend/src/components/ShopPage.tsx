import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { products, FILTER_CATEGORIES, formatPrice } from '../data/products'
import type { Product, Category } from '../data/products'
import { useWishlist } from '../context/WishlistContext'
import { MobileBottomNav } from './MobileBottomNav'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name'

const SORT_LABELS: Record<SortKey, string> = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  name: 'Alphabetical',
}

const PRICE_MIN = 1500
const PRICE_MAX = 9000

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className="w-5 h-5"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  )
}

// Image with a graceful fallback: if the photo ever fails to load, the
// gradient + product initial underneath shows instead of a broken image.
function ProductImage({ product, className }: { product: Product; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-primary-light via-surface to-background ${className ?? ''}`}>
      <span className="absolute inset-0 flex items-center justify-center font-serif text-6xl text-primary/30" aria-hidden="true">
        {product.name.charAt(0)}
      </span>
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        onError={e => {
          e.currentTarget.style.display = 'none'
        }}
      />
    </div>
  )
}

function ProductCard({ product, onQuickView }: { product: Product; onQuickView: (p: Product) => void }) {
  const { has, toggle } = useWishlist()
  const wished = has(product.id)
  return (
    <article data-testid="product-card" className="group break-inside-avoid mb-6 bg-surface rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-shadow duration-500">
      <div className="relative" style={{ aspectRatio: String(product.aspect) }}>
        <ProductImage product={product} className="absolute inset-0" />
        {product.badge && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
            {product.badge}
          </span>
        )}
        <button
          type="button"
          data-testid="wishlist-btn"
          onClick={() => toggle(product.id)}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wished}
          className={`absolute top-3 right-4 p-2 rounded-full backdrop-blur transition-all duration-300 ${
            wished ? 'bg-error/90 text-white scale-110' : 'bg-white/80 text-text hover:bg-white'
          }`}
        >
          <HeartIcon filled={wished} />
        </button>
        <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            type="button"
            data-testid="quick-view-btn"
            onClick={() => onQuickView(product)}
            className="w-full py-2.5 rounded-full bg-secondary/90 text-white text-sm font-medium backdrop-blur hover:bg-secondary transition-colors"
          >
            Quick view
          </button>
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-text-muted">{product.brand}</p>
        <h3 className="font-serif text-lg font-medium text-text mt-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <p className="font-medium text-text">{formatPrice(product.price)}</p>
          {product.compareAtPrice && (
            <p className="text-sm text-text-muted line-through">{formatPrice(product.compareAtPrice)}</p>
          )}
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          {product.colors.map(c => (
            <span key={c} className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: c }} aria-hidden="true" />
          ))}
        </div>
      </div>
    </article>
  )
}

function QuickViewModal({ product, onClose, testId }: { product: Product; onClose: () => void; testId?: string }) {
  const { has, toggle } = useWishlist()
  const wished = has(product.id)
  const panelRef = useRef<HTMLDivElement>(null)

  // ESC to close + scroll lock while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <div data-testid={testId} className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`${product.name} quick view`}>
      <div className="absolute inset-0 bg-secondary/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-surface rounded-2xl shadow-2xl outline-none animate-scale-in"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-surface/90 border border-border text-text-muted hover:text-text transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="grid md:grid-cols-2">
          <div className="relative">
            <ProductImage product={product} className="aspect-[3/4] md:aspect-auto md:h-full md:min-h-[420px]" />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                {product.badge}
              </span>
            )}
          </div>
          <div className="p-8 flex flex-col">
            <p className="text-xs uppercase tracking-widest text-text-muted">
              {product.brand} · {product.category}
            </p>
            <h3 className="font-serif text-3xl text-text mt-2">{product.name}</h3>
            <div className="mt-3 flex items-center gap-3">
              <p className="text-2xl font-medium text-text">{formatPrice(product.price)}</p>
              {product.compareAtPrice && (
                <p className="text-text-muted line-through">{formatPrice(product.compareAtPrice)}</p>
              )}
            </div>
            <p className="mt-4 text-sm text-text-muted leading-relaxed">{product.description}</p>
            <div className="mt-5">
              <p className="text-xs uppercase tracking-widest text-text-muted">Materials</p>
              <p className="text-sm text-text mt-1">{product.materials.join(' · ')}</p>
            </div>
            <div className="mt-5">
              <p className="text-xs uppercase tracking-widest text-text-muted">Colours</p>
              <div className="mt-2 flex items-center gap-2">
                {product.colors.map(c => (
                  <span key={c} className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: c }} aria-hidden="true" />
                ))}
              </div>
            </div>
            <div className="mt-auto pt-6">
              <button
                type="button"
                onClick={() => toggle(product.id)}
                aria-pressed={wished}
                className={`w-full py-3.5 rounded-full font-medium transition-colors ${
                  wished ? 'bg-error/90 text-white hover:bg-error' : 'bg-primary text-white hover:bg-primary-hover'
                }`}
              >
                {wished ? 'In your wishlist — tap to remove' : 'Add to wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface FilterPanelProps {
  category: 'All' | Category
  setCategory: (c: 'All' | Category) => void
  maxPrice: number
  setMaxPrice: (n: number) => void
  onSaleOnly: boolean
  setOnSaleOnly: (on: boolean) => void
  wishlistOnly: boolean
  setWishlistOnly: (on: boolean) => void
  wishlistCount: number
}

function FilterPanel({
  category,
  setCategory,
  maxPrice,
  setMaxPrice,
  onSaleOnly,
  setOnSaleOnly,
  wishlistOnly,
  setWishlistOnly,
  wishlistCount,
}: FilterPanelProps) {
  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Category</p>
        <div className="flex flex-wrap gap-2">
          {FILTER_CATEGORIES.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                category === c ? 'bg-primary text-white' : 'border border-border text-text hover:bg-surface'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Max price</p>
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={100}
          value={maxPrice}
          onChange={e => setMaxPrice(Number(e.target.value))}
          className="w-full accent-primary"
          aria-label="Maximum price"
        />
        <p className="mt-1 font-mono text-xs text-text">up to {formatPrice(maxPrice)}</p>
      </div>
      <div className="space-y-3 pt-1">
        <label className="flex items-center justify-between text-sm text-text">
          On sale only
          <input
            type="checkbox"
            checked={onSaleOnly}
            onChange={e => setOnSaleOnly(e.target.checked)}
            className="accent-primary w-4 h-4"
          />
        </label>
        <label className="flex items-center justify-between text-sm text-text">
          Wishlist only ({wishlistCount})
          <input
            type="checkbox"
            checked={wishlistOnly}
            onChange={e => setWishlistOnly(e.target.checked)}
            className="accent-primary w-4 h-4"
          />
        </label>
      </div>
    </div>
  )
}

export function ShopPage() {
  const { has, count } = useWishlist()
  const [searchParams, setSearchParams] = useSearchParams()
  const wishlistOnly = searchParams.get('view') === 'wishlist'

  const [category, setCategory] = useState<'All' | Category>('All')
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX)
  const [onSaleOnly, setOnSaleOnly] = useState(false)
  const [sort, setSort] = useState<SortKey>('featured')
  const [quickView, setQuickView] = useState<Product | null>(null)

  useEffect(() => {
    document.title = 'Shop · DRAPE Fashion OS'
  }, [])

  // Wishlist view is a URL param, so the bottom nav can deep-link into it.
  const setWishlistOnly = (on: boolean) => {
    const next = new URLSearchParams(searchParams)
    if (on) {
      next.set('view', 'wishlist')
    } else {
      next.delete('view')
    }
    setSearchParams(next, { replace: true })
  }

  const visible = useMemo(() => {
    const filtered = products.filter(
      p =>
        (category === 'All' || p.category === category) &&
        p.price <= maxPrice &&
        (!onSaleOnly || p.compareAtPrice !== undefined) &&
        (!wishlistOnly || has(p.id))
    )
    switch (sort) {
      case 'price-asc':
        return [...filtered].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...filtered].sort((a, b) => b.price - a.price)
      case 'name':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
      default:
        return filtered
    }
  }, [category, maxPrice, onSaleOnly, sort, wishlistOnly, has])

  const resetFilters = () => {
    setCategory('All')
    setMaxPrice(PRICE_MAX)
    setOnSaleOnly(false)
    setSort('featured')
    if (wishlistOnly) setWishlistOnly(false)
  }

  return (
    <div className="bg-background min-h-screen pb-16 md:pb-0">
      {/* Page header */}
      <section className="border-b border-border bg-surface">
        <div className="container py-12">
          <div className="flex items-center justify-between">
            <p className="text-xs tracking-[0.3em] uppercase text-text-muted">Phase 9 · The Shop</p>
            <a href="/" className="text-sm text-text-muted hover:text-primary transition-colors">← Home</a>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-text mt-3">Every thread, on one shelf</h1>
          <p className="mt-3 text-text-muted max-w-xl">
            Sixteen pieces from five ateliers — filter, sort and heart what you love. Your wishlist survives reloads.
          </p>
        </div>
      </section>

      <div className="container py-10 lg:grid lg:grid-cols-[250px_1fr] lg:gap-10">
        {/* Sticky filters — desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FilterPanel
              category={category}
              setCategory={setCategory}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              onSaleOnly={onSaleOnly}
              setOnSaleOnly={setOnSaleOnly}
              wishlistOnly={wishlistOnly}
              setWishlistOnly={setWishlistOnly}
              wishlistCount={count}
            />
          </div>
        </aside>

        {/* Sticky filter chips — mobile */}
        <div className="lg:hidden sticky top-16 z-30 -mx-6 px-6 py-3 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center gap-2 overflow-x-auto">
            {FILTER_CATEGORIES.map(c => (
              <button
                key={c}
                type="button"
                data-testid={`category-${c.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm transition-colors ${
                  category === c ? 'bg-primary text-white' : 'border border-border text-text bg-surface'
                }`}
              >
                {c}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setWishlistOnly(!wishlistOnly)}
              aria-pressed={wishlistOnly}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm transition-colors ${
                wishlistOnly ? 'bg-error/90 text-white' : 'border border-border text-text bg-surface'
              }`}
            >
              ♥ {count}
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-text-muted">
              {visible.length} piece{visible.length === 1 ? '' : 's'}
            </p>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              data-testid="sort-select-mobile"
              className="border border-border rounded-lg px-2 py-1.5 bg-surface text-text text-xs"
              aria-label="Sort products"
            >
              {Object.entries(SORT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="hidden lg:flex items-center justify-between mb-6">
            <p className="text-sm text-text-muted">
              {visible.length} piece{visible.length === 1 ? '' : 's'}
              {wishlistOnly ? ' in your wishlist' : ''}
              {onSaleOnly ? ' on sale' : ''}
            </p>
            <label className="flex items-center gap-2 text-sm text-text-muted">
              Sort
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortKey)}
                data-testid="sort-select"
                className="border border-border rounded-lg px-3 py-2 bg-surface text-text text-sm"
                aria-label="Sort products"
              >
                {Object.entries(SORT_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </label>
          </div>

          {visible.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-serif text-2xl text-text">Nothing matches those filters.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div data-testid="product-grid" className="columns-1 sm:columns-2 xl:columns-3 gap-6">
              {visible.map(p => (
                <ProductCard key={p.id} product={p} onQuickView={setQuickView} />
              ))}
            </div>
          )}
        </div>
      </div>

      {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} testId="quick-view-modal" />}
      <MobileBottomNav wishlistCount={count} testId="mobile-bottom-nav" />
    </div>
  )
}