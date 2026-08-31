import { useEffect, useState } from 'react'
import type { Device } from '@/types/device'
import { DeviceSilhouette } from './DeviceSilhouette'

interface DeviceImageProps {
  device: Device
  className?: string
  /** 详情首图可关闭懒加载 */
  eager?: boolean
}

/**
 * 图片可用性缓存（模块级）：probe 阶段用 HEAD 请求探测设备图是否存在。
 * 存在才挂载 <img>，不存在直接渲染 SVG 剪影 —— 避免浏览器对缺失图片打出 404 资源错误。
 * 缓存与探测统一使用「解析后」的完整路径（含 Vite base），子路径部署下同样命中缓存。
 */
const imageAvailability = new Map<string, boolean>()

/** 解析设备图地址：拼接 Vite base，兼容 GitHub Pages 项目站子路径（如 /lineage/） */
function resolveImageSrc(image: string): string {
  return `${import.meta.env.BASE_URL}${image.replace(/^\//, '')}`
}

/**
 * 设备图片：优先 /devices/{slug}.png；缺失或加载失败回退 SVG 剪影，绝不裂图。
 * 默认懒加载（performance 规范）。
 */
export function DeviceImage({ device, className, eager = false }: DeviceImageProps) {
  const imageSrc = resolveImageSrc(device.image)
  const [status, setStatus] = useState<'probe' | 'ok' | 'missing'>(() => {
    const known = imageAvailability.get(imageSrc)
    return known === true ? 'ok' : known === false ? 'missing' : 'probe'
  })

  useEffect(() => {
    const known = imageAvailability.get(imageSrc)
    if (known !== undefined) {
      setStatus(known ? 'ok' : 'missing')
      return
    }
    if (status !== 'probe') {
      // 换到一张尚未探测过的图时，重新进入探测态
      setStatus('probe')
      return
    }
    let cancelled = false
    fetch(imageSrc, { method: 'HEAD' })
      .then((response) => {
        const available = response.ok
        imageAvailability.set(imageSrc, available)
        if (!cancelled) setStatus(available ? 'ok' : 'missing')
      })
      .catch(() => {
        imageAvailability.set(imageSrc, false)
        if (!cancelled) setStatus('missing')
      })
    return () => {
      cancelled = true
    }
  }, [imageSrc, status])

  if (status !== 'ok') {
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
      onError={() => {
        imageAvailability.set(imageSrc, false)
        setStatus('missing')
      }}
      className={className}
    />
  )
}
