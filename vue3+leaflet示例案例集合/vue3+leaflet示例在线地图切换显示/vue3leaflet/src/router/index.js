import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/',
      redirect: '/onlinemap'
    },
    {
      path: '/onlinemap',
      name: 'onlinemap',
      component: () => import('../views/onlineMap.vue')
    },
    {
      path: '/bdmap',
      name: 'bdmap',
      component: () => import('../views/bdMap.vue')
    },
  ]
})

export default router