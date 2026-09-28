export function NewsletterSection() {
  return (
    <section className="py-20 bg-primary text-white" aria-labelledby="newsletter-title">
      <div className="container text-center max-w-2xl mx-auto">
        <h2 id="newsletter-title" className="font-serif text-3xl md:text-4xl font-normal mb-4">
          Join the DRAPE Circle
        </h2>
        <p className="text-primary-light mb-8 text-lg">
          Early access to new collections, artisan stories, and exclusive offers.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action="#" method="POST">
          <label htmlFor="email" className="sr-only">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-primary-light focus:outline-none focus:border-white/50 transition-colors"
            required
            autoComplete="email"
          />
          <button type="submit" className="px-8 py-4 bg-white text-primary font-medium rounded-full hover:bg-primary-light transition-colors whitespace-nowrap">
            Subscribe
          </button>
        </form>
        <p className="mt-4 text-sm text-primary-light">No spam, unsubscribe anytime.</p>
      </div>
    </section>
  )
}