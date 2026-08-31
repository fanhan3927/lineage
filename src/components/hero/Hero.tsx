import { motion, useReducedMotion } from 'framer-motion'
import { useI18n } from '@/i18n/I18nProvider'
import { useDevices } from '@/hooks/useDevices'
import { interpolate } from '@/lib/format'

/**
 * Hero：标题 + 引言 + 由 data 计算的 iPhone / iPad 数量与年份跨度。
 * 2007 年的初代 iPhone 到最新一代，全部来自 src/data。
 */
export function Hero() {
  const { t } = useI18n()
  const { stats } = useDevices()
  const reduceMotion = useReducedMotion()

  return (
    <section id="overview" className="scroll-mt-16 px-4 pb-16 pt-28 sm:px-6 sm:pt-36">
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        className="mx-auto max-w-6xl text-center"
      >
        <p className="text-sm font-medium tracking-wide text-accent">{t('hero.eyebrow')}</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
          {t('hero.title')}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-sub sm:text-lg">{t('hero.intro')}</p>

        <dl className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
          <div className="flex items-baseline gap-1.5">
            <dt className="text-sub">{t('gallery.filter.iphone')}</dt>
            <dd className="text-lg font-semibold tracking-tight">{stats.iphoneCount}</dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="text-sub">{t('gallery.filter.ipad')}</dt>
            <dd className="text-lg font-semibold tracking-tight">{stats.ipadCount}</dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="text-sub">{interpolate(t('hero.countSpan'), { n: stats.yearSpan })}</dt>
            <dd className="text-lg font-semibold tracking-tight">
              {stats.minYear}–{stats.maxYear}
            </dd>
          </div>
        </dl>

        <a
          href="#gallery"
          className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0077ed]"
        >
          {t('hero.cta')}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </motion.div>
    </section>
  )
}
