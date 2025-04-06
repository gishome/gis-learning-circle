<template>
  <div class="left" id="LMap"></div>
  <div class="right" id="RMap"></div>
  <div class="titleContainer center">
    <span>vue+leaflet示例:地图分屏对比展示</span>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import L from "leaflet";
import config from "../config";
import { useRouter } from "vue-router";
import handPointerImg from "@/assets/hand_pointer.png";
const router = useRouter();
let LMap = null;
let RMap = null;
let userconfig = {};
onMounted(() => {
  initMap();
});
const initMap = () => {
  //左侧地图
  LMap = L.map("LMap", {
    attributionControl: false,
  }).setView(config.mapInitParams.center, config.mapInitParams.zoom);
  //右侧地图
  RMap = L.map("RMap", {
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
  LMap.addLayer(baseLayer2); //地图默认加载的底图
  RMap.addLayer(baseLayer3); //地图默认加载的底图
  const baseLayers = {
    OSM街道图: baseLayer1,
    // ArcGIS影像图: baseLayer2,
    ArcGIS街道图: baseLayer3,
    天地图街道图: baseLayer4,
    天地图影像图: baseLayer5,
    // 谷歌街道图: baseLayer6,
    // 谷歌影像图: baseLayer7,
    高德街道图: baseLayer8,
    高德影像图: baseLayer9,
  };
  //底图切换控件
  // L.control.layers(baseLayers, null).addTo(LMap); //左侧地图底图切换
  L.control.layers(baseLayers, null).addTo(RMap); //右侧地图底图切换
  //监听地图移动完成事件
  userconfig.maps = [LMap, RMap];
  userconfig.maps.map(function (t) {
    t.on({ drag: maplink, zoom: maplink });
  });
  //地图联动实现
  function maplink(e) {
    var _this = this;
    userconfig.maps.map(function (t) {
      t.setView(_this.getCenter(), _this.getZoom());
    });
  }
  //监听地图移动事件
  LMap.on("mousemove", onMoveMap);
  //监听地图移动事件
  RMap.on("mousemove", onMoveMap);
};
const onMoveMap = async (e) => {
  if (userconfig.marker) userconfig.marker.remove();
  let myIcon = L.icon({
    iconUrl: handPointerImg,
    iconSize: [17, 23],
  });
  if (e.target._container.id === "LMap") {
    //操作右侧地图
    userconfig.marker = L.marker(e.latlng, { icon: myIcon }).addTo(RMap);
  } else {
    //操作左侧地图
    userconfig.marker = L.marker(e.latlng, { icon: myIcon }).addTo(LMap);
  }
};
</script>

<style scoped>
.left {
  width: 50%;
  height: 100%;
  float: left;
}
.right {
  width: 50%;
  height: 100%;
  float: left;
}
.titleContainer {
  position: absolute;
  top:80px;
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
