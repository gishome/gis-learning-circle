import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/',
      redirect: '/basemapGalleryMap'
    },
    {
      path: '/basemapGalleryMap',
      name: 'basemapGalleryMap',
      component: () => import('../views/basemapGalleryMap.vue')
    },
  ]
})

export default router