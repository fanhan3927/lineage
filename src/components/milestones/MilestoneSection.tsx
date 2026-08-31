import { useMemo } from 'react'
import { useI18n } from '@/i18n/I18nProvider'
import { resolveMilestoneDevices } from '@/hooks/useDevices'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { MilestoneCard } from './MilestoneCard'

/** 里程碑章节：9 个重点机型，深浅交替大卡片 */
export function MilestoneSection() {
  const { t } = useI18n()
  const items = useMemo(() => resolveMilestoneDevices(), [])

  return (
    <section id="milestones" className="scroll-mt-16 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title={t('milestones.title')} subtitle={t('milestones.sub')} />
        <div className="mt-10 space-y-6 md:space-y-8">
          {items.map(({ milestone, device }, index) => (
            <MilestoneCard key={milestone.deviceId} milestone={milestone} device={device} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
