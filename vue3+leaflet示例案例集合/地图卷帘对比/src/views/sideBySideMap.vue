<template>
  <div id="map"></div>
  <div class="titleContainer center">
    <span>vue+leaflet示例:地图卷帘对比</span>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import L from "leaflet";
import "./leaflet-side-by-side";
import config from "../config";
let map = null;
onMounted(() => {
  initMap();
});
const initMap = () => {
  // 创建地图对象
  map = L.map("map", {
    attributionControl: false,
  }).setView(config.mapInitParams.center, config.mapInitParams.zoom);
  //创建底图切换数据源
  const baseLayer1 = L.tileLayer(config.baseMaps[0].Url); //OSM街道图
  const baseLayer2 = L.tileLayer(config.baseMaps[1].Url); //ArcGIS影像图
  const baseLayer3 = L.tileLayer(config.baseMaps[2].Url); //ArcGIS街道图

  map.addLayer(baseLayer1); //左侧默认卷帘图层
  map.addLayer(baseLayer2); //右侧默认卷帘图层

  const leftLayers = [baseLayer1];
  const rightLayers = [baseLayer2];
  //卷帘地图效果
  L.control.sideBySide(leftLayers, rightLayers).addTo(map);
};
</script>

<style scoped>
#map {
  width: 100vw;
  height: 100vh;
}
.titleContainer {
  position: absolute;
  top: 0;
  background: rgba(0, 0, 0, 0.45);
  height: 50px;
  width: 100vw;
  z-index: 999;
  font-size: 14px;
  color: #fff;
  font-size: 28px;
}
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
