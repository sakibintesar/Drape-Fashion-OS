import { Link, useNavigate } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'

export function Header() {
  const { count } = useWishlist()
  const navigate = useNavigate()

  return (
    <header className="border-b border-border bg-surface sticky top-0 z-50">
      <nav className="container flex items-center justify-between h-16" aria-label="Main navigation">
        <Link to="/" className="font-serif text-2xl font-medium text-text" aria-label="DRAPE Home">
          DRAPE
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/shop" className="text-sm font-medium text-text-muted hover:text-text transition-colors">
            Shop
          </Link>
          <a href="/about" className="text-sm font-medium text-text-muted hover:text-text transition-colors">
            Our Story
          </a>
          <a href="/contact" className="text-sm font-medium text-text-muted hover:text-text transition-colors">
            Contact
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-text-muted hover:text-text transition-colors" aria-label="Search">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button
            className="relative p-2 text-text-muted hover:text-text transition-colors"
            aria-label={`Wishlist (${count} items)`}
            onClick={() => navigate('/shop?view=wishlist')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span data-testid="wishlist-count" className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs font-medium rounded-full flex items-center justify-center">
              {count}
            </span>
          </button>
          <button className="relative p-2 text-text-muted hover:text-text transition-colors" aria-label="Cart (0 items)">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs font-medium rounded-full flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </nav>
    </header>
  )
}