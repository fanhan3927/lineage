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
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ALL_DEVICES, getDeviceById } from '@/hooks/useDevices'
import { formatUSD } from '@/lib/format'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { DeviceImage } from '@/components/gallery/DeviceImage'
import { DevicePriceTooltip } from './ChartTooltip'

type PriceTab = 'iphone' | 'ipad'

interface SeriesDef {
  key: 'standard' | 'pro'
  labelKey: string
  color: string
  deviceIds: string[]
}

/**
 * 两条线的成员按「产品定位」手工划定（数据来自 src/data，不写死价格）：
 * - iPhone 标准款：数字主系（5c/SE/e 系列属低价位补充，不进折线，表格中仍可查）
 * - iPhone Pro 款：XS 起的 Pro 定位（含前身 XS 世代）
 * - iPad 数字系列 / iPad Pro（同年多尺寸取当年起售价最低的条目）
 */
const SERIES: Record<PriceTab, SeriesDef[]> = {
  iphone: [
    {
      key: 'standard',
      labelKey: 'price.legend.standard',
      color: '#0071e3',
      deviceIds: [
        'iphone-original', 'iphone-3g', 'iphone-3gs', 'iphone-4', 'iphone-4s',
        'iphone-5', 'iphone-5s', 'iphone-6', 'iphone-6s', 'iphone-7', 'iphone-8',
        'iphone-xr', 'iphone-11', 'iphone-12', 'iphone-13', 'iphone-14',
        'iphone-15', 'iphone-16', 'iphone-17',
      ],
    },
    {
      key: 'pro',
      labelKey: 'price.legend.pro',
      color: '#6e6e73',
      deviceIds: [
        'iphone-xs', 'iphone-11-pro', 'iphone-12-pro', 'iphone-13-pro',
        'iphone-14-pro', 'iphone-15-pro', 'iphone-16-pro', 'iphone-17-pro',
      ],
    },
  ],
  ipad: [
    {
      key: 'standard',
      labelKey: 'price.legend.ipad',
      color: '#0071e3',
      deviceIds: [
        'ipad-1', 'ipad-2', 'ipad-3', 'ipad-4', 'ipad-5', 'ipad-6',
        'ipad-7', 'ipad-8', 'ipad-9', 'ipad-10', 'ipad-a16',
      ],
    },
    {
      key: 'pro',
      labelKey: 'price.legend.ipadPro',
      color: '#6e6e73',
      deviceIds: [
        'ipad-pro-129-1', 'ipad-pro-97', 'ipad-pro-129-2', 'ipad-pro-105',
        'ipad-pro-11-1', 'ipad-pro-11-2', 'ipad-pro-11-3', 'ipad-pro-11-m4', 'ipad-pro-11-m5',
      ],
    },
  ],
}

interface RowPoint {
  deviceId: string
  price: number
}

interface PriceRow extends Record<string, number | string | null> {
  year: number
}

/** 组装折线数据：一年一行；同年多条目取起售价最低（并列取更晚发售），行内携带 deviceId 供 Tooltip 绑定 */
function buildRows(tab: PriceTab): PriceRow[] {
  const seriesDefs = SERIES[tab]
  const bySeries = seriesDefs.map((def) => {
    const byYear = new Map<number, RowPoint>()
    for (const id of def.deviceIds) {
      const device = getDeviceById(id)
      if (!device || device.launchPriceUSD == null) continue
      const existing = byYear.get(device.year)
      if (
        !existing ||
        device.launchPriceUSD < existing.price ||
        (device.launchPriceUSD === existing.price && device.launchedAt > (getDeviceById(existing.deviceId)?.launchedAt ?? ''))
      ) {
        byYear.set(device.year, { deviceId: device.id, price: device.launchPriceUSD })
      }
    }
    return { def, byYear }
  })

  const years = new Set<number>()
  bySeries.forEach(({ byYear }) => byYear.forEach((_, year) => years.add(year)))
  const sortedYears = [...years].sort((a, b) => a - b)

  return sortedYears.map((year) => {
    const row: PriceRow = { year }
    bySeries.forEach(({ def, byYear }) => {
      const point = byYear.get(year)
      row[def.key] = point?.price ?? null
      row[`${def.key}DeviceId`] = point?.deviceId ?? null
    })
    return row
  })
}

