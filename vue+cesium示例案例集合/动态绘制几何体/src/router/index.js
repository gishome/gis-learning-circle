import { createRouter, createWebHistory } from 'vue-router';
import MapGeometry from '../components/MapGeometry.vue';

// 定义路由表
const routes = [
  {
    path: '/',
    redirect: '/MapGeometry'
  },
  {
    path: '/MapGeometry',
    name: 'MapGeometry',
    component: MapGeometry,
    meta: {
      title: 'vue3+cesium示例:动态绘制几何体'
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