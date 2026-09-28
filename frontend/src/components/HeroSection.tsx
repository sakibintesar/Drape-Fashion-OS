export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-background to-background" aria-hidden="true" />
      <div className="container relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 id="hero-title" className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal text-text tracking-tight animate-fade-in">
            Crafted with <br /><span className="text-primary">Intention</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-text-muted max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
            Handwoven textiles from Bangladesh artisans. Each piece tells a story of heritage, sustainability, and timeless elegance.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <a href="/shop" className="px-8 py-4 bg-primary text-white font-medium rounded-full hover:bg-primary-hover transition-colors text-base">
              Explore Collection
            </a>
            <a href="/about" className="px-8 py-4 border border-border text-text font-medium rounded-full hover:bg-background transition-colors text-base">
              Our Story
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
        <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}