/** 首发定价演变图：iPhone / iPad Tab、双折线、自定义 Tooltip、移动端 tap 选中 */
export function PriceChart() {
  const { t } = useI18n()
  const [tab, setTab] = useState<PriceTab>('iphone')
  const [pinnedDeviceId, setPinnedDeviceId] = useState<string | null>(null)
  const isTouch = useMediaQuery('(hover: none)')

  const rows = useMemo(() => buildRows(tab), [tab])
  const deviceById = useMemo(() => new Map(ALL_DEVICES.map((device) => [device.id, device])), [])
  const seriesDefs = SERIES[tab]
  const pinnedDevice = pinnedDeviceId ? getDeviceById(pinnedDeviceId) : null

  const handleChartClick = (state: { activePayload?: Array<{ dataKey?: string | number; payload?: Record<string, unknown> | null }> }) => {
    for (const entry of state.activePayload ?? []) {
      const key = String(entry.dataKey ?? '')
      const id = entry.payload?.[`${key}DeviceId`]
      if (typeof id === 'string') {
        setPinnedDeviceId(id)
        return
      }
    }
  }

  return (
    <section id="price" className="scroll-mt-16 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={t('price.title')} subtitle={t('price.sub')} />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" aria-label={t('price.title')} className="inline-flex rounded-full bg-black/5 p-1 text-sm">
            {(Object.keys(SERIES) as PriceTab[]).map((key) => (
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
                {t(key === 'iphone' ? 'price.tab.iphone' : 'price.tab.ipad')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-sub">
            {seriesDefs.map((def) => (
              <span key={def.key} className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: def.color }} />
                {t(def.labelKey)}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-card p-4 shadow-[0_1px_2px_rgb(0_0_0/0.04)] ring-1 ring-black/5 sm:p-6">
          <div className="h-72 w-full sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows} margin={{ top: 12, right: 28, bottom: 4, left: 0 }} onClick={handleChartClick}>
                <CartesianGrid stroke="#ececf0" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: '#6e6e73' }}
                  tickLine={false}
                  axisLine={{ stroke: '#d2d2d7' }}
                  tickMargin={8}
                  minTickGap={16}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6e6e73' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value: number) => `$${value}`}
                  width={52}
                />
                <Tooltip
                  content={
                    <DevicePriceTooltip
                      deviceById={deviceById}
                      headline={t('price.tooltip.headline')}
                      seriesLabels={Object.fromEntries(seriesDefs.map((def) => [def.key, t(def.labelKey)]))}
                    />
                  }
                  cursor={{ stroke: '#c7c7cc', strokeDasharray: '4 4' }}
                  offset={16}
                />
                {seriesDefs.map((def) => (
                  <Line
                    key={def.key}
                    type="monotone"
                    dataKey={def.key}
                    stroke={def.color}
                    strokeWidth={2}
                    connectNulls={false}
                    dot={{ r: 3.5, strokeWidth: 0, fill: def.color }}
                    activeDot={{ r: 5.5, strokeWidth: 2, stroke: '#ffffff', fill: def.color }}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {isTouch && (
            <p className="mt-2 text-xs text-sub/80">{t('price.tapHint')}</p>
          )}

          {/* 移动端 tap 选中后的固定信息卡（与 Tooltip 同一数据口径） */}
          {pinnedDevice && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-page p-3 ring-1 ring-black/5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 ring-1 ring-black/5">
                <DeviceImage device={pinnedDevice} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{pinnedDevice.name}</p>
                <p className="text-xs text-sub">
                  {pinnedDevice.year} · {t('price.selected')}
                </p>
              </div>
              <p className="text-base font-semibold text-accent">{formatUSD(pinnedDevice.launchPriceUSD)}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
