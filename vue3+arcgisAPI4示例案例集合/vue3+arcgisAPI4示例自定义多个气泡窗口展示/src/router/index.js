import { createWebHistory, createRouter } from 'vue-router' // //history模式
// import { createWebHashHistory,createRouter } from 'vue-router'//hash模式
// 公共路由
export const constantRoutes = [
  {
    path: '/popupMap',
    component: () => import('@/views/popupMap'),
    hidden: true
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: "/",
    name: '网站首页',
    redirect: "/popupMap",
  },
]

const router = createRouter({
  history: createWebHistory(),
  // history: createWebHashHistory(),
  routes: constantRoutes
});

export default router;
