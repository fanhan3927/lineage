import { useI18n } from '@/i18n/I18nProvider'

/**
 * Hero：标题 + 引言 + 由 data 计算的数量统计。
 * 步骤 1 为占位版（标题随语言切换）；接入 src/data 后 stats 从 useDevices 汇总。
 */
export function Hero() {
  const { t } = useI18n()
  return (
    <section id="overview" className="scroll-mt-16 px-4 pb-16 pt-28 sm:px-6 sm:pt-36">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-sm font-medium tracking-wide text-accent">{t('hero.eyebrow')}</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
          {t('hero.title')}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-sub sm:text-lg">{t('hero.intro')}</p>
        {/* 占位统计：步骤 3 改为 data 计算值 */}
        <p className="mt-6 text-sm text-sub">iPhone / iPad · 2007 → now</p>
      </div>
    </section>
  )
}
