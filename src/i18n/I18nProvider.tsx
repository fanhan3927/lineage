/**
 * 轻量 i18n：Context + zh/en 字典（不引入 i18next）。
 * 语言偏好写入 localStorage（key: lineage-locale），切换时只重渲染订阅组件。
 */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Locale } from '@/types/device'
import { zh } from './zh'
import { en } from './en'

const DICTS: Record<Locale, Record<string, string>> = { zh, en }
const STORAGE_KEY = 'lineage-locale'

function detectLocale(): Locale {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'zh' || saved === 'en') return saved
  } catch {
    /* localStorage 不可用时静默降级 */
  }
  return typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh')
    ? 'zh'
    : 'en'
}

export interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  /** 取字典值；缺失时回退英文，再回退 key 本身 */
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  // 同步 <html lang> 与页面标题，便于无障碍与搜索结果
  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
  }, [locale])
  useEffect(() => {
    document.title =
      locale === 'zh' ? 'Lineage · 历代 iPhone 与 iPad' : 'Lineage · iPhone & iPad through the years'
  }, [locale])

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale: (next) => {
        try {
          window.localStorage.setItem(STORAGE_KEY, next)
        } catch {
          /* ignore */
        }
        setLocaleState(next)
      },
      t: (key) => DICTS[locale][key] ?? DICTS.en[key] ?? key,
    }),
    [locale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within <I18nProvider>')
  return ctx
}
