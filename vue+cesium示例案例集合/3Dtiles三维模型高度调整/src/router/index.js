import { createRouter, createWebHistory } from 'vue-router';
import Map3DtilesAdjust from '../components/Map3DtilesAdjust.vue';

// 定义路由表
const routes = [
  {
    path: '/',
    redirect: '/Map3DtilesAdjust'
  },
  {
    path: '/Map3DtilesAdjust',
    name: 'Map3DtilesAdjust',
    component: Map3DtilesAdjust,
    meta: {
      title: 'vue3+cesium示例:3Dtiles模型调整'
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由前置守卫，设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router