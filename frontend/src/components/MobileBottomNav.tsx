import { Link, useLocation } from 'react-router-dom'
import type { ReactElement } from 'react'

const ICONS: Record<string, ReactElement> = {
  home: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"
    />
  ),
  shop: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
    />
  ),
  heart: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  ),
  sparkles: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
    />
  ),
}

const ITEMS = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/shop', label: 'Shop', icon: 'shop' },
  { to: '/shop?view=wishlist', label: 'Wishlist', icon: 'heart' },
  { to: '/demo/1', label: 'Demos', icon: 'sparkles' },
]

export function MobileBottomNav({ wishlistCount, testId }: { wishlistCount: number; testId?: string }) {
  const { pathname, search } = useLocation()
  const wishlistView = pathname.startsWith('/shop') && new URLSearchParams(search).get('view') === 'wishlist'

  const isActive = (to: string) => {
    if (to === '/') return pathname === '/'
    if (to === '/shop') return pathname.startsWith('/shop') && !wishlistView
    if (to === '/shop?view=wishlist') return wishlistView
    return pathname.startsWith('/demo')
  }

  return (
    <nav data-testid={testId} className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-surface border-t border-border" aria-label="Mobile navigation">
      <div className="grid grid-cols-4">
        {ITEMS.map(item => {
          const active = isActive(item.to)
          const showBadge = item.label === 'Wishlist' && wishlistCount > 0
          return (
            <Link
              key={item.label}
              to={item.to}
              aria-current={active ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                active ? 'text-primary' : 'text-text-muted hover:text-text'
              }`}
            >
              <span className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  {ICONS[item.icon]}
                </svg>
                {showBadge && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-primary text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </span>
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}