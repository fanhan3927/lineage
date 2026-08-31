# 分步提示词（直接复制给 Coding Agent）

按顺序提交。每步预览通过后再进行下一步。以同目录 PRD.md、TECH_DESIGN.md、AGENTS.md 为准。

---

## 1. 初始化项目与 i18n 骨架

根据 PRD.md、TECH_DESIGN.md、AGENTS.md 初始化 React 18 + TypeScript + Vite，安装 Tailwind CSS、framer-motion、recharts。

全局浅色：`body` 背景 `#f5f5f7`，文字 `#1d1d1f`，字体栈含 `-apple-system` 与 `PingFang SC`。

创建目录结构。实现：

- `types/device.ts`
- `i18n/zh.ts`、`i18n/en.ts`、`I18nProvider.tsx`、`LanguageSwitch.tsx`
- `Navbar.tsx`（锚点：概览、里程碑、价格、芯片、规格）
- `Footer.tsx`（含「非 Apple 官方网站」中英双语）

`App.tsx` 用 Provider 包好，Hero 占位标题随语言切换。语言写入 `localStorage`。`npm run dev` 可运行。

---

## 2. 完整设备与芯片数据

按 TECH_DESIGN 的 `Device` / `ChipGen` 类型填写：

- `src/data/iphones.ts`：2007 至构建时最新正式发售 iPhone（含 SE / mini / Plus / Pro / Pro Max / Air 等零售系列）
- `src/data/ipads.ts`：2010 至今 iPad / Air / mini / Pro（不同尺寸分开）
- `src/data/chips.ts`：A4 起到最新 A / M，带 single/multi 指数（可用公开 Geekbench 量级或相对指数，并在文件头注释口径）
- `src/data/milestones.ts`：重点机型 id 列表 + 短历史说明（自撰，勿抄官网长文）

字段必须能支撑图表和表：`year`、`launchPriceUSD`、`chip`、`ramGB`、`displayInches`、`resolution`、`camera`、`battery`。未知写合理公开值或留空并在 UI 显示 —。

`useDevices.ts` 提供合并列表、按 line / year / 搜索过滤。此步可暂用 SVG 占位图。

---

## 3. Hero + 全景陈列 + 详情

- `Hero.tsx`：标题、引言、由 data 算出的 iPhone / iPad 数量
- `ProductFilter.tsx`：全部 / iPhone / iPad，可选按年代分组
- `DeviceGrid.tsx` + `DeviceCard.tsx`：图、名称、年、芯片；视口内 stagger 微动效
- `DeviceDetail.tsx`：Modal/Drawer，双语 summary + 规格列表 + 首发价

无图时用统一剪影组件，禁止裂图。点击卡片打开详情，Esc 关闭。

---

## 4. 里程碑章节

`MilestoneSection`：深色或浅色交替的重点机型大卡片（初代 iPhone、4、6、X、12、当代 Pro；初代 iPad、初代 Pro、当代 M 系列 Pro 等）。

大图区 + 年份 + 意义短句 + 3–5 规格。`whileInView` 一次触发。加入 sticky 年份或进度不是必须，有则更好。

---

## 5. 首发定价演变图

`PriceChart.tsx` + `ChartTooltip.tsx`：

- Tab：iPhone / iPad
- 折线：建议「标准机起售」与「Pro 起售」两条，点对应具体 Device
- 自定义 Tooltip：对齐当前点，显示该机型图（或剪影）、全名、年份、`$xxx`（中文界面标注「首发起售价（美元）」）
- 验证：快速划过相邻点，浮层内容必须跟着变，不能串机

移动端 tap 选中后在图下显示同一信息卡。

---

## 6. 芯片性能演变图

`ChipChart.tsx`：A 系列（及可选 M 系列 Tab）。多核主折线，单核可虚线。Hover 显示芯片名、代表机型、分数。

图下固定口径说明（中英随语言）。数据来自 `chips.ts`。

---

## 7. 完整规格对比表

`SpecTable.tsx` + `SpecFilters.tsx`：

列：发售年份、机型、产品线、芯片、内存、屏幕尺寸、分辨率、相机、电池。

功能：产品线筛选、年份排序、名称/芯片搜索、最多 4 行勾选高亮对比。表头 sticky，第一列可 sticky。移动端外包横向滚动。

空搜索要有双语空状态。

---

## 8. 联调、动效与移动端

- 锚点滚动与 Navbar 当前段高亮
- `prefers-reduced-motion` 降级
- 检查漏翻文案、漏机型、价格图串点、表横向裁切
- 图片懒加载；补 `public/devices` 命名约定说明
- README：如何改数据、如何加一代新机、版权声明
- 按 AGENTS.md 验收清单勾选

---

## 9. 部署（可选）

`vite build` 通过后部署 Vercel / Netlify。确认 `public/devices` 静态资源路径。
