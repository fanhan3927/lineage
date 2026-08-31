import type { Device } from '@/types/device'
import { DeviceCard } from './DeviceCard'

interface DeviceGridProps {
  devices: Device[]
  onSelect: (device: Device) => void
}

/**
 * 设备网格：卡片各自 whileInView 浮现（每张卡独立触发 + 组内微 stagger）。
 * 相比整组一次性 stagger，长网格滚动到哪浮到哪，观感更接近产品页。
 */
export function DeviceGrid({ devices, onSelect }: DeviceGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {devices.map((device, index) => (
        <DeviceCard key={device.id} device={device} index={index} onSelect={onSelect} />
      ))}
    </ul>
  )
}
