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
 * 图片可用性缓存（模块级）：probe 阶段用 HEAD 请求探测 /devices/{slug}.png 是否存在。
 * 存在才挂载 <img>，不存在直接渲染 SVG 剪影 —— 避免浏览器对缺失图片打出 404 资源错误。
 */
const imageAvailability = new Map<string, boolean>()

/**
 * 设备图片：优先 /devices/{slug}.png；缺失或加载失败回退 SVG 剪影，绝不裂图。
 * 默认懒加载（performance 规范）。
 */
export function DeviceImage({ device, className, eager = false }: DeviceImageProps) {
  const [status, setStatus] = useState<'probe' | 'ok' | 'missing'>(() => {
    const known = imageAvailability.get(device.image)
    return known === true ? 'ok' : known === false ? 'missing' : 'probe'
  })

  useEffect(() => {
    const known = imageAvailability.get(device.image)
    if (known !== undefined) {
      setStatus(known ? 'ok' : 'missing')
      return
    }
    if (imageAvailability.has(device.image) === false && status !== 'probe') {
      // 新的 device.image 进来时重新进入探测态
      setStatus('probe')
      return
    }
    let cancelled = false
    fetch(device.image, { method: 'HEAD' })
      .then((response) => {
        const available = response.ok
        imageAvailability.set(device.image, available)
        if (!cancelled) setStatus(available ? 'ok' : 'missing')
      })
      .catch(() => {
        imageAvailability.set(device.image, false)
        if (!cancelled) setStatus('missing')
      })
    return () => {
      cancelled = true
    }
  }, [device.image, status])

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
      src={device.image}
      alt={device.name}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onError={() => {
        imageAvailability.set(device.image, false)
        setStatus('missing')
      }}
      className={className}
    />
  )
}
