/**
 * 统一的设备 / 芯片 / 里程碑类型定义（对齐 TECH_DESIGN.md 数据模型）。
 * 所有数据文件（src/data/*.ts）与 UI 组件都只依赖本文件。
 */

export type Locale = 'zh' | 'en'
export type Line = 'iphone' | 'ipad'

/** iPad 产品线：数字系列 / Air / mini / Pro（不同屏幕尺寸分开条目） */
export type IpadFamily = 'ipad' | 'air' | 'mini' | 'pro'

/**
 * iPhone 产品线：standard（数字主系）、plus、mini、pro、pro_max、se、air，
 * 另加 'x'（iPhone X 一脉的过渡旗舰，2007–2018 定价史中承接高端位）。
 */
export type IphoneFamily = 'standard' | 'plus' | 'mini' | 'pro' | 'pro_max' | 'se' | 'air' | 'x'

export interface Localized {
  zh: string
  en: string
}

export interface Device {
  /** 唯一 id，如 'iphone-15-pro-max' */
  id: string
  /** 与 public/devices/{slug}.png 对应 */
  slug: string
  line: Line
  family: IphoneFamily | IpadFamily
  /** 官方英文产品名，如 'iPhone 15 Pro Max'（不翻译） */
  name: string
  /** ISO 日期，如 '2023-09-22'（发布或开售日期，见各数据文件注释） */
  launchedAt: string
  year: number
  /** 芯片名称，如 'A17 Pro'；初代三款为 Samsung AP */
  chip: string
  /** 可选内存档位（GB），如 [6, 8]；未知留空数组，UI 显示 '—' */
  ramGB: number[]
  storageGB: number[]
  displayInches: number | null
  /** 如 '2796×1290'；未知为 null */
  resolution: string | null
  /** 短规格（自撰），如 '48MP 主摄 + 5x 长焦'；未知为 null */
  camera: Localized | null
  /** 统一写法 '4441 mAh' 或 '38.99 Wh'（iPhone 用 mAh、iPad 用 Wh，见规格表注） */
  battery: string | null
  batteryUnit: 'mAh' | 'Wh'
  /** 美国发布会首发起售价 USD；未知为 null */
  launchPriceUSD: number | null
  /** '/devices/{slug}.png'，缺失时 UI 用 SVG 剪影兜底 */
  image: string
  /** 双语一句话定位（自撰，禁止抄官网文案） */
  summary: Localized
  /** 与上一代的关键差异要点（可选，短句） */
  notable: Localized | null
  isMilestone?: boolean
}

export interface ChipGen {
  /** 如 'a17-pro' */
  id: string
  name: string
  year: number
  kind: 'a' | 'm' | 'other'
  /** 单核指数（公开 Geekbench 6 量级的近似值，口径见 chips.ts 文件头） */
  singleScore: number | null
  multiScore: number | null
  representativeDeviceIds: string[]
}

/** 里程碑卡片：绑定一个 Device，说明文字全部自撰 */
export interface Milestone {
  deviceId: string
  year: number
  title: Localized
  /** 一句话历史意义（自撰短句） */
  text: Localized
  /** 3–5 条精选规格 */
  specs: Localized[]
  /** 卡片明暗基调（交替使用） */
  tone: 'dark' | 'light'
}
