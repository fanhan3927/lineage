import { useState } from 'react'
import { useI18n } from '@/i18n/I18nProvider'
import { LanguageSwitch } from '@/i18n/LanguageSwitch'

/** 锚点导航项（id 与页面 section 的 id 对应） */
const NAV_ITEMS = [
  { id: 'overview', key: 'nav.overview' },
  { id: 'milestones', key: 'nav.milestones' },
  { id: 'price', key: 'nav.price' },
  { id: 'chips', key: 'nav.chips' },
  { id: 'specs', key: 'nav.specs' },
] as const

export function Navbar() {
  const { t } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur-xl backdrop-saturate-150">
      <nav aria-label={t('nav.label')} className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#overview" className="flex items-baseline gap-2.5" onClick={() => setMenuOpen(false)}>
          <span className="text-[17px] font-semibold tracking-tight">Lineage</span>
          <span className="hidden text-xs text-sub lg:inline">{t('brand.subtitle')}</span>
        </a>

        {/* 桌面端：锚点 + 语言切换 */}
        <div className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-nav-target={item.id}
              className="text-xs text-ink/80 transition-colors hover:text-ink"
            >
              {t(item.key)}
            </a>
          ))}
          <LanguageSwitch />
        </div>

        {/* 移动端：语言切换常驻 + 汉堡折叠菜单 */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitch />
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t('nav.close') : t('nav.menu')}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/80 hover:bg-black/5"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M2 4.5h12M2 8h12M2 11.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-black/5 bg-white/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 text-sm text-ink/90"
              >
                {t(item.key)}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
