import { useState } from 'react'
import type { Device } from '@/types/device'
import { DeviceSilhouette } from './DeviceSilhouette'
import deviceImageFiles from 'virtual:device-images'

interface DeviceImageProps {
  device: Device
  className?: string
  /** 详情首图可关闭懒加载 */
  eager?: boolean
}

/** 构建期清单：public/devices/ 下实际存在的图片文件名（见 vite.config.ts 插件） */
const availableImages = new Set(deviceImageFiles)

/** 解析设备图地址：拼接 Vite base，兼容 GitHub Pages 项目站子路径（如 /lineage/） */
function resolveImageSrc(image: string): string {
  return `${import.meta.env.BASE_URL}${image.replace(/^\//, '')}`
}

/**
 * 设备图片：按构建期清单决定渲染 <img> 还是 SVG 剪影 ——
 * 无图的站点不发出任何图片请求（控制台零 404）；清单误判时由 onError 兜底切回剪影，绝不裂图。
 * 默认懒加载（performance 规范）。
 */
export function DeviceImage({ device, className, eager = false }: DeviceImageProps) {
  const imageSrc = resolveImageSrc(device.image)
  const fileName = device.image.replace(/^\/devices\//, '')
  const [failed, setFailed] = useState(false)

  if (!availableImages.has(fileName) || failed) {
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
      src={imageSrc}
      alt={device.name}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
