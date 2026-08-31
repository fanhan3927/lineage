import { useState } from 'react'
import type { Device } from '@/types/device'
import { DeviceSilhouette } from './DeviceSilhouette'

interface DeviceImageProps {
  device: Device
  className?: string
  /** 卡片小图默认懒加载；详情首图可关闭 */
  eager?: boolean
}

/**
 * 设备图片：优先 /devices/{slug}.png，加载失败或缺失时回退 SVG 剪影，绝不裂图。
 * 图片默认懒加载（performance 规范）。
 */
export function DeviceImage({ device, className, eager = false }: DeviceImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <DeviceSilhouette
        line={device.line}
        family={device.family}
        year={device.year}
        className={className}
      />
    )
  }

  return (
    <img
      src={device.image}
      alt={device.name}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
