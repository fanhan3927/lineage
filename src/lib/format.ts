import type { Locale, Localized } from '@/types/device'

/** Localized 字段取值；缺失统一显示 '—'（对应「不确定就留 null」的数据规范） */
export function localizedText(value: Localized | null | undefined, locale: Locale): string {
  if (!value) return '—'
  return locale === 'zh' ? value.zh : value.en
}

/** 首发起售价：$1,199 风格；null 显示 '—' */
export function formatUSD(price: number | null | undefined): string {
  if (price == null) return '—'
  return `$${price.toLocaleString('en-US')}`
}

/** ISO 日期按 locale 格式化（zh-CN / en-US） */
export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** 字典模板变量替换：'{n} 款 iPhone' + { n: 48 } */
export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  )
}

/** 数字数组（内存/存储档位）→ '6 / 8 GB'；空数组显示 '—' */
export function formatGBList(values: number[] | null | undefined): string {
  if (!values || values.length === 0) return '—'
  return values.map((v) => (v >= 1024 ? `${v / 1024}TB` : `${v}GB`)).join(' / ')
}
