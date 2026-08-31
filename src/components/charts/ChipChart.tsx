import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useI18n } from '@/i18n/I18nProvider'
import { chipsByKind } from '@/data/chips'
import { getDeviceById } from '@/hooks/useDevices'
import { SectionHeader } from '@/components/shared/SectionHeader'

type ChipTab = 'a' | 'm'

interface ChipRow extends Record<string, number | string | string[] | null> {
  name: string
  year: number
}

interface ChipTooltipEntry {
  active?: boolean
  payload?: Array<{ payload?: Record<string, unknown> | null }>
}

/**
 * 芯片图自定义 Tooltip：芯片名、年份、单/多核指数与代表机型。
 * 数据取自当前 hover 列的 payload（行内携带 representativeDeviceIds），不串列。
 */
function ChipTooltip({ active, payload }: ChipTooltipEntry) {
  const { t, locale } = useI18n()
  if (!active || !payload || payload.length === 0) return null
  const row = payload[0]?.payload
  if (!row) return null
  const name = String(row.name ?? '')
  const year = Number(row.year ?? 0)
  const single = row.singleScore
  const multi = row.multiScore
  const deviceIds = Array.isArray(row.deviceIds) ? (row.deviceIds as string[]) : []
  const deviceNames = deviceIds
    .map((id) => getDeviceById(id)?.name)
    .filter((name): name is string => Boolean(name))
  const uniqueNames = [...new Set(deviceNames)]

  return (
    <div className="pointer-events-none max-w-[15rem] rounded-2xl bg-card/95 p-3 shadow-[0_8px_28px_rgb(0_0_0/0.14)] ring-1 ring-black/10 backdrop-blur">
      <p className="text-xs font-semibold text-ink">
        {name} <span className="font-normal text-sub">· {year}</span>
      </p>
      <p className="mt-1 text-xs text-ink/80">
        <span className="text-sub">{t('chips.tooltip.multi')}</span>{' '}
        <span className="font-semibold tabular-nums">{typeof multi === 'number' ? multi.toLocaleString() : '—'}</span>
        <span className="mx-2 text-line">|</span>
        <span className="text-sub">{t('chips.tooltip.single')}</span>{' '}
        <span className="font-semibold tabular-nums">{typeof single === 'number' ? single.toLocaleString() : '—'}</span>
      </p>
      {uniqueNames.length > 0 && (
        <p className="mt-1.5 text-[11px] leading-relaxed text-sub">
          <span>{t('chips.tooltip.devices')}</span>
          {uniqueNames.slice(0, 4).join(locale === 'zh' ? '、' : ', ')}
        </p>
      )}
    </div>
  )
}

/** 芯片性能演变图：A / M 系列 Tab，多核实线 + 单核虚线，数据来自 chips.ts（memo） */
export function ChipChart() {
  const { t } = useI18n()
  const [tab, setTab] = useState<ChipTab>('a')

  const rows = useMemo<ChipRow[]>(
    () =>
      chipsByKind(tab).map((chip) => ({
        name: chip.name,
        year: chip.year,
        singleScore: chip.singleScore,
        multiScore: chip.multiScore,
        deviceIds: chip.representativeDeviceIds,
      })),
    [tab],
  )

  return (
    <section id="chips" className="scroll-mt-16 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={t('chips.title')} subtitle={t('chips.sub')} />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" aria-label={t('chips.title')} className="inline-flex rounded-full bg-black/5 p-1 text-sm">
            {(['a', 'm'] as ChipTab[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={`rounded-full px-4 py-1.5 font-medium transition-colors duration-200 ${
                  tab === key ? 'bg-card text-ink shadow-[0_1px_3px_rgb(0_0_0/0.08)]' : 'text-sub hover:text-ink'
                }`}
              >
                {t(key === 'a' ? 'chips.tab.a' : 'chips.tab.m')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-sub">
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="h-0.5 w-5 rounded-full bg-accent" />
              {t('chips.legend.multi')}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="h-0.5 w-5 rounded-full border-t-2 border-dashed border-[#98989d]" />
              {t('chips.legend.single')}
            </span>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-card p-4 shadow-[0_1px_2px_rgb(0_0_0/0.04)] ring-1 ring-black/5 sm:p-6">
          <div className="h-72 w-full sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows} margin={{ top: 12, right: 28, bottom: 4, left: 0 }}>
                <CartesianGrid stroke="#ececf0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#6e6e73' }}
                  tickLine={false}
                  axisLine={{ stroke: '#d2d2d7' }}
                  tickMargin={8}
                  interval="preserveStartEnd"
                  angle={-30}
                  textAnchor="end"
                  height={56}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6e6e73' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value: number) => value.toLocaleString()}
                  width={52}
                />
                <Tooltip content={<ChipTooltip />} cursor={{ stroke: '#c7c7cc', strokeDasharray: '4 4' }} offset={14} />
                <Line
                  type="monotone"
                  dataKey="multiScore"
                  name={t('chips.legend.multi')}
                  stroke="#0071e3"
                  strokeWidth={2}
                  dot={{ r: 3.5, strokeWidth: 0, fill: '#0071e3' }}
                  activeDot={{ r: 5.5, strokeWidth: 2, stroke: '#ffffff', fill: '#0071e3' }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="singleScore"
                  name={t('chips.legend.single')}
                  stroke="#98989d"
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                  dot={{ r: 2.5, strokeWidth: 0, fill: '#98989d' }}
                  activeDot={{ r: 4.5, strokeWidth: 2, stroke: '#ffffff', fill: '#98989d' }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="mt-4 border-t border-black/5 pt-3 text-xs leading-relaxed text-sub/90">
            {t('chips.footnote')}
          </p>
        </div>
      </div>
    </section>
  )
}
