import type { Line } from '@/types/device'
import { useI18n } from '@/i18n/I18nProvider'

export type TableLine = Line | 'all'
export type SortDir = 'desc' | 'asc'

interface SpecFiltersProps {
  line: TableLine
  onLineChange: (line: TableLine) => void
  query: string
  onQueryChange: (query: string) => void
  sortDir: SortDir
  onSortDirChange: (dir: SortDir) => void
  compareCount: number
  onClearCompare: () => void
}

const LINE_OPTIONS: ReadonlyArray<{ value: TableLine; key: string }> = [
  { value: 'all', key: 'table.filter.all' },
  { value: 'iphone', key: 'table.filter.iphone' },
  { value: 'ipad', key: 'table.filter.ipad' },
]

/** 规格表工具栏：产品线筛选 + 搜索 + 年份排序 + 对比计数 */
export function SpecFilters({
  line,
  onLineChange,
  query,
  onQueryChange,
  sortDir,
  onSortDirChange,
  compareCount,
  onClearCompare,
}: SpecFiltersProps) {
  const { t } = useI18n()
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div role="tablist" aria-label={t('table.filter.all')} className="inline-flex rounded-full bg-black/5 p-1 text-sm">
        {LINE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={line === option.value}
            onClick={() => onLineChange(option.value)}
            className={`rounded-full px-3.5 py-1.5 font-medium transition-colors duration-200 ${
              line === option.value ? 'bg-card text-ink shadow-[0_1px_3px_rgb(0_0_0/0.08)]' : 'text-sub hover:text-ink'
            }`}
          >
            {t(option.key)}
          </button>
        ))}
      </div>

      <div className="relative min-w-0 flex-1 sm:max-w-xs">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sub/70"
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="5.5" cy="5.5" r="4.25" stroke="currentColor" strokeWidth="1.4" />
          <path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={t('table.search')}
          aria-label={t('table.search')}
          className="w-full rounded-full border border-black/10 bg-white py-1.5 pl-9 pr-4 text-sm text-ink placeholder:text-sub/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <button
        type="button"
        onClick={() => onSortDirChange(sortDir === 'desc' ? 'asc' : 'desc')}
        className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-1.5 text-sm text-sub transition-colors hover:border-black/20 hover:text-ink"
        title={t('table.sort')}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className={sortDir === 'asc' ? 'rotate-180' : ''}>
          <path d="M6 2v8m0 0L2.5 6.5M6 10l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {sortDir === 'desc' ? t('table.sort.newest') : t('table.sort.oldest')}
      </button>

      <div className="ml-auto flex items-center gap-2 text-xs text-sub">
        <span>{t('table.compareHint')}</span>
        {compareCount > 0 && (
          <>
            <span className="rounded-full bg-accent/10 px-2 py-0.5 font-medium text-accent">
              {t('table.compareCount').replace('{n}', String(compareCount))}
            </span>
            <button type="button" onClick={onClearCompare} className="underline decoration-line underline-offset-2 hover:text-ink">
              {t('table.compareClear')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
