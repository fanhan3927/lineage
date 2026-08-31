import { I18nProvider } from '@/i18n/I18nProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/hero/Hero'

export default function App() {
  return (
    <I18nProvider>
      <div className="min-h-screen bg-page text-ink">
        <Navbar />
        <main>
          {/* 步骤 3–7 依次接入：Gallery / Milestones / PriceChart / ChipChart / SpecTable */}
          <Hero />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  )
}
