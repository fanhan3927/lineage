import { useMemo, useState } from 'react'
import type { Device } from '@/types/device'
import { useI18n } from '@/i18n/I18nProvider'
import { ALL_DEVICES, filterDevices } from '@/hooks/useDevices'
import { ProductFilter, type GalleryLine } from './ProductFilter'
import { DeviceGrid } from './DeviceGrid'
import { DeviceDetail } from './DeviceDetail'
import { SectionHeader } from '@/components/shared/SectionHeader'

/** 年代分组（可选开启） */
const ERAS = [
  { from: 2007, to: 2012, key: 'gallery.era.origin' },
  { from: 2013, to: 2017, key: 'gallery.era.2013' },
  { from: 2018, to: 2021, key: 'gallery.era.2018' },
  { from: 2022, to: Number.POSITIVE_INFINITY, key: 'gallery.era.2022' },
] as const

/** 全景陈列章节：筛选 + 网格 + 详情 Modal 的组合根 */
export function GallerySection() {
  const { t } = useI18n()
  const [line, setLine] = useState<GalleryLine>('all')
  const [groupByEra, setGroupByEra] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const counts = useMemo<Record<GalleryLine, number>>(
    () => ({
      all: ALL_DEVICES.length,
      iphone: ALL_DEVICES.filter((device) => device.line === 'iphone').length,
      ipad: ALL_DEVICES.filter((device) => device.line === 'ipad').length,
    }),
    [],
  )

  const filtered = useMemo(() => filterDevices(ALL_DEVICES, { line }), [line])

  const eras = useMemo(
    () =>
      ERAS.map((era) => ({
        key: era.key,
        devices: filtered.filter((device) => device.year >= era.from && device.year <= era.to),
      })).filter((era) => era.devices.length > 0),
    [filtered],
  )

  const selected: Device | null = useMemo(
    () => ALL_DEVICES.find((device) => device.id === selectedId) ?? null,
    [selectedId],
  )

  return (
    <section id="gallery" className="scroll-mt-16 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={t('gallery.title')} subtitle={t('gallery.sub')} />

        <div className="mt-6">
          <ProductFilter
            value={line}
            onChange={setLine}
            counts={counts}
            groupByEra={groupByEra}
            onGroupByEraChange={setGroupByEra}
          />
        </div>

        {groupByEra ? (
          <div className="mt-8 space-y-12">
            {eras.map((era) => (
              <div key={era.key}>
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-sub">{t(era.key)}</h3>
                <DeviceGrid devices={era.devices} onSelect={(device) => setSelectedId(device.id)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <DeviceGrid devices={filtered} onSelect={(device) => setSelectedId(device.id)} />
          </div>
        )}

        <DeviceDetail device={selected} onClose={() => setSelectedId(null)} />
      </div>
    </section>
  )
}
