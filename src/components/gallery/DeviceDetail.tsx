import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Device } from '@/types/device'
import { useI18n } from '@/i18n/I18nProvider'
import { formatDate, formatGBList, formatUSD, localizedText } from '@/lib/format'
import { DeviceImage } from './DeviceImage'

interface DeviceDetailProps {
  device: Device | null
  onClose: () => void
}

/** 详情 Modal：双语 summary + 规格列表 + 首发价；Esc / 点击遮罩关闭 */
export function DeviceDetail({ device, onClose }: DeviceDetailProps) {
  const { t, locale } = useI18n()
  const reduceMotion = useReducedMotion()

  // Esc 关闭 + 打开期间锁定页面滚动
  useEffect(() => {
    if (!device) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [device, onClose])

  const specs: Array<{ label: string; value: string }> = device
    ? [
        { label: t('detail.launched'), value: formatDate(device.launchedAt, locale) },
        { label: t('detail.chip'), value: device.chip },
        { label: t('detail.ram'), value: formatGBList(device.ramGB) },
        { label: t('detail.storage'), value: formatGBList(device.storageGB) },
        { label: t('detail.display'), value: device.displayInches != null ? `${device.displayInches}"` : '—' },
        { label: t('detail.resolution'), value: device.resolution ?? '—' },
        { label: t('detail.camera'), value: localizedText(device.camera, locale) },
        { label: t('detail.battery'), value: device.battery ?? '—' },
      ]
    : []

  return (
    <AnimatePresence>
      {device && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={device.name}
        >
          <motion.div
            key="panel"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 48, scale: 0.98 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-card p-6 shadow-2xl sm:rounded-3xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-40 flex-1 items-center justify-center rounded-2xl bg-gradient-to-b from-[#fafafa] to-[#f0f0f2] p-4">
                <DeviceImage
                  device={device}
                  eager
                  className="max-h-full w-auto max-w-[60%] object-contain drop-shadow"
                />
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('detail.close')}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 text-sub transition-colors hover:bg-black/10 hover:text-ink"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1.5 1.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <p className="mt-5 text-xs font-medium tracking-wide text-accent">
              {device.year} · {device.line === 'iphone' ? 'iPhone' : 'iPad'}
            </p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight">{device.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-sub">{localizedText(device.summary, locale)}</p>
            {device.notable && (
              <p className="mt-2 rounded-xl bg-accent/5 px-3 py-2 text-sm leading-relaxed text-ink/80">
                <span className="font-medium">{t('detail.notable')}</span>
                {localizedText(device.notable, locale)}
              </p>
            )}

            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-black/5 pt-5 text-sm">
              {specs.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-xs text-sub">{spec.label}</dt>
                  <dd className="mt-0.5 font-medium text-ink/90">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex items-baseline justify-between border-t border-black/5 pt-4">
              <span className="text-xs text-sub">{t('detail.priceNoteUSD')}</span>
              <span className="text-xl font-semibold tracking-tight">{formatUSD(device.launchPriceUSD)}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
