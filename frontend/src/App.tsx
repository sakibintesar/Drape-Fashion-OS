import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { HeroSection } from './components/HeroSection'
import { FeaturesSection } from './components/FeaturesSection'
import { FeaturedProductsSection } from './components/FeaturedProductsSection'
import { NewsletterSection } from './components/NewsletterSection'
import { WishlistProvider } from './context/WishlistContext'

const Demo1ImmersiveScroll = lazy(() => import('./demos/Demo1ImmersiveScroll').then(m => ({ default: m.Demo1ImmersiveScroll })))
const Demo2KineticTypography = lazy(() => import('./demos/Demo2KineticTypography').then(m => ({ default: m.Demo2KineticTypography })))
const Demo3PhysicsPlayground = lazy(() => import('./demos/Demo3PhysicsPlayground').then(m => ({ default: m.Demo3PhysicsPlayground })))
const Demo4GenerativeAtmosphere = lazy(() => import('./demos/Demo4GenerativeAtmosphere').then(m => ({ default: m.Demo4GenerativeAtmosphere })))
const Demo5MicroInteractionLab = lazy(() => import('./demos/Demo5MicroInteractionLab').then(m => ({ default: m.Demo5MicroInteractionLab })))
const ShopPage = lazy(() => import('./components/ShopPage').then(m => ({ default: m.ShopPage })))

function MainLayout() {
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

function DemoLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="container py-16 text-center text-text-muted">Loading demo…</div>}>
          <Routes>
            <Route path="/demo/1" element={<Demo1ImmersiveScroll />} />
            <Route path="/demo/2" element={<Demo2KineticTypography />} />
            <Route path="/demo/3" element={<Demo3PhysicsPlayground />} />
            <Route path="/demo/4" element={<Demo4GenerativeAtmosphere />} />
            <Route path="/demo/5" element={<Demo5MicroInteractionLab />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <WishlistProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/demo/*" element={<DemoLayout />} />
        </Routes>
      </BrowserRouter>
    </WishlistProvider>
  )
}

export default App