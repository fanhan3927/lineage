# public/devices — 设备图片目录

放置各机型的产品小图（透明底 PNG，宽 ≤ 400px），文件名与 `Device.slug` 一致：

    public/devices/{slug}.png     例：public/devices/iphone-15-pro-max.png

- `Device.slug` 定义在 `src/data/iphones.ts` / `src/data/ipads.ts`
- 图片存在与否由**构建期清单**自动检测（vite 插件扫描本目录），无图机型自动回退
  SVG 剪影（`DeviceSilhouette` 组件），不会出现裂图，也不会发出 404 请求
- 新增图片后：dev 模式需重启 `npm run dev` 刷新清单；生产部署重新 `npm run build` 即可
- 图片在卡片/详情中均懒加载（`loading="lazy"`），请保持小尺寸，勿放大图
- 版权提示：请勿热链 Apple CDN；如替换为官方新闻室新闻图，仅限本地开发预览，
  发布前需自行确认素材授权
