/// <reference types="vite/client" />

/** 构建期由 deviceImageManifest 插件生成：public/devices/ 下的图片文件名列表 */
declare module 'virtual:device-images' {
  const files: string[]
  export default files
}
