import type { Line } from '@/types/device'
import { useI18n } from '@/i18n/I18nProvider'

export type GalleryLine = Line | 'all'

interface ProductFilterProps {
  value: GalleryLine
  onChange: (value: GalleryLine) => void
  counts: Record<GalleryLine, number>
  groupByEra: boolean
  onGroupByEraChange: (next: boolean) => void
}

const OPTIONS: ReadonlyArray<{ value: GalleryLine; key: string }> = [
  { value: 'all', key: 'gallery.filter.all' },
  { value: 'iphone', key: 'gallery.filter.iphone' },
  { value: 'ipad', key: 'gallery.filter.ipad' },
]

/** 产品线分段筛选 + 按年代分组开关 */
export function ProductFilter({ value, onChange, counts, groupByEra, onGroupByEraChange }: ProductFilterProps) {
  const { t } = useI18n()
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div
        role="tablist"
        aria-label={t('gallery.title')}
        className="inline-flex rounded-full bg-black/5 p-1 text-sm"
      >
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={value === option.value}
            onClick={() => onChange(option.value)}
            className={`rounded-full px-4 py-1.5 font-medium transition-colors duration-200 ${
              value === option.value
                ? 'bg-card text-ink shadow-[0_1px_3px_rgb(0_0_0/0.08)]'
                : 'text-sub hover:text-ink'
            }`}
          >
            {t(option.key)}
            <span className="ml-1.5 text-xs text-sub/80">{counts[option.value]}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-pressed={groupByEra}
        onClick={() => onGroupByEraChange(!groupByEra)}
        className="rounded-full border border-black/10 px-4 py-1.5 text-sm text-sub transition-colors hover:border-black/20 hover:text-ink"
      >
        {groupByEra ? t('gallery.group.on') : t('gallery.group.off')}
      </button>
    </div>
  )
}
