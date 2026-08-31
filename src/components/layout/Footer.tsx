import { useI18n } from '@/i18n/I18nProvider'

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-xs font-medium leading-relaxed text-ink/70">{t('footer.disclaimer')}</p>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-sub">{t('footer.trademark')}</p>
        <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-black/5 pt-5">
          <span className="text-xs font-semibold tracking-tight">Lineage</span>
          <span className="text-xs text-sub">{t('brand.subtitle')}</span>
          <span className="ml-auto text-xs text-sub/80">{t('footer.colophon')}</span>
        </div>
      </div>
    </footer>
  )
}
