export function Footer() {
  return (
    <footer className="bg-secondary text-white py-16" role="contentinfo">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <a href="/" className="font-serif text-3xl font-medium" aria-label="DRAPE Home">
              DRAPE
            </a>
            <p className="mt-4 text-primary-light max-w-sm">
              Preserving Bangladesh's textile heritage through contemporary design. Every thread tells a story.
            </p>
          </div>
          <FooterNav title="Shop" links={[
            { href: '/shop', label: 'All Products' },
            { href: '/shop?category=dresses', label: 'Dresses' },
            { href: '/shop?category=tops', label: 'Tops & Shirts' },
            { href: '/shop?category=bottoms', label: 'Bottoms' },
            { href: '/shop?category=accessories', label: 'Accessories' }
          ]} />
          <FooterNav title="Company" links={[
            { href: '/about', label: 'Our Story' },
            { href: '/artisans', label: 'Meet the Artisans' },
            { href: '/sustainability', label: 'Sustainability' },
            { href: '/careers', label: 'Careers' }
          ]} />
          <FooterNav title="Support" links={[
            { href: '/contact', label: 'Contact Us' },
            { href: '/faq', label: 'FAQ' },
            { href: '/shipping', label: 'Shipping Info' },
            { href: '/returns', label: 'Returns' }
          ]} />
        </div>
        <FooterBottom />
      </div>
    </footer>
  )
}

function FooterNav({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title + ' links'}>
      <h3 className="font-medium mb-4">{title}</h3>
      <ul className="space-y-2 text-primary-light">
        {links.map(link => (
          <li key={link.href}>
            <a href={link.href} className="hover:text-white transition-colors">{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function FooterBottom() {
  return (
    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-primary-light text-sm">
        © {new Date().getFullYear()} DRAPE Fashion OS. All rights reserved.
      </p>
      <div className="flex items-center gap-6">
        <SocialLink href="#" label="Instagram" icon={<InstagramIcon />} />
        <SocialLink href="#" label="Facebook" icon={<FacebookIcon />} />
        <SocialLink href="#" label="Twitter" icon={<TwitterIcon />} />
        <SocialLink href="#" label="Pinterest" icon={<PinterestIcon />} />
      </div>
    </div>
  )
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a href={href} className="text-primary-light hover:text-white transition-colors" aria-label={label}>
      {icon}
    </a>
  )
}

function InstagramIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-3.584-.069-4.849-.149-3.225-1.664-4.771-4.919-4.919-1.266-.058-1.644-.07-4.85-.07-3.204 0-3.584.012-3.584.069-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
    </svg>
  )
}

function PinterestIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
    </svg>
  )
}
