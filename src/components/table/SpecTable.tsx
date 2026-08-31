import { useMemo, useState } from 'react'
import type { Device } from '@/types/device'
import { useI18n } from '@/i18n/I18nProvider'
import { ALL_DEVICES, filterDevices } from '@/hooks/useDevices'
import { formatGBList, formatUSD, localizedText } from '@/lib/format'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { SpecFilters, type SortDir, type TableLine } from './SpecFilters'

const MAX_COMPARE = 4

/** 产品线列显示名 */
function lineLabel(line: Device['line']): string {
  return line === 'iphone' ? 'iPhone' : 'iPad'
}

/**
 * 完整规格对比表：
 * - 列：年份 / 机型 / 产品线 / 芯片 / 内存 / 屏幕 / 分辨率 / 相机 / 电池 / 起售价
 * - 表头 sticky，勾选列与机型列 sticky，移动端外层横向滚动
 * - 勾选最多 4 行高亮对比；空搜索有双语空状态
 */
export function SpecTable() {
  const { t, locale } = useI18n()
  const [line, setLine] = useState<TableLine>('all')
  const [query, setQuery] = useState('')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [compareIds, setCompareIds] = useState<string[]>([])

  const rows = useMemo(() => {
    const filtered = filterDevices(ALL_DEVICES, { line, query })
    return filtered.sort((a, b) => (sortDir === 'desc' ? b.launchedAt.localeCompare(a.launchedAt) : a.launchedAt.localeCompare(b.launchedAt)))
  }, [line, query, sortDir])

  const toggleCompare = (id: string) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((existing) => existing !== id)
      if (current.length >= MAX_COMPARE) return current
      return [...current, id]
    })
  }

  const columns: Array<{ key: string; label: string; getValue: (device: Device) => string; className?: string }> = [
    { key: 'line', label: t('table.col.line'), getValue: (device) => lineLabel(device.line), className: 'text-sub' },
    { key: 'chip', label: t('table.col.chip'), getValue: (device) => device.chip },
    { key: 'ram', label: t('table.col.ram'), getValue: (device) => formatGBList(device.ramGB), className: 'text-sub' },
    {
      key: 'display',
      label: t('table.col.display'),
      getValue: (device) => (device.displayInches != null ? `${device.displayInches}"` : '—'),
    },
    { key: 'resolution', label: t('table.col.resolution'), getValue: (device) => device.resolution ?? '—', className: 'text-sub' },
    { key: 'camera', label: t('table.col.camera'), getValue: (device) => localizedText(device.camera, locale) },
    { key: 'battery', label: t('table.col.battery'), getValue: (device) => device.battery ?? '—', className: 'text-sub' },
    {
      key: 'price',
      label: t('table.col.price'),
      getValue: (device) => formatUSD(device.launchPriceUSD),
      className: 'font-medium tabular-nums',
    },
  ]

  return (
    <section id="specs" className="scroll-mt-16 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={t('table.title')} subtitle={t('table.sub')} />

        <div className="mt-6">
          <SpecFilters
            line={line}
            onLineChange={setLine}
            query={query}
            onQueryChange={setQuery}
            sortDir={sortDir}
            onSortDirChange={setSortDir}
            compareCount={compareIds.length}
            onClearCompare={() => setCompareIds([])}
          />
        </div>

        {rows.length === 0 ? (
          <div className="mt-6 rounded-3xl bg-card p-14 text-center ring-1 ring-black/5">
            <p className="text-lg font-semibold tracking-tight">{t('table.empty.title')}</p>
            <p className="mt-2 text-sm text-sub">{t('table.empty.hint')}</p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-3xl bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04)] ring-1 ring-black/5">
            <table className="w-full min-w-[64rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-black/8 text-left">
                  <th
                    scope="col"
                    aria-label={t('table.compareHint')}
                    className="sticky left-0 top-0 z-20 w-10 bg-card px-3 py-3"
                  />
                  <th scope="col" className="sticky top-0 z-10 bg-card px-3 py-3 text-xs font-medium text-sub">
                    {t('table.col.year')}
                  </th>
                  <th scope="col" className="sticky left-10 top-0 z-10 min-w-[13rem] bg-card px-3 py-3 text-xs font-medium text-sub">
                    {t('table.col.name')}
                  </th>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className="sticky top-0 z-10 whitespace-nowrap bg-card px-3 py-3 text-xs font-medium text-sub"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((device) => {
                  const selected = compareIds.includes(device.id)
                  return (
                    <tr
                      key={device.id}
                      className={`border-b border-black/5 last:border-b-0 ${
                        selected ? 'bg-[#eef5ff] shadow-[inset_3px_0_0_0_#0071e3]' : 'hover:bg-black/[0.015]'
                      }`}
                    >
                      <td className={`sticky left-0 z-10 px-3 py-2.5 ${selected ? 'bg-[#eef5ff]' : 'bg-card'}`}>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleCompare(device.id)}
                          disabled={!selected && compareIds.length >= MAX_COMPARE}
                          aria-label={`${t('table.compareHint')} — ${device.name}`}
                          className="h-3.5 w-3.5 cursor-pointer accent-[#0071e3] disabled:opacity-30"
                        />
                      </td>
                      <td className="px-3 py-2.5 tabular-nums text-sub">{device.year}</td>
                      <td className={`sticky left-10 z-10 px-3 py-2.5 font-medium ${selected ? 'bg-[#eef5ff]' : 'bg-card'}`}>
                        {device.name}
                      </td>
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={`whitespace-nowrap px-3 py-2.5 ${column.className ?? 'text-ink/90'}`}
                        >
                          {column.getValue(device)}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
