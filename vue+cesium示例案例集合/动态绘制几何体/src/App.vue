<script setup>
// 不再直接引入CesiumMap组件，而是通过路由加载
</script>

<template>
  <!-- 使用router-view作为路由出口 -->
  <router-view />
</template>

<style>
/* 全局样式，确保地图容器能够占满整个视口 */
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
