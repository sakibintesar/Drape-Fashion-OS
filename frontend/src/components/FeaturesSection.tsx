export function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Artisan Crafted',
      description: 'Each piece handwoven by skilled artisans in Bangladesh using traditional techniques passed through generations.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      title: 'Natural Fibers',
      description: 'Premium muslin, linen, and cotton — biodegradable, breathable, and gentle on skin and planet.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Fair Trade',
      description: 'Direct partnerships ensure fair wages, safe conditions, and community investment for artisan families.'
    }
  ]

  return (
    <section className="py-20 bg-surface" aria-labelledby="features-title">
      <div className="container">
        <header className="text-center max-w-2xl mx-auto mb-16">
          <h2 id="features-title" className="font-serif text-3xl md:text-4xl font-normal text-text mb-4">
            Why Choose DRAPE
          </h2>
          <p className="text-text-muted text-lg">
            Every detail considered, from fiber to finish
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <article key={feature.title} className="p-6 md:p-8 bg-background rounded-2xl border border-border hover:border-primary/50 transition-colors duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-light text-primary mb-6">
                {feature.icon}
              </div>
              <h3 className="font-serif text-xl font-medium text-text mb-3">{feature.title}</h3>
              <p className="text-text-muted leading-relaxed">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}