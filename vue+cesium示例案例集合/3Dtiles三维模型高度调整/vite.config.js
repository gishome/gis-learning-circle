import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), cesium()],
  server: {
    port: 3001, // 指定固定端口号
    open: true // 启动时自动打开浏览器
  }
})
