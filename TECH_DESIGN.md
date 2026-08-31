# 技术设计

## 技术栈

- React 18 + TypeScript + Vite
- Tailwind CSS
- Framer Motion（区块进入、卡片、语言切换时的短 fade）
- Recharts（折线 / 面积图；Tooltip 可定制）
- 自研轻量 i18n（Context + `zh.ts` / `en.ts`），不强制 i18next
- 单页 + 锚点滚动；不必 React Router
- 设备图：`public/devices/{slug}.png`；缺失时用 SVG 剪影占位

## 项目结构

```
src/
  components/
    layout/
      Navbar.tsx
      Footer.tsx
      LanguageSwitch.tsx
    hero/
      Hero.tsx
    gallery/
      ProductFilter.tsx
      DeviceGrid.tsx
      DeviceCard.tsx
      DeviceDetail.tsx      # Modal 或右侧 Drawer
    milestones/
      MilestoneSection.tsx
      MilestoneCard.tsx
    charts/
      PriceChart.tsx
      ChipChart.tsx
      ChartTooltip.tsx      # 含机型图 + 价格/芯片
    table/
      SpecTable.tsx
      SpecFilters.tsx
  i18n/
    I18nProvider.tsx
    zh.ts
    en.ts
  data/
    iphones.ts
    ipads.ts
    chips.ts
    milestones.ts
  hooks/
    useDevices.ts
    useMediaQuery.ts
  types/
    device.ts
  lib/
    format.ts               # 价格、日期、电池单位
    performanceIndex.ts
  App.tsx
  main.tsx
  index.css
```

## 数据模型

```ts
export type Locale = 'zh' | 'en'
export type Line = 'iphone' | 'ipad'
export type IpadFamily = 'ipad' | 'air' | 'mini' | 'pro'
export type IphoneFamily = 'standard' | 'plus' | 'mini' | 'pro' | 'pro_max' | 'se' | 'air'

export interface Localized {
  zh: string
  en: string
}

export interface Device {
  id: string                 // 'iphone-15-pro-max'
  slug: string
  line: Line
  family: IphoneFamily | IpadFamily
  name: string               // 官方英文名
  launchedAt: string         // ISO date, e.g. '2023-09-22'
  year: number
  chip: string               // 'A17 Pro'
  ramGB: number[]            // [8] or [6, 8]
  storageGB: number[]
  displayInches: number
  resolution: string         // '2796×1290'
  camera: Localized          // 短规格，如 '48MP 主摄 + 5x 长焦'
  battery: string            // 统一 '4441 mAh' 或 '29.0 Wh'，同表同单位
  batteryUnit: 'mAh' | 'Wh'
  launchPriceUSD: number     // 起售价
  image: string              // '/devices/iphone-15-pro-max.png'
  summary: Localized
  isMilestone?: boolean
}

export interface ChipGen {
  id: string                 // 'a17-pro'
  name: string
  year: number
  kind: 'a' | 'm' | 'other'
  singleScore: number        // 相对或 Geekbench 量级
  multiScore: number
  representativeDeviceIds: string[]
}
```

数据文件按产品线拆分，用数组导出后在 `useDevices` 合并。芯片分数放 `chips.ts`，避免在每个 Device 上重复。

## 收录范围（实现时按公开资料补全，不可只做 5 个样例）

iPhone 至少覆盖：

- iPhone, 3G, 3GS
- 4, 4S
- 5, 5c, 5s
- 6, 6 Plus, 6s, 6s Plus
- SE (1/2/3)
- 7, 7 Plus
- 8, 8 Plus, X
- XR, XS, XS Max
- 11, 11 Pro, 11 Pro Max
- 12 mini/12/12 Pro/12 Pro Max
- 13 mini/13/13 Pro/13 Pro Max
- 14 / 14 Plus / 14 Pro / 14 Pro Max
- 15 / 15 Plus / 15 Pro / 15 Pro Max
- 16 / 16 Plus / 16 Pro / 16 Pro Max
- 16e（若已正式发售）
- 以及构建时已正式发布的更新一代（如 17 系列、iPhone Air 等）

iPad 至少覆盖各世代 iPad、Air、mini、Pro（多尺寸分开条目，如 11" / 13" Pro）。

价格以美国发布会起售价 USD 为准；若某机仅区域定价，在数据注释字段说明。

## i18n

```ts
// 字典只放 UI 字符串；设备文案走 Device.summary 等字段
I18nContext: { locale, setLocale, t: (key: string) => string }
```

切换时图表 `tick`、Tooltip、空状态一并变化。数字与 ISO 日期按 locale 格式化（`en-US` / `zh-CN`）。

## 图表

### 价格折线

- 默认两条线：iPhone 各年「非 Pro 起售」与「Pro 起售」；或按 family 多线但不超过 3 条以免花
- iPad 用 Tab 切到另一张图，避免挤在同一 Y 轴
- Recharts `LineChart` + 自定义 `Tooltip`
- Tooltip 必须使用该 `payload` 的 `device` 渲染图片与价格，坐标跟随 cursor，`offset` 避免遮点
- 数据点 `dot` 可命中，移动端改为 tap 选中 + 固定卡片

### 芯片性能

- X：芯片世代（A4 → 最新 A / M）
- Y：多核指数（主）+ 可选单核虚线
- iPhone 用 A 系列；iPad 可切 M 系列或同图标注
- 图下 footnote 说明数据来源口径

## 规格表

- 桌面：`position: sticky` 表头 + 第一列机型名 sticky
- 筛选：line、year range、chip、family
- 搜索：name / chip 大小写不敏感
- 对比：checkbox 最多 4；选中行 `ring`
- 行多时虚拟滚动可选；第一版 80 行内普通 table 即可

## 图片策略

- `public/devices/` 下用 slug 命名
- 无图时 `DeviceSilhouette`：按 family 的圆角矩形 + 动态岛/刘海示意即可，禁止破图图标大面积出现
- 不要热链 Apple CDN（易失效）；README 注明可替换官方新闻室新闻图（注意版权，仅开发预览）

## 状态

- `locale`：localStorage
- `galleryLine`：iphone | ipad | all
- `selectedDeviceId`：详情
- `tableQuery` / `tableFilters` / `compareIds`
- 图表 hover 用局部 state，不进全局

## 动效原则

- Framer Motion `whileInView` once，位移 12–20px，时长 0.5–0.7s
- 网格 `staggerChildren: 0.03` 左右，避免长达数秒排队
- 语言切换：内容 fade 150ms，不整页 reload
- 尊重 `prefers-reduced-motion`

## 视觉 Token

- 背景 `#f5f5f7`
- 卡片 `#ffffff`
- 深色区块 `#000000`
- 主文字 `#1d1d1f`
- 次文字 `#6e6e73`
- 分割 `#d2d2d7`
- 按钮蓝 `#0071e3`
- 最大内容宽 `1024–1120px` 居中；全景网格可 `max-w-6xl`
