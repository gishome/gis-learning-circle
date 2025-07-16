<template>
  <div id="viewDiv">
  </div>
  <div class="titleContainer center">
    <span>vue3+arcgisAPI4示例:底图切换</span>
  </div>
  <!-- 底图切换组件 -->
  <div v-show="isShowBaseMap" id="baseMapToggle" @click="baseMapToggleOnClick">
    <el-card :body-style="bodyStyle">
      <img :src="baseMapImgSrc" class="image" />
    </el-card>
  </div>
  <div id="basemapGalleryDiv" class="basemapGalleryDiv el-tabs__content"></div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import "@arcgis/core/assets/esri/themes/light/main.css";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Home from "@arcgis/core/widgets/Home.js";
import Basemap from "@arcgis/core/Basemap.js";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery.js";
import esriConfig from "@arcgis/core/config";
import config from "../config";
import baseIMG from "@/assets/map/satellite.jpg";
import satelliteIMG from "@/assets/map/satellite.jpg";
import osmIMG from "@/assets/map/osm.jpg";
import novaIMG from "@/assets/map/Nova_Map.jpeg";
import streetsNightIMG from "@/assets/map/streets-night.jpg";
import { basemapVec_ArcGIS, basemapBlue_ArcGIS, basemapVec_tianditu, basemapImg_tianditu, basemapVec_gaode, basemapIMG_gaode, basemapIMG_baidu, basemapVec_baidu, basemapIMG_tx, basemapVec_tx } from './map';
const isShowBaseMap = ref(false);
const baseMapImgSrc = ref(baseIMG);
let view, map, basemapGallery = null;
const bodyStyle = ref({
  padding: '0px',
  width: "45px",
  height: "45px"
});
onMounted(() => {
  initMap();
});
const initMap = () => {
  esriConfig.apiKey = 'AAPKca495ea263b64e44b61eaaecdbddebfcwEQjC8k8-6XGMrrXyCie6xzybboRl4REq-TwDQTm8Wz-8sL6REARz1wcm14Kq9ny';
  // 初始化创建地图对象
  const { imageryLayer } = createBaseLayers();
  map = new Map({
    // basemap: "satellite", // 默认显示arcgis在线影像图
    basemap: imageryLayer, // 默认显示arcgis在线影像图
  });
  // 初始化创建视图view对象
  view = new MapView({
    container: "viewDiv",
    map: map,
    center: config.mapInitParams.center,
    zoom: config.mapInitParams.zoom
  });
  // 初始化创建地图默认视图控件
  const homeWidget = new Home({
    view: view
  });
  // 去除logo
  view.ui.remove(["attribution", "zoom"]);
  // 监听视图view初始化加载完成执行
  view.when(function () {
    // 初始化创建地图切换控件
    isShowBaseMap.value = true;
    const { imageryLayer, osmLayer, novaLayer, streetsNightLayer } = createBaseLayers();
    basemapGallery = new BasemapGallery({
      view: view,
      container: 'basemapGalleryDiv',
      visible: false,
      source: [imageryLayer, basemapVec_ArcGIS, basemapImg_tianditu, basemapVec_tianditu, basemapIMG_gaode, basemapVec_gaode, basemapIMG_baidu, basemapVec_baidu, basemapIMG_tx, basemapVec_tx, osmLayer, basemapBlue_ArcGIS, novaLayer, streetsNightLayer]
    });
    // 控制地图控件位置
    view.ui.add([
      {
        component: homeWidget,
        position: "bottom-right",
        index: 0
      },
      {
        component: "compass",
        position: "bottom-right",
        index: 1
      },
      {
        component: "zoom",
        position: "bottom-right",
        index: 2
      },
      {
        component: basemapGallery,
        position: "bottom-right",
        index: 3
      }
    ]);
    // 监听底图切换事件
    map?.watch("basemap", function (newValue) {
      baseMapImgSrc.value = newValue.thumbnailUrl;
    });
  });
}
// 创建底图切换图层组
const createBaseLayers = () => {
  const imageryLayer = Basemap.fromId("arcgis-imagery-standard");
  // const imageryLayer = Basemap.fromId("satellite");
  imageryLayer.title = "ArcGIS影像图";
  imageryLayer.thumbnailUrl = satelliteIMG;
  const osmLayer = Basemap.fromId("osm-standard");
  // const osmLayer = Basemap.fromId("osm");
  osmLayer.title = "OSM街道图";
  osmLayer.thumbnailUrl = osmIMG;
  const novaLayer = Basemap.fromId("arcgis-nova");
  novaLayer.title = "ArcGIS街道暗黑图";
  novaLayer.thumbnailUrl = novaIMG;
  const streetsNightLayer = Basemap.fromId("arcgis-streets-night");
  streetsNightLayer.title = "ArcGIS街道暗灰图";
  streetsNightLayer.thumbnailUrl = streetsNightIMG;
  return { imageryLayer, osmLayer, novaLayer, streetsNightLayer };
}
const baseMapToggleOnClick = () => {
  if (basemapGallery) {
    basemapGallery.visible = !basemapGallery.visible;
  }
};
</script>

<!-- <style lang="scss" scoped> -->

<style lang="scss" scoped>
#viewDiv {
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

// 底图切换
#baseMapToggle {
  position: absolute;
  bottom: 10px;
  right: 15px;
  cursor: pointer;

  .image {
    object-fit: cover;
    width: 45px;
    height: 45px;
  }
}

.basemapGalleryDiv {
  position: absolute;
  right: 80px;
  bottom: -40px;
  max-height: 820px !important;
}

/* 自定义样式滚动条 */
:deep(.el-tabs__content::-webkit-scrollbar) {
  -webkit-appearance: none;
}

:deep(.el-tabs__content::-webkit-scrollbar:vertical) {
  width: 8px;
}

:deep(.el-tabs__content::-webkit-scrollbar-thumb) {
  border-radius: 8px;
  border: 2px solid white;
  background-color: rgba(48, 150, 246, 0.85);
}

/* esri样式覆盖 */
:deep(.esri-view .esri-view-surface:focus:after) {
  outline: none;
}

.esri-view {
  --esri-view-outline-color: none;
}

:deep(.esri-ui-bottom-right) {
  flex-direction: column;
  margin-bottom: 30px;
}

:deep(.esri-ui-bottom-right .esri-component) {
  margin-bottom: 5px;
}
</style>
