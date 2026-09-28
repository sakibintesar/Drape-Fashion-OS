export function FeaturedProductsSection() {
  const products = [
    { name: 'Muslin Summer Dress', price: '৳4,200', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop', badge: 'New' },
    { name: 'Linen Tailored Shirt', price: '৳3,800', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=800&fit=crop', badge: null },
    { name: 'Handwoven Cotton Scarf', price: '৳1,950', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=800&fit=crop', badge: 'Bestseller' },
    { name: 'Organic Cotton Trousers', price: '৳3,400', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop', badge: null }
  ]

  return (
    <section className="py-20 bg-background" aria-labelledby="featured-title">
      <div className="container">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 id="featured-title" className="font-serif text-3xl md:text-4xl font-normal text-text">
              Featured Collection
            </h2>
            <p className="text-text-muted mt-1">Handpicked favorites from our latest arrivals</p>
          </div>
          <a href="/shop" className="text-primary font-medium hover:underline inline-flex items-center gap-1 mt-4 sm:mt-0">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
          {products.map((product, index) => (
            <article key={product.name} className="group bg-surface rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-500 animate-fade-in" style={{ animationDelay: `${index * 80}ms` }} role="listitem">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                    {product.badge}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-medium text-text mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="font-medium text-text">{product.price}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}