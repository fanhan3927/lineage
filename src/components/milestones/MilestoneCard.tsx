import { motion, useReducedMotion } from 'framer-motion'
import type { Device, Milestone } from '@/types/device'
import { useI18n } from '@/i18n/I18nProvider'
import { localizedText } from '@/lib/format'
import { DeviceImage } from '@/components/gallery/DeviceImage'

interface MilestoneCardProps {
  milestone: Milestone
  device: Device
  /** 交错方向，让相邻卡片轻微错开 */
  index: number
}

/** 里程碑大卡片：深浅交替、大图 + 年份 + 意义短句 + 3–5 条规格，whileInView 一次触发 */
export function MilestoneCard({ milestone, device, index }: MilestoneCardProps) {
  const { locale } = useI18n()
  const reduceMotion = useReducedMotion()
  const dark = milestone.tone === 'dark'

  return (
    <motion.article
      initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1], delay: (index % 2) * 0.08 }}
      className={`overflow-hidden rounded-3xl shadow-[0_2px_12px_rgb(0_0_0/0.06)] ring-1 ${
        dark ? 'bg-black text-white ring-white/10' : 'bg-card text-ink ring-black/5'
      }`}
    >
      <div className="grid gap-0 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* 大图区 */}
        <div
          className={`flex min-h-56 items-center justify-center p-8 md:min-h-[22rem] ${
            dark ? 'bg-gradient-to-b from-white/8 to-white/2' : 'bg-gradient-to-b from-[#fafafa] to-[#f0f0f2]'
          }`}
        >
          <DeviceImage
            device={device}
            className="max-h-56 w-auto max-w-[70%] object-contain drop-shadow-xl md:max-h-72"
          />
        </div>

        {/* 文案区 */}
        <div className="flex flex-col justify-center p-7 md:p-10">
          <p className={`text-5xl font-semibold tracking-tighter tabular-nums md:text-6xl ${dark ? 'text-white/90' : 'text-ink'}`}>
            {milestone.year}
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight md:text-2xl">
            {localizedText(milestone.title, locale)}
          </h3>
          <p className={`mt-3 text-sm leading-relaxed md:text-base ${dark ? 'text-white/70' : 'text-sub'}`}>
            {localizedText(milestone.text, locale)}
          </p>

          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {milestone.specs.map((spec, specIndex) => (
              <li
                key={specIndex}
                className={`flex items-start gap-2 text-xs leading-relaxed md:text-sm ${
                  dark ? 'text-white/80' : 'text-ink/80'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-[0.45rem] h-1 w-1 shrink-0 rounded-full ${dark ? 'bg-white/50' : 'bg-accent'}`}
                />
                {localizedText(spec, locale)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.article>
  )
}
