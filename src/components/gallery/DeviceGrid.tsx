import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { Device } from '@/types/device'
import { DeviceCard } from './DeviceCard'

interface DeviceGridProps {
  devices: Device[]
  onSelect: (device: Device) => void
}

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
}

/** 设备网格：进入视口时子卡 stagger 浮现（reduced-motion 时只 fade 不位移） */
export function DeviceGrid({ devices, onSelect }: DeviceGridProps) {
  const reduceMotion = useReducedMotion()
  const parentVariants: Variants = reduceMotion ? { hidden: {}, show: {} } : gridVariants

  return (
    <motion.ul
      variants={parentVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
    >
      {devices.map((device, index) => (
        <DeviceCard key={device.id} device={device} index={index} onSelect={onSelect} />
      ))}
    </motion.ul>
  )
}
