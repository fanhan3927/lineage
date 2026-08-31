import { useI18n } from './I18nProvider'
import type { Locale } from '@/types/device'

const OPTIONS: ReadonlyArray<{ value: Locale; label: string }> = [
  { value: 'zh', label: '中' },
  { value: 'en', label: 'EN' },
]

/** 右上角 中/EN 胶囊切换，全局生效并写入 localStorage（逻辑在 I18nProvider） */
export function LanguageSwitch() {
  const { locale, setLocale, t } = useI18n()
  return (
    <div
      role="group"
      aria-label={t('lang.label')}
      className="flex shrink-0 items-center rounded-full border border-black/10 bg-white/80 p-0.5 text-xs"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={locale === option.value}
          onClick={() => setLocale(option.value)}
          className={`rounded-full px-2.5 py-1 font-medium transition-colors duration-150 ${
            locale === option.value ? 'bg-ink text-white' : 'text-sub hover:text-ink'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
