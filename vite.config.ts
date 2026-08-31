import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readdirSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

/**
 * 设备图片清单（虚拟模块 virtual:device-images）：
 * 构建期扫描 public/devices/ 下的图片文件名，运行时按清单决定 <img> 还是剪影，
 * 免去运行时探测 —— 没有图片的站点不会发出任何 /devices/* 请求，控制台零 404。
 * dev 下新增图片后需重启 dev server（或重新构建）刷新清单。
 */
function deviceImageManifest(): Plugin {
  const virtualId = 'virtual:device-images'
  const resolvedVirtualId = `\0${virtualId}`
  return {
    name: 'device-image-manifest',
    resolveId(id) {
      if (id === virtualId) return resolvedVirtualId
      return undefined
    },
    load(id) {
      if (id !== resolvedVirtualId) return undefined
      const dir = fileURLToPath(new URL('./public/devices', import.meta.url))
      try {
        const files = readdirSync(dir).filter((file) => /\.(png|jpe?g|webp|avif)$/i.test(file))
        return `export default ${JSON.stringify(files)}`
      } catch {
        return 'export default []'
      }
    },
  }
}

export default defineConfig({
  // GitHub Pages 项目站部署在 /<repo>/ 子路径：CI 里用 VITE_BASE=/lineage/ 注入；
  // 本地 dev/build 不设该变量，保持根路径。
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss(), deviceImageManifest()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
})
