import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { Device } from '@/types/device'
import { useI18n } from '@/i18n/I18nProvider'
import { DeviceImage } from './DeviceImage'

interface DeviceCardProps {
  device: Device
  onSelect: (device: Device) => void
  /** 用于网格 stagger 的序号（组内） */
  index?: number
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] } },
}

/** 设备卡片：图 + 名称 + 年份 + 芯片一句话，点击打开详情 */
export function DeviceCard({ device, onSelect, index = 0 }: DeviceCardProps) {
  const { t, locale } = useI18n()
  const reduceMotion = useReducedMotion()

  return (
    <motion.li
      variants={cardVariants}
      transition={{ delay: reduceMotion ? 0 : (index % 8) * 0.03 }}
      className="list-none"
    >
      <button
        type="button"
        onClick={() => onSelect(device)}
        aria-label={t('gallery.openDetail').replace('{name}', device.name)}
        className="group flex h-full w-full flex-col rounded-2xl bg-card p-4 text-left shadow-[0_1px_2px_rgb(0_0_0/0.04)] ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgb(0_0_0/0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <div className="flex h-36 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-[#fafafa] to-[#f0f0f2] p-2">
          <DeviceImage
            device={device}
            className="h-full w-auto max-w-[70%] object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
        <div className="mt-3 flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug tracking-tight">{device.name}</h3>
          {device.isMilestone && (
            <span
              title={t('milestones.title')}
              className="mt-0.5 shrink-0 rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent"
            >
              ★
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-sub">
          {device.year} · {device.chip}
        </p>
        <p className="mt-0.5 text-xs text-sub/70" lang={locale === 'zh' ? 'zh-CN' : 'en'}>
          {device.launchPriceUSD != null ? `$${device.launchPriceUSD}` : '—'}
        </p>
      </button>
    </motion.li>
  )
}
