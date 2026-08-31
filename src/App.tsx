import { I18nProvider } from '@/i18n/I18nProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/hero/Hero'
import { GallerySection } from '@/components/gallery/GallerySection'

export default function App() {
  return (
    <I18nProvider>
      <div className="min-h-screen bg-page text-ink">
        <Navbar />
        <main>
          {/* 依次：Hero → Gallery →（步骤 4–7 接入）Milestones / PriceChart / ChipChart / SpecTable */}
          <Hero />
          <GallerySection />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  )
}
