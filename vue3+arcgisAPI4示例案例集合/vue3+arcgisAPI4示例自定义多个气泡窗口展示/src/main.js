import { createApp } from 'vue'

// import Cookies from 'js-cookie'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/es/locale/lang/zh-cn'

// import '@/assets/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
// import esriConfig from "@arcgis/core/config.js"
// import directive from './directive' // directive

// esriConfig.assetsPath = "./assets"

// 注册指令
// import plugins from './plugins' // plugins
// import { download } from '@/utils/request'

// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'
import elementIcons from '@/components/SvgIcon/svgicon'

import './permission' // permission control

const app = createApp(App)
app.use(router)
app.use(store)
// app.use(plugins)
app.use(elementIcons)
app.component('svg-icon', SvgIcon)

// directive(app)

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: locale,
  // 支持 large、default、small
  size: 'default'
})

app.mount('#app')
