import type { ChipGen } from '@/types/device'

/**
 * 芯片性能数据（A 系列 + iPad 使用的 M 系列）。
 *
 * 【数据口径 / Methodology —— 必须随图展示】
 * - singleScore / multiScore 为「公开第三方跑分（Geekbench 6 量级）」的近似整数值，
 *   主要取自各代公开发布后聚合站点的常见中位水平（Geekbench、Notebookcheck 汇总等）。
 * - Geekbench 6 发布于 2022 年，无法覆盖早期芯片：A4–A11、A12X/Z 等按旧版 Geekbench
 *   公开结果（GB2–GB5）跨版本换算到 GB6 量级，因此为「量级参考」而非精确值。
 * - 同名芯片在不同机型上因散热与调度略有差异，这里取代表机型的常见公开值。
 * - 以上均非 Apple 官方数据；仅供世代间横向参考，不构成精确对比。
 * - iPad mini 7（A17 Pro）、iPad（A16）等复用 A 系列条目；iPad Air M4 与 iPad Pro M4 共用 M4。
 */
export const chips: ChipGen[] = [
  // ── A 系列（iPhone，2010 起；iPad 早期也使用）────────────────────────
  { id: 'a4', name: 'A4', year: 2010, kind: 'a', singleScore: 150, multiScore: 280, representativeDeviceIds: ['iphone-4', 'ipad-1'] },
  { id: 'a5', name: 'A5', year: 2011, kind: 'a', singleScore: 250, multiScore: 480, representativeDeviceIds: ['iphone-4s', 'ipad-2'] },
  { id: 'a5x', name: 'A5X', year: 2012, kind: 'a', singleScore: 250, multiScore: 470, representativeDeviceIds: ['ipad-3'] },
  { id: 'a6', name: 'A6', year: 2012, kind: 'a', singleScore: 400, multiScore: 730, representativeDeviceIds: ['iphone-5'] },
  { id: 'a6x', name: 'A6X', year: 2012, kind: 'a', singleScore: 410, multiScore: 790, representativeDeviceIds: ['ipad-4'] },
  { id: 'a7', name: 'A7', year: 2013, kind: 'a', singleScore: 550, multiScore: 1000, representativeDeviceIds: ['iphone-5s', 'ipad-air-1'] },
  { id: 'a8', name: 'A8', year: 2014, kind: 'a', singleScore: 700, multiScore: 1300, representativeDeviceIds: ['iphone-6'] },
  { id: 'a8x', name: 'A8X', year: 2014, kind: 'a', singleScore: 740, multiScore: 1500, representativeDeviceIds: ['ipad-air-2'] },
  { id: 'a9', name: 'A9', year: 2015, kind: 'a', singleScore: 900, multiScore: 1700, representativeDeviceIds: ['iphone-6s', 'iphone-se-1'] },
  { id: 'a9x', name: 'A9X', year: 2015, kind: 'a', singleScore: 920, multiScore: 1850, representativeDeviceIds: ['ipad-pro-129-1'] },
  { id: 'a10-fusion', name: 'A10 Fusion', year: 2016, kind: 'a', singleScore: 1200, multiScore: 2100, representativeDeviceIds: ['iphone-7'] },
  { id: 'a10x-fusion', name: 'A10X Fusion', year: 2017, kind: 'a', singleScore: 1250, multiScore: 2400, representativeDeviceIds: ['ipad-pro-105'] },
  { id: 'a11-bionic', name: 'A11 Bionic', year: 2017, kind: 'a', singleScore: 1400, multiScore: 2450, representativeDeviceIds: ['iphone-x'] },
  { id: 'a12-bionic', name: 'A12 Bionic', year: 2018, kind: 'a', singleScore: 1500, multiScore: 2800, representativeDeviceIds: ['iphone-xs', 'iphone-xr'] },
  { id: 'a12x-bionic', name: 'A12X Bionic', year: 2018, kind: 'a', singleScore: 1550, multiScore: 4400, representativeDeviceIds: ['ipad-pro-11-1'] },
  { id: 'a12z-bionic', name: 'A12Z Bionic', year: 2020, kind: 'a', singleScore: 1550, multiScore: 4600, representativeDeviceIds: ['ipad-pro-11-2'] },
  { id: 'a13-bionic', name: 'A13 Bionic', year: 2019, kind: 'a', singleScore: 1700, multiScore: 3400, representativeDeviceIds: ['iphone-11'] },
  { id: 'a14-bionic', name: 'A14 Bionic', year: 2020, kind: 'a', singleScore: 2100, multiScore: 4100, representativeDeviceIds: ['iphone-12', 'ipad-air-4'] },
  { id: 'a15-bionic', name: 'A15 Bionic', year: 2021, kind: 'a', singleScore: 2300, multiScore: 5500, representativeDeviceIds: ['iphone-13', 'ipad-mini-6'] },
  { id: 'a16-bionic', name: 'A16 Bionic', year: 2022, kind: 'a', singleScore: 2550, multiScore: 6400, representativeDeviceIds: ['iphone-14-pro', 'ipad-a16'] },
  { id: 'a17-pro', name: 'A17 Pro', year: 2023, kind: 'a', singleScore: 2900, multiScore: 7200, representativeDeviceIds: ['iphone-15-pro', 'ipad-mini-7'] },
  { id: 'a18', name: 'A18', year: 2024, kind: 'a', singleScore: 3350, multiScore: 8300, representativeDeviceIds: ['iphone-16', 'iphone-16e'] },
  { id: 'a18-pro', name: 'A18 Pro', year: 2024, kind: 'a', singleScore: 3500, multiScore: 8800, representativeDeviceIds: ['iphone-16-pro'] },
  { id: 'a19', name: 'A19', year: 2025, kind: 'a', singleScore: 3600, multiScore: 9200, representativeDeviceIds: ['iphone-17', 'iphone-17e'] },
  { id: 'a19-pro', name: 'A19 Pro', year: 2025, kind: 'a', singleScore: 3800, multiScore: 10300, representativeDeviceIds: ['iphone-17-pro', 'iphone-air'] },

  // ── M 系列（iPad Pro / iPad Air，2021 起）────────────────────────────
  { id: 'm1', name: 'M1', year: 2021, kind: 'm', singleScore: 2350, multiScore: 8300, representativeDeviceIds: ['ipad-air-5', 'ipad-pro-11-1'] },
  { id: 'm2', name: 'M2', year: 2022, kind: 'm', singleScore: 2600, multiScore: 9700, representativeDeviceIds: ['ipad-pro-11-3'] },
  { id: 'm3', name: 'M3', year: 2025, kind: 'm', singleScore: 3050, multiScore: 11700, representativeDeviceIds: ['ipad-air-11-m3'] },
  { id: 'm4', name: 'M4', year: 2024, kind: 'm', singleScore: 3700, multiScore: 14600, representativeDeviceIds: ['ipad-pro-11-m4', 'ipad-air-11-m4'] },
  { id: 'm5', name: 'M5', year: 2025, kind: 'm', singleScore: 4000, multiScore: 16500, representativeDeviceIds: ['ipad-pro-11-m5'] },
]

/** 便捷查询：按 kind 过滤并按年份排序（图表数据源） */
export function chipsByKind(kind: ChipGen['kind']): ChipGen[] {
  return chips
    .filter((chip) => chip.kind === kind)
    .sort((a, b) => a.year - b.year || a.name.localeCompare(b.name))
}
