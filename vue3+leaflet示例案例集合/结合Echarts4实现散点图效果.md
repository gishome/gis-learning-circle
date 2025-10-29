# demo源码运行环境以及配置
> 
- 运行环境：依赖Node安装环境，demo本地Node版本:14.19.1。
- 运行工具：vscode或者其他工具。
- 配置方式：下载demo源码，vscode打开，然后顺序执行以下命令：
（1）下载demo环境依赖包命令：npm i 
（2）启动demo命令：npm run dev
（3）打包demo命令： npm run build:release 


# 示例效果
效果图如下：
![](https://gitee.com/gishome/gis-learning-circle/raw/main/%E6%95%88%E6%9E%9C%E5%9B%BE/%E7%BB%93%E5%90%88Echarts4%E5%AE%9E%E7%8E%B0%E6%95%A3%E7%82%B9%E5%9B%BE%E6%95%88%E6%9E%9C.jpg)

>实现思路
- 从官网下载 Echarts4 源码，通过 _theme进行定位，定位到 function Echarts(){ } 里面的 this._theme = theme$$1;添加一行代码： this._geo = Geo;
echarts.js 修改之处：
![](https://gitee.com/gishome/gis-learning-circle/raw/main/%E6%95%88%E6%9E%9C%E5%9B%BE/echarts.jpg)
- 对 leaflet Layer 类进行扩展，新建 js 文件 leaflet-echarts.js，核心是 Echarts 的散点图其实也是在一个 Div 上画的，只要把这个 div 给拿到 map-pane 里面的 overlay-pane 。关于点的位置，因为 Echarts 内部自己有个把地理坐标转为像素坐标的方法，要重写 Echarts 内部方法 dataToPoint，完整的源码见文章尾部 demo 下载
```
initECharts: function(){
    if(this._echart === null || this._echart === undefined){
      this._initECharts();
    }else {
      this._echart.dispose();
      this._initECharts();
    }
  },
  _initECharts: function() {
    if (this._echart = echarts.init(this._echartsContainer),
    "3.0" <= echarts.version) {
      var me = this;
      console.log(echarts.version);
      console.log(me._echart);
      me._echart._geo.prototype.dataToPoint = function(lnglat) {
        //重写Echarts内部方法,Ecahrts内部有一套将经纬度转为像素坐标的方法，这里要换成与Leaflet相匹配的
        var latlng = new L.latLng(lnglat[1],lnglat[0])
          , pixel = me._map.latLngToContainerPoint(latlng);
        return [pixel.x, pixel.y];  //给定地理坐标，返回相对于地图container容器的相应像素坐标。
      }
    }
    this._unbindEvent();//屏蔽Echarts相关事件
  }
```

- 核心源码
```
<template>
  <div id="map"></div>
  <div class="titleContainer center">
    <span>vue+leaflet示例:结合Echarts4实现散点图效果</span>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import L from "leaflet";
import "./leaflet-echarts";
import config from "../config";
import { useRouter } from "vue-router";
const router = useRouter();
let map = null;
const geoCoordMap = {
  海门: [121.15, 31.89],
  鄂尔多斯: [109.781327, 39.608266],
  招远: [120.38, 37.35],
  ……
};
onMounted(() => {
  initMap();
});
const initMap = () => {
  // 创建地图对象
  map = L.map("map", {
    attributionControl: false,
  }).setView([37.550339, 104.114129], 4);
  //创建底图数据源
  L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}').addTo(map);
  //Echarts相关options配置
  const option = {
    //backgroundColor: '#404a59',
    title: {
      // text: "全国主要城市空气质量",
      subtext: "",
      sublink: "",
      x: "center",
      textStyle: {
        color: "#fff",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        return params.name + " : " + params.value[2];
      },
    },
    visualMap: {
      min: 0,
      max: 200,
      calculable: true,
      inRange: {
        color: ["#50a3ba", "#eac736", "#d94e5d"],
      },
      textStyle: {
        color: "#fff",
      },
    },
    geo: {
      //map: 'china',
      label: {
        emphasis: {
          show: false,
        },
      },
      itemStyle: {
        normal: {
          areaColor: "#323c48",
          borderColor: "#111",
        },
        emphasis: {
          areaColor: "#2a333d",
        },
      },
    },
    series: [
      {
        name: "pm2.5",
        type: "scatter",
        coordinateSystem: "geo",
        data: convertData([
          { name: "海门", value: 9 },
          { name: "鄂尔多斯", value: 12 },
          { name: "招远", value: 12 },
          ……
        ]),
        symbolSize: 12,
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
          },
        },
        itemStyle: {
          emphasis: {
            borderColor: "#fff",
            borderWidth: 1,
          },
        },
      },
    ],
  };
  //将Echarts加到地图上
  L.overlayEcharts(option).addTo(map);
};
……
</script>
```
# 源码下载  
[GIS之家的学习交流圈](https://www.zhihu.com/column/c_1952830516555396850)   
