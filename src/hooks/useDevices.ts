import { useMemo } from 'react'
import type { Device, Line } from '@/types/device'
import { iphones } from '@/data/iphones'
import { ipads } from '@/data/ipads'
import { milestones } from '@/data/milestones'

/**
 * 设备数据的唯一入口：
 * - 合并 iPhone / iPad 并按发售时间排序
 * - 提供按产品线、关键词、年份过滤
 * - Hero 统计、里程碑解析、详情查找都在这里，UI 不直接 import 数据文件
 */
export const ALL_DEVICES: Device[] = [...iphones, ...ipads].sort(
  (a, b) => a.launchedAt.localeCompare(b.launchedAt),
)

const DEVICE_BY_ID = new Map(ALL_DEVICES.map((device) => [device.id, device]))

export interface DeviceStats {
  iphoneCount: number
  ipadCount: number
  totalCount: number
  minYear: number
  maxYear: number
  yearSpan: number
}

export interface DeviceQuery {
  line?: Line | 'all'
  /** 大小写不敏感，匹配机型名或芯片名 */
  query?: string
  /** 精确年份（用于可能的按年查看） */
  year?: number
}

export function filterDevices(devices: Device[], { line = 'all', query, year }: DeviceQuery): Device[] {
  const keyword = query?.trim().toLowerCase()
  return devices.filter((device) => {
    if (line !== 'all' && device.line !== line) return false
    if (year != null && device.year !== year) return false
    if (keyword) {
      const haystack = `${device.name} ${device.chip}`.toLowerCase()
      if (!haystack.includes(keyword)) return false
    }
    return true
  })
}

/** Hero 数量统计：从 data 计算，不写死 */
export function computeStats(devices: Device[] = ALL_DEVICES): DeviceStats {
  let minYear = Number.POSITIVE_INFINITY
  let maxYear = 0
  let iphoneCount = 0
  let ipadCount = 0
  for (const device of devices) {
    if (device.line === 'iphone') iphoneCount += 1
    else ipadCount += 1
    if (device.year < minYear) minYear = device.year
    if (device.year > maxYear) maxYear = device.year
  }
  return { iphoneCount, ipadCount, totalCount: devices.length, minYear, maxYear, yearSpan: maxYear - minYear }
}

export function getDeviceById(id: string): Device | undefined {
  return DEVICE_BY_ID.get(id)
}

/** 里程碑 → 对应 Device（保持 milestones.ts 顺序） */
export function resolveMilestoneDevices(): Array<{ milestone: (typeof milestones)[number]; device: Device }> {
  const resolved: Array<{ milestone: (typeof milestones)[number]; device: Device }> = []
  for (const milestone of milestones) {
    const device = DEVICE_BY_ID.get(milestone.deviceId)
    if (device) resolved.push({ milestone, device })
  }
  return resolved
}

export function useDevices() {
  const stats = useMemo(() => computeStats(), [])
  return { devices: ALL_DEVICES, stats }
}
