<template>
  <div id="map"></div>
  <div class="titleContainer center">
    <span>vue+leaflet示例:在线地图切换显示</span>
  </div>
  <el-button type="danger" class="bdBtn" @click="onClickBDMap"
    >百度地图</el-button
  >
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
// import { localSet } from "@/utils";
import L from "leaflet";
// import "leaflet/dist/leaflet.css";
import config from "../config";
import { useRouter } from 'vue-router';
const router = useRouter();
let map = null;
// const mapDiv = ref(null);
// const state = reactive({
//   mapdata: {
//     zoom: "",
//     center: "",
//   },
// });
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
  const baseLayer4 = L.tileLayer(config.baseMaps[3].Url, {
    subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
  }); //天地图街道图
  const baseLayer5 = L.tileLayer(config.baseMaps[4].Url, {
    subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
  }); //天地图影像图
  // const baseLayer6 = L.tileLayer(config.baseMaps[5].Url); //谷歌街道图
  // const baseLayer7 = L.tileLayer(config.baseMaps[6].Url); //谷歌影像图
  const baseLayer8 = L.tileLayer(config.baseMaps[7].Url, {
    subdomains: ["1", "2", "3", "4"],
  }); //高德街道图
  const baseLayer9 = L.tileLayer(config.baseMaps[8].Url, {
    subdomains: ["1", "2", "3", "4"],
  }); //高德影像图

  map.addLayer(baseLayer2); //地图默认加载的底图
  const baseLayers = {
    OSM街道图: baseLayer1,
    ArcGIS影像图: baseLayer2,
    ArcGIS街道图: baseLayer3,
    天地图街道图: baseLayer4,
    天地图影像图: baseLayer5,
    // 谷歌街道图: baseLayer6,
    // 谷歌影像图: baseLayer7,
    高德街道图: baseLayer8,
    高德影像图: baseLayer9,
  };
  //底图切换控件
  L.control.layers(baseLayers, null).addTo(map);
};
const onClickBDMap = async () => {
  router.push({
    path: "/bdmap",
  });
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
.bdBtn {
  position: absolute;
  top: 70px;
  right: 10px;
  z-index: 999;
}
</style>
