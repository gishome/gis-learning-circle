<template>
  <div id="map"></div>
  <div class="titleContainer center">
    <span>vue+leaflet示例:百度地图切换显示</span>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import L from "leaflet";
import "leaflet.chinaProvider";
import config from "../config";
let map = null;
onMounted(() => {
  initMap();
});
const initMap = () => {
  //请引入 proj4.js 和 proj4leaflet.js
  L.CRS.Baidu = new L.Proj.CRS(
    "EPSG:900913",
    `+proj=merc
    +a=6378206
    +b=6356584.314245179
    +lat_ts=0.0
    +lon_0=0.0
    +x_0=0
    +y_0=0
    +k=1.0
    +units=m
    +nadgrids=@null
    +wktext
    +no_defs`,
    {
      resolutions: (function () {
        var res = [],
          level = 19;
        res[0] = Math.pow(2, 18);
        for (var i = 1; i < level; i++) {
          res[i] = Math.pow(2, 18 - i);
        }
        return res;
      })(),
      origin: [0, 0],
      bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244]),
    }
  );

  // 创建地图对象
  map = L.map("map", {
    crs: L.CRS.Baidu, // if use baidu  L.CRS.EPSG3857
    attributionControl: false,
  }).setView(config.mapInitParams.center, config.mapInitParams.zoom);
  //创建底图切换数据源
  const baseLayer9 = L.tileLayer(config.baseMaps[9].Url, {
    subdomains: "0123456789",
    styles: ({ bigfont }) => (bigfont ? "ph" : "pl"),
    tms: true,
  }); //百度街道图

  const baseLayer10 = L.tileLayer(config.baseMaps[10].Url, {
    subdomains: "0123456789",
    styles: ({ bigfont }) => (bigfont ? "sh" : "sl"),
    tms: true,
  }); //百度影像图

  map.addLayer(baseLayer9); //地图默认加载的底图
  const baseLayers = {
    百度街道图: baseLayer9,
    百度影像图: baseLayer10,
  };
  //底图切换控件
  L.control.layers(baseLayers, null).addTo(map);
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
