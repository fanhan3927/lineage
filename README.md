# Lineage · 历代 iPhone 与 iPad

苹果官网风格的**非官方**产品史可视化站点：陈列 2007 年至今正式发售的全部 iPhone 与 iPad，
支持中英文切换、里程碑卡片、首发价格折线图（Hover 出图 + 价格）、芯片性能演变图与完整规格对比表。

> 本站为粉丝向 / 教育向页面，**非 Apple 官方网站**；Apple、iPhone、iPad 等商标归 Apple Inc.
> 及其权利人所有。规格与价格整理自公开资料，仅供学习参考。

## 技术栈

React 18 · TypeScript（strict） · Vite 5 · Tailwind CSS v4 · Framer Motion · Recharts · 自研轻量 i18n（Context + 字典，无 i18next 依赖）

## 快速开始

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 类型检查 + 产物构建（dist/）
npm run preview    # 本地预览构建产物
```

## 目录结构

```
src/
  components/
    layout/      Navbar（锚点+滚动高亮）、Footer（非官方声明）、LanguageSwitch
    hero/        Hero（统计数字由 data 计算）
    gallery/     ProductFilter / DeviceGrid / DeviceCard / DeviceDetail / DeviceImage / DeviceSilhouette
    milestones/  MilestoneSection / MilestoneCard
    charts/      PriceChart / ChipChart / ChartTooltip（价格 Tooltip）
    table/       SpecTable / SpecFilters
    shared/      SectionHeader
  data/          iphones.ts / ipads.ts / chips.ts / milestones.ts   ← 所有数据都在这里
  hooks/         useDevices.ts（合并+过滤+统计）、useMediaQuery.ts
  i18n/          zh.ts / en.ts / I18nProvider.tsx / LanguageSwitch.tsx
  lib/           format.ts
  types/         device.ts（Device / ChipGen / Milestone 唯一定义）
public/devices/  设备小图（可选），见 public/devices/README.md
```

## 如何改数据

- **机型数据**：`src/data/iphones.ts`、`src/data/ipads.ts`，每台设备一条 `Device` 记录。
  字段口径见各文件头部注释；不确定的值留 `null`（UI 显示「—」），**不要编造**。
- **芯片数据**：`src/data/chips.ts`，单/多核为公开 Geekbench 6 量级的近似整数（口径见文件头），
  图表会自动带出口径说明。
- **里程碑**：`src/data/milestones.ts`，`deviceId` 必须能在机型数据中找到；说明文字请自撰短句。
- **UI 文案**：`src/i18n/zh.ts` 与 `en.ts`。key 集合通过类型强约束（en 必须覆盖 zh 的全部 key），
  新增 key 后两边都要补，否则 `tsc` 报错。
- 组件一律不写死机型列表，全部经 `src/hooks/useDevices.ts` 读取数据。

## 如何加一代新机（示例：假设明年发布 iPhone 18）

1. 在 `src/data/iphones.ts` 末尾追加一条记录（复制相邻机型改字段）：

   ```ts
   {
     id: 'iphone-18',
     slug: 'iphone-18',
     line: 'iphone',
     family: 'standard',
     name: 'iPhone 18',
     launchedAt: '2027-09-24',
     year: 2027,
     chip: 'A20',
     ramGB: [8],
     storageGB: [256, 512],
     displayInches: 6.3,
     resolution: '2622×1206',
     camera: { zh: '4800 万双摄', en: '48MP dual' },
     battery: '3800 mAh',
     batteryUnit: 'mAh',
     launchPriceUSD: 799,
     image: '/devices/iphone-18.png',
     summary: { zh: '……（一句话定位）', en: '……' },
     notable: { zh: '相比上一代的关键差异', en: 'Key change vs previous' },
   }
   ```

2. 若有新芯片：在 `src/data/chips.ts` 追加 A 系列条目（补 single/multi 近似分与代表机型）。
3. 若它够里程碑资格：在 `src/data/milestones.ts` 加一条（注意 `tone` 深浅交替）。
4. 想让它出现在价格折线：把 `id` 加进 `src/components/charts/PriceChart.tsx`
   顶部 `SERIES` 对应产品线的 `deviceIds`。
5. 放一张 `public/devices/iphone-18.png`（≤400px 宽透明底）；没有图也没关系，会自动显示 SVG 剪影。

iPad 同理（`ipads.ts`，不同屏幕尺寸分开条目）。

## 数据口径与版权

- 价格为**美国发布会起售价（USD）**；2008–2015 年为两年合约价，2016 年起为整机价（图注已说明）。
- 电池：iPhone 统一 mAh（公开拆解口径），iPad 统一 Wh（官方标称口径），规格表下有注。
- 芯片分数为公开第三方跑分（Geekbench 6 量级）的近似值，非 Apple 官方数据。
- 文案（summary / notable / 里程碑说明）均为自撰短句，未复制 Apple 官网营销文案。
- `public/devices/` 图片由构建期清单自动检测（vite 插件 `virtual:device-images`）：
  无图机型自动回退 SVG 剪影，不会发 404 请求；新增图片后重新构建即生效
  （dev 模式需重启 dev server）。如替换为官方新闻室图片，请自行确认授权，勿热链 Apple CDN。

## 部署

### GitHub Pages（已配置，自动部署）

仓库带 `.github/workflows/deploy.yml`：推送到 `main` 即自动构建并发布到 GitHub Pages。

- 线上地址：`https://fanhan3927.github.io/lineage/`
- 项目站位于 `/lineage/` 子路径：CI 构建时注入 `VITE_BASE=/lineage/`
  （`vite.config.ts` 读取该变量设置 `base`），设备图路径经 `import.meta.env.BASE_URL`
  解析，子路径下不会 404
- 首次启用：仓库 Settings → Pages → Source 选 **GitHub Actions**；
  或用 `gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow`
- 手动重部署：Actions 页面运行 **Deploy to GitHub Pages**（workflow_dispatch）

### 其他平台

`npm run build` 产物在 `dist/`，纯静态站点：

- **Vercel**：框架选 Vite，构建命令 `npm run build`，输出目录 `dist`；
- **Netlify**：构建命令同上，发布目录 `dist`；
- `public/devices/` 下的图片会原样拷贝进 `dist/devices/`，根路径部署时相对路径
  `/devices/*.png` 可直接使用；子路径部署时组件已按 `base` 自动解析。

## 无障碍与动效

- 全站尊重 `prefers-reduced-motion`：减少位移、只保留淡入淡出；
- 详情 Modal 支持 Esc 关闭与 `aria-modal`；语言切换带 `aria-pressed`；
- 图表在触屏设备上改为「点选数据点 → 下方固定信息卡」的交互。
