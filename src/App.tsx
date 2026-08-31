import { I18nProvider } from '@/i18n/I18nProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/hero/Hero'
import { GallerySection } from '@/components/gallery/GallerySection'
import { MilestoneSection } from '@/components/milestones/MilestoneSection'
import { PriceChart } from '@/components/charts/PriceChart'
import { ChipChart } from '@/components/charts/ChipChart'

export default function App() {
  return (
    <I18nProvider>
      <div className="min-h-screen bg-page text-ink">
        <Navbar />
        <main>
          {/* 页面信息架构：Hero → Gallery → Milestones → Price → Chips →（步骤 7）Specs */}
          <Hero />
          <GallerySection />
          <MilestoneSection />
          <PriceChart />
          <ChipChart />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  )
}
