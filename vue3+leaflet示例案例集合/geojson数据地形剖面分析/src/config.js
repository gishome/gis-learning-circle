const config = {
  mapInitParams: {
    center: [22.83883628, 113.50329857],
    zoom: 13
  },
  baseMaps: [
    {
      label: "OSM街道图",
      Url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" //  https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
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
