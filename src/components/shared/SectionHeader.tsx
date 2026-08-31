interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

/** 章节标题的统一样式（大标题紧、副文 #6e6e73） */
export function SectionHeader({ eyebrow, title, subtitle, align = 'left' }: SectionHeaderProps) {
  const centered = align === 'center'
  return (
    <div className={centered ? 'text-center' : undefined}>
      {eyebrow && (
        <p className="text-sm font-medium tracking-wide text-accent">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className={`mt-3 max-w-2xl text-base leading-relaxed text-sub ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
