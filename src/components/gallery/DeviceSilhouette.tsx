import type { Device } from '@/types/device'

interface DeviceSilhouetteProps {
  line: Device['line']
  family: Device['family']
  year: number
  className?: string
}

/**
 * 统一 SVG 剪影：无图或图片加载失败时的兜底（禁止裂图）。
 * 按年份/家族区分三种 iPhone 形态（Home 键 / 刘海 / 动态岛）与 iPad 平板形态。
 */
export function DeviceSilhouette({ line, family, year, className }: DeviceSilhouetteProps) {
  if (line === 'ipad') {
    return (
      <svg viewBox="0 0 120 160" role="img" aria-hidden="true" className={className}>
        <rect x="14" y="6" width="92" height="148" rx="10" className="fill-black/8" />
        <rect x="19" y="11" width="82" height="138" rx="6" className="fill-black/12" />
        {year >= 2018 ? null : <circle cx="60" cy="143" r="3.5" className="fill-black/25" />}
      </svg>
    )
  }

  // iPhone：按年份划分形态（classic=Home 键 / notch=刘海 / island=动态岛）
  const shape = year < 2017 ? 'classic' : year < 2022 ? 'notch' : 'island'
  const tall = family === 'plus' || family === 'pro_max' || family === 'x' || family === 'air'

  return (
    <svg
      viewBox={tall ? '0 0 100 170' : '0 0 100 160'}
      role="img"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="28"
        y="6"
        width="44"
        height={tall ? 158 : 148}
        rx="9"
        className="fill-black/8"
      />
      <rect
        x="32"
        y="10"
        width="36"
        height={tall ? 150 : 140}
        rx="6"
        className="fill-black/12"
      />
      {shape === 'classic' && <circle cx="50" cy={tall ? 152 : 142} r="4" className="fill-black/25" />}
      {shape === 'notch' && <rect x="41" y="10" width="18" height="5" rx="2.5" className="fill-black/25" />}
      {shape === 'island' && <rect x="42" y="14" width="16" height="4.5" rx="2.25" className="fill-black/25" />}
    </svg>
  )
}
