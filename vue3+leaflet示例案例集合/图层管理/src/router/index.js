import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/',
      redirect: '/onlineSelfMap'
    },
    {
      path: '/onlineSelfMap',
      name: 'onlineSelfMap',
      component: () => import('../views/onlineSelfMap.vue')
    },
  ]
})

export default router