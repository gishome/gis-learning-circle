import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite' // 不加这个配置，ElMessage出不来

// https://vitejs.dev/config/
export default ({ mode }) => defineConfig({
  plugins: [
    vue(),
    // 按需引入，主题色的配置，需要加上 importStyle: 'sass'
    Components({
      resolvers: [ElementPlusResolver({
        importStyle: 'sass'
      })],
    }),
    ElementPlus()
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, 'src')
    },
  },
  base: './',
  server: {
    open: true,
    host: '0.0.0.0',
    port: 3000,
    // proxy: {
    //   '/api': {
    //     target: 'http://backend-api-02.newbee.ltd/manage-api/v1', // 凡是遇到 /api 路径的请求，都映射到 target 属性
    //     changeOrigin: true,
    //     rewrite: path => path.replace(/^\/api/, '') // 重写 api 为 空，就是去掉它
    //   }
    // }
  },
  css: {
    preprocessorOptions: {
      // 覆盖掉element-plus包中的主题变量文件
      scss: {
        additionalData: `@use "@/styles/element/index.scss" as *;`,
      },
    },
  },
  build: {
    target: 'es2020',
    /** 消除打包大小超过 500kb 警告 */
    chunkSizeWarningLimit: 2000,
    /** Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效 */
    minify: "terser",
    /** 在打包代码时移除 console.log、debugger 和 注释 */
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
        pure_funcs: ["console.log"]
      },
      format: {
        /** 删除注释 */
        comments: false
      }
    },
    outDir: `./dist`,
    /** 打包后静态资源目录 */
    assetsDir: "static"
  },
  // optimizeDeps: {
  //   esbuildOptions: {
  //     target: 'es2020'
  //   }
  // }
})
