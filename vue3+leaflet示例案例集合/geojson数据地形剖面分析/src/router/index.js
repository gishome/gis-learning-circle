import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/',
      redirect: '/elevationMap'
    },
    {
      path: '/elevationMap',
      name: 'elevationMap',
      component: () => import('../views/elevationMap.vue')
    },
  ]
})

export default router