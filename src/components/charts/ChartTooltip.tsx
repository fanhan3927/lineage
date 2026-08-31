import type { Device } from '@/types/device'
import { formatUSD } from '@/lib/format'
import { DeviceImage } from '@/components/gallery/DeviceImage'

/** recharts 传给自定义 Tooltip 的条目：dataKey 标识 series，payload 为图表行 */
export interface TooltipEntryLike {
  dataKey?: string | number
  payload?: Record<string, unknown> | null
}

interface DevicePriceTooltipProps {
  active?: boolean
  payload?: TooltipEntryLike[]
  deviceById: Map<string, Device>
  headline: string
  /** series key → 显示名（'standard' → 标准款起售 等） */
  seriesLabels: Record<string, string>
}

/**
 * 价格图自定义 Tooltip：按当前 hover 行的 payload 渲染每个 series 的小卡
 * （机型图 + 全名 + 年份 + 价格）。deviceId 取自行内 `{dataKey}DeviceId` 字段，
 * 与数据点严格一一对应 —— 快速划过相邻点时内容必然跟随变化，不会串机。
 */
export function DevicePriceTooltip({ active, payload, deviceById, headline, seriesLabels }: DevicePriceTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  const cards = payload
    .map((entry) => {
      const key = String(entry.dataKey ?? '')
      const row = entry.payload
      if (!row) return null
      const deviceId = row[`${key}DeviceId`]
      const price = row[key]
      if (typeof deviceId !== 'string' || typeof price !== 'number') return null
      const device = deviceById.get(deviceId)
      if (!device) return null
      return { device, price, label: seriesLabels[key] ?? key }
    })
    .filter((card): card is NonNullable<typeof card> => card !== null)

  if (cards.length === 0) return null

  return (
    <div className="pointer-events-none flex max-w-[16rem] flex-col gap-2 rounded-2xl bg-card/95 p-3 shadow-[0_8px_28px_rgb(0_0_0/0.14)] ring-1 ring-black/10 backdrop-blur">
      <p className="text-[10px] font-medium uppercase tracking-wide text-sub">{headline}</p>
      {cards.map(({ device, price, label }) => (
        <div key={device.id} className="flex items-center gap-2.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f0f0f2] p-1">
            <DeviceImage device={device} className="max-h-full max-w-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-ink">{device.name}</p>
            <p className="text-[11px] text-sub">
              {device.year} · {label}
            </p>
            <p className="text-xs font-semibold text-accent">{formatUSD(price)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
