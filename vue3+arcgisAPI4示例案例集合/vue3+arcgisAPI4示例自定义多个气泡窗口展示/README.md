# demo源码运行环境以及配置
> 
- 运行环境：依赖Node安装环境，demo本地Node版本:14.19.1。
- 运行工具：vscode或者其他工具。
- 配置方式：下载demo源码，vscode打开，然后顺序执行以下命令：
（1）下载demo环境依赖包命令：npm i 
（2）启动demo命令：npm run dev
（3）打包demo命令： npm run build:prod  


# 示例效果  
![](https://gitee.com/gishome/gis-learning-circle/raw/main/%E6%95%88%E6%9E%9C%E5%9B%BE/popup.png)  
# 实现思路
- 采用 leaflet 气泡窗口样式 css ，自定义 arcgis api 4.x 气泡窗口 div 容器，地图叠加 div 不难，难的是如何随着地图动态改变而刷新自定义窗口的位置，这也是本篇的核心内容，通过监听地图的变化事件，从而动态刷新气泡窗口的位置变化。    
- 核心部分代码    
```
<template>
  <div id="viewDiv">
  </div>
  <div class="titleContainer center">
    <span>vue3+arcgisAPI4示例:自定义多个气泡窗口展示</span>
  </div>
  <el-button type="primary" class="buttonRight btn1" @click="showInfoWindows">显示所有气泡窗口</el-button>
  <el-button type="primary" class="buttonRight btn2" @click="hideInfoWindows">隐藏所有气泡窗口</el-button>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import "@arcgis/core/assets/esri/themes/light/main.css";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Basemap from "@arcgis/core/Basemap.js";
import esriConfig from "@arcgis/core/config";
// import { lngLatToXY } from "@arcgis/core/geometry/support/webMercatorUtils.js";
import { config } from "../config";
import { removeElementById } from '@/utils/index';
import $ from 'jquery';
let view, map = null;
let popupInfos = [];
onMounted(() => {
  initMap();
});
const initMap = () => {
  esriConfig.apiKey = 'AAPKca495ea263b64e44b61eaaecdbddebfcwEQjC8k8-6XGMrrXyCie6xzybboRl4REq-TwDQTm8Wz-8sL6REARz1wcm14Kq9ny';
  // 初始化创建地图对象
  const novaLayer = Basemap.fromId("arcgis-nova");
  map = new Map({
    // basemap: "satellite",
    basemap: novaLayer,
  });
  // 初始化创建视图view对象
  view = new MapView({
    container: "viewDiv",
    map: map,
    center: config.mapInitParams.center,
    zoom: config.mapInitParams.zoom + 3
  });
  // 去除logo
  view.ui.remove(["attribution", "zoom"]);
  // 监听视图view初始化加载完成执行
  view.when(function () {
    removeElementById('loader-wrapper');
    //监听地图变化事件，对应刷新气泡窗口位置
    view.watch("extent", function () {
      relocatePopup();
    });
    view.watch("rotation", function () {
      relocatePopup();
    });
    //地图加载完，初始化气泡窗口
    popupInit();
  });
}
//初始化写入popup的数据
const popupInit = () => {
  //popup初始化
  popupInfos = [];
  popupInfos.push({
    //地图坐标
    x: 113.3684,
    y: 23.1323,
    //popup内容的文字，只是个示范，当然格式不限
    content: "自定义气泡窗口功能1",
    //气泡窗口div的id唯一标识
    id: "info1"
  });
  popupInfos.push({
    x: 113.3713,
    y: 23.1315,
    content: "自定义气泡窗口功能2",
    id: "info2"
  });

  for (let i = 0; i < popupInfos.length; i++) {
    const popupInfo = popupInfos[i];
    //坐标转换
    const mapPoint = {
      x: popupInfo.x,
      y: popupInfo.y,
      spatialReference: {
        wkid: 4326
      }
    };
    // 确保视图已经初始化
    if (view && view.ready) {
      const screenPoint = view.toScreen(mapPoint);
      let obj = {};
      obj.x = screenPoint.x;
      obj.y = screenPoint.y;
      obj.content = popupInfo.content;
      obj.id = popupInfo.id;
      loadinfoWindow(obj);
    }
  }
}
const loadinfoWindow = (obj) => {
  //动态添加气泡窗口DIV，移除固定的top和left样式，让positionPopUp函数完全控制位置
  const infoDiv = '<div id="trackPopUp' + obj.id + '" class="leaflet-popup">' +
    '<a class="leaflet-popup-close-button" id="leaflet-popup-close' + obj.id + '" href="#">×</a>' +
    '<div class="leaflet-popup-content-wrapper">' +
    '<div id="' + obj.id + '" class="leaflet-popup-content" style="max-width: 300px;"></div>' +
    '</div>' +
    '<div class="leaflet-popup-tip-container">' +
    '<div class="leaflet-popup-tip"></div>' +
    '</div>' +
    '</div>';
  $("#viewDiv").append(infoDiv);
  //填充内容
  $('#' + obj.id).append(obj.content);
  //刷新气泡窗口位置
  positionPopUp(obj);
  //气泡窗口关闭事件
  $('#leaflet-popup-close' + obj.id).click(function () {
    $('#trackPopUp' + obj.id).hide();
  });
}
//显示指定气泡窗口
const showinfoWindow = (id) => {
  $('#trackPopUp' + id).show();
}
//隐藏指定气泡窗口
const hideinfoWindow = (id) => {
  $('#trackPopUp' + id).hide();
}
//刷新气泡窗口位置
const positionPopUp = (obj) => {
  // 计算气泡窗口的偏移量
  // 水平偏移：将气泡窗口的中心对准点，假设气泡窗口宽度约为150px，所以水平偏移为宽度的一半
  // 垂直偏移：将气泡窗口的底部尖角对准点，需要向上偏移整个气泡窗口的高度
  // 这些偏移值可能需要根据实际气泡窗口的大小进行调整
  const offsetX = -75; // 水平居中偏移，气泡窗口宽度的一半
  const offsetY = -120; // 垂直向上偏移，使尖角对准点
  
  $('#trackPopUp' + obj.id).css('transform', 'translate3d(' + (obj.x + offsetX) + 'px, ' + (obj.y + offsetY) + 'px, 0)');
}
//移动泡窗口位置
const relocatePopup = (e) => {
  for (let i = 0; i < popupInfos.length; i++) {
    const popupInfo = popupInfos[i];
    //坐标转换
    const mapPoint = {
      x: popupInfo.x,
      y: popupInfo.y,
      spatialReference: {
        wkid: 4326
      }
    };
    // 确保视图已经初始化
    if (view && view.ready) {
      const screenPoint = view.toScreen(mapPoint);
      let obj = {};
      obj.x = screenPoint.x;
      obj.y = screenPoint.y;
      obj.content = popupInfo.content;
      obj.id = popupInfo.id;
      //刷新气泡窗口位置
      positionPopUp(obj);
    }
  }
}
const showInfoWindows = () => {
  for (let i = 0; i < popupInfos.length; i++) {
    const popupInfo = popupInfos[i];
    showinfoWindow(popupInfo.id);
  }
}
const hideInfoWindows = () => {
  for (let i = 0; i < popupInfos.length; i++) {
    const popupInfo = popupInfos[i];
    hideinfoWindow(popupInfo.id);
  }
}
</script>

<style>
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

.buttonRight {
  position: absolute;
  z-index: 999;
  cursor: pointer;
  top: 10px;
}

.btn1 {
  right: 175px;
}

.btn2 {
  right: 20px;
}

.leaflet-popup {
  position: absolute;
  text-align: center;
}

.leaflet-popup-close-button {
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px 4px 0 0;
  text-align: center;
  width: 18px;
  height: 14px;
  font: 16px/14px Tahoma, Verdana, sans-serif;
  color: #c3c3c3;
  text-decoration: none;
  font-weight: bold;
  background: transparent;
}

.leaflet-popup-content-wrapper {
  text-align: center;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
  padding: 1px;
  text-align: left;
  border-radius: 12px;
}

.leaflet-popup-content {
  margin: 13px 19px;
  line-height: 1.4;
}

.leaflet-popup-tip-container {
  margin: 0 auto;
  width: 40px;
  height: 20px;
  position: relative;
  overflow: hidden;
}

.leaflet-popup-tip {
  background: white;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
  width: 17px;
  height: 17px;
  padding: 1px;
  margin: -10px auto 0;
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}

/* esri样式覆盖 */
:deep(.esri-view .esri-view-surface:focus:after) {
  outline: none;
}

.esri-view {
  --esri-view-outline-color: none;
}
</style>
```

