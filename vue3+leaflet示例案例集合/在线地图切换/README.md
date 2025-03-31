# demo源码运行环境以及配置
> 
- 运行环境：依赖Node安装环境，demo本地Node版本:14.19.1。
- 运行工具：vscode或者其他工具。
- 配置方式：下载demo源码，vscode打开，然后顺序执行以下命令：
（1）下载demo环境依赖包命令：npm i 
（2）启动demo命令：npm run dev
（3）打包demo命令： npm run build:release 


# 示例效果
在线地图分别是 OSM 地图、ArcGIS 地图、天地图、高德地图以及百度地图，由于加载百度地图比较特殊，它采用的投影坐标系方案定义跟其他在线地图不一致，需要自定义 L.Proj.CRS，所以，为了简单化测试，加载百度地图是在另一个地图页面来的。
效果图如下：
![](https://images.xiaozhuanlan.com/photo/2023/6bb29cddb084771194d6184b1fab4fc1.jpg)
![](https://images.xiaozhuanlan.com/photo/2023/d506ad6726061c66afa314ec5af55755.jpg)
![](https://images.xiaozhuanlan.com/photo/2023/d3106d7e9f4d5ca0865f823844b5a34c.jpg)
![](https://images.xiaozhuanlan.com/photo/2023/28e9143e342166524e196ee86a950a0b.jpg)
# 实现思路
- 核心用到 leaflet 的 TileLayer 图层类，专门加载瓦片数据图层，还有就是 leaflet 底图切换控件Control.Layers，TileLayer 类具体使用，可以参照 api说明：[TileLayer](https://leafletjs.com/reference-1.5.0.html#tilelayer)
- 在线地图配置信息
```
const config = {
  /*----------------------------------地图配置部分-------------------------------------*/
  mapInitParams: {
    center: [23.1441, 113.3693],
    zoom: 13
  },
  baseMaps: [
    {
      label: "OSM街道图",
      Url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    },
    {
      label: "ArcGIS影像图",
      Url:
        "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    },
    {
      label: "ArcGIS街道图",
      Url:
        "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}"
    },
    {
      label: "天地图街道图",
      Url:
        "http://t{s}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=7786923a385369346d56b966bb6ad62f"
    },
    {
      label: "天地图影像图",
      Url:
        "http://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=7786923a385369346d56b966bb6ad62f"
    },
    {
      label: "谷歌街道图",
      Url:
        "http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
    },
    {
      label: "谷歌影像图",
      Url:
        "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
    },
    {
      label: "高德街道图",
      Url:
        "http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
    },
    {
      label: "高德影像图",
      Url:
        "http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"
    },
    {
      label: "百度街道图",
      Url:
        "http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles={styles}&scaler=1&p=1"
    },
    {
      label: "百度影像图",
      Url:
        "http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46"
    }
  ]
};

export default config;

```

