import { Suspense } from 'react'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { FeaturesSection } from './components/FeaturesSection'
import { FeaturedProductsSection } from './components/FeaturedProductsSection'
import { NewsletterSection } from './components/NewsletterSection'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="container py-16 text-center text-text-muted">Loading…</div>}>
          <HeroSection />
          <FeaturesSection />
          <FeaturedProductsSection />
          <NewsletterSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App