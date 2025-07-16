# demo源码运行环境以及配置
> 
- 运行环境：依赖Node安装环境，demo本地Node版本:14.19.1。
- 运行工具：vscode或者其他工具。
- 配置方式：下载demo源码，vscode打开，然后顺序执行以下命令：
（1）下载demo环境依赖包命令：npm i 
（2）启动demo命令：npm run dev
（3）打包demo命令： npm run build:prod  


# 示例效果
在线地图包括arcgis地图，天地图，高德地图，百度地图，腾讯地图，OSM地图等十五个不同地图。  
效果图如下：
![](https://gitee.com/gishome/gis-learning-circle/raw/main/%E6%95%88%E6%9E%9C%E5%9B%BE/basemap1.png)
![](https://gitee.com/gishome/gis-learning-circle/raw/main/%E6%95%88%E6%9E%9C%E5%9B%BE/basemap2.png)
![](https://gitee.com/gishome/gis-learning-circle/raw/main/%E6%95%88%E6%9E%9C%E5%9B%BE/basemap3.png)   
# 实现思路
- 核心用到arcgisAPI4的BasemapGallery底图切换控件，专门用来加载不同底图显示，BasemapGallery类具体使用，可以参照api说明。同时也用到Basemap底图类以及WebTileLayer瓦片图层类，为了支持高德，百度以及腾讯地图，自定义拓展了BaseTileLayer图层类。    
- 地图配置部分代码   
```
const config = {
  mapInitParams: {
    center: [113.50329857, 22.83883628],
    zoom: 13
  }
};
export default config;
```   
- 地图初始化部分代码：   
 ```
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
 ```

