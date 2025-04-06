import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/',
      redirect: '/splitScreenMap'
    },
    {
      path: '/splitScreenMap',
      name: 'splitScreenMap',
      component: () => import('../views/splitScreenMap.vue')
    },
  ]
})

export default router