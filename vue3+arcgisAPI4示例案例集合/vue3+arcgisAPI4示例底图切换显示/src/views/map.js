import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
import Basemap from "@arcgis/core/Basemap";
import BaseTileLayer from "@arcgis/core/layers/BaseTileLayer.js";
import esriRequest from "@arcgis/core/request.js";
import Tdtsl from "@/assets/map/tdtsl.png";
import Tdttyy from "@/assets/map/tdtyy.png";
import arcgisBlue from "@/assets/map/arcgisBlue.png";

const arcGISLayerInfo = {
    arcGISVecMap: {
        urlTemplate: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}'
    },
    arcGISBlueMap: {
        urlTemplate: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
    }
};
// ArcGIS街道图
const arcGISVecLayer = new WebTileLayer(
    arcGISLayerInfo.arcGISVecMap
);
const basemapVec_ArcGIS = new Basemap({
    baseLayers: [arcGISVecLayer],
    title: 'ArcGIS街道图',
    id: 'basemapArcGISVec',
    thumbnailUrl: Tdtsl
});
// ArcGIS街道暗蓝图
const arcGISBlueLayer = new WebTileLayer(
    arcGISLayerInfo.arcGISBlueMap
);
const basemapBlue_ArcGIS = new Basemap({
    baseLayers: [arcGISBlueLayer],
    title: 'ArcGIS街道暗蓝图',
    id: 'basemapArcGISBlue',
    thumbnailUrl: arcgisBlue
});

const tiandituLayerInfo = {
    tdtMap: {
        urlTemplate:
            'http://{subDomain}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}&tk=7786923a385369346d56b966bb6ad62f',
        subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
        // copyright: '天地图矢量',
        // visible: true,
        // title: '天地图矢量'
    },
    tdtAnnoMap: {
        urlTemplate:
            'http://{subDomain}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}&tk=7786923a385369346d56b966bb6ad62f',
        subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
        // copyright: '天地图矢量注记',
        // visible: true,
        // title: '天地图矢量注记'
    },
    tdtImageMap: {
        urlTemplate:
            'http://{subDomain}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=7786923a385369346d56b966bb6ad62f',
        subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
        // copyright: '天地图影像',
        // visible: false,
        // title: '天地图影像'
    },
    tdtImageAnnoMap: {
        urlTemplate:
            'http://{subDomain}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=7786923a385369346d56b966bb6ad62f',
        subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
        // copyright: '天地图影像注记',
        // visible: false,
        // title: '天地图影像注记'
    },
};
//天地图影像地图
const tdtImageLayer = new WebTileLayer(
    tiandituLayerInfo.tdtImageMap
);
//天地图影像注记
const tdtAnnoImageLayer = new WebTileLayer(
    tiandituLayerInfo.tdtImageAnnoMap
);

//天地图矢量地图
const tdtVecLayer = new WebTileLayer(
    tiandituLayerInfo.tdtMap
);
//天地图矢量注记
const tdtAnnoVecLayer = new WebTileLayer(
    tiandituLayerInfo.tdtAnnoMap
);
const basemapVec_tianditu = new Basemap({
    baseLayers: [
        tdtVecLayer, tdtAnnoVecLayer
    ],
    title: '天地图矢量',
    id: 'basemapVec',
    thumbnailUrl: Tdtsl
});
const basemapImg_tianditu = new Basemap({
    baseLayers: [
        tdtImageLayer, tdtAnnoImageLayer
    ],
    title: '天地图影像',
    id: 'basemapImg',
    thumbnailUrl: Tdttyy
});
// 高德地图自定义图层
const gaodeLayer = BaseTileLayer.createSubclass({
    properties: {
        urlTemplate: null,
    },
    getTileUrl: function (level, row, col) {
        return this.urlTemplate.replace("{s}", (col % 4 + 1)).replace("{z}", level).replace("{x}", col).replace("{y}", row);
    },
    fetchTile: function (level, row, col) {
        const url = this.getTileUrl(level, row, col);
        return esriRequest(url, {
            responseType: "image"
        }).then(function (response) {
            const image = response.data;
            const width = this.tileInfo.size[0];
            const height = this.tileInfo.size[0];
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = width;
            canvas.height = height;
            context.drawImage(image, 0, 0, width, height);
            return canvas;
        }.bind(this));
    }
});
// 高德街道图
const basemapVec_gaode = new Basemap({
    baseLayers: [new gaodeLayer({ urlTemplate: "http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}" })],
    title: '高德街道图',
    id: 'basemapVec_gaode',
    thumbnailUrl: Tdtsl
});
// 高德影像图
const basemapIMG_gaode = new Basemap({
    baseLayers: [
        new gaodeLayer({ urlTemplate: "http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}" }),
        new gaodeLayer({ urlTemplate: "http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}" })
    ],
    title: '高德影像图',
    id: 'basemapIMG_gaode',
    thumbnailUrl: Tdttyy
});
// 百度地图自定义图层
const createBaiDuLayer = (layerType) => {
    const bdMapTileLayer = BaseTileLayer.createSubclass({
        properties: {
            urlTemplate: null,
            layerType: null
        },
        getTileUrl: function (level, row, col) {
            let zoom = level - 1;
            const offsetX = parseInt(Math.pow(2, zoom));
            const offsetY = offsetX - 1;
            const numX = col - offsetX;
            const numY = -row + offsetY;
            zoom = level + 1
            const num = ((col + row) % 8) + 1;
            let url = '';
            switch (this.layerType) {
                case 'normal':
                    // 默认(normal)
                    url = `http://online${num}.map.bdimg.com/onlinelabel/?qt=tile&x=${numX}&y=${numY}&z=${zoom}&styles=pl`
                    break
                case 'sate':
                    url = `http://shangetu${num}.map.bdimg.com/it/u=x=${numX};y=${numY};z=${zoom};v=009;type=sate&fm=46`
                    break
                case 'sl':
                    // 影像文字
                    url = `http://maponline2.bdimg.com/tile/?qt=vtile&x=${numX}&y=${numY}&z=${zoom}&styles=sl`;
                    break
                case 'label':
                    url = `http://online${num}.map.bdimg.com/tile/?qt=tile&x=${numX}&y=${numY}&z=${zoom}&styles=sl&v=020`;
                    break
                default:
                    url = `http://online${num}.map.bdimg.com/onlinelabel/?qt=tile&x=${numX}&y=${numY}&z=${zoom}&styles=pl`
                    break
            }
            return url
        },
        fetchTile: function (level, row, col) {
            const url = this.getTileUrl(level, row, col);
            return esriRequest(url, {
                responseType: 'image',
            }).then(
                function (response) {
                    const image = response.data;
                    const width = this.tileInfo.size[0];
                    const height = this.tileInfo.size[0];
                    const canvas = document.createElement('canvas');
                    canvas.width = width
                    canvas.height = height
                    const context = canvas.getContext('2d');
                    if (this.tint) {
                        context.fillStyle = this.tint.toCss()
                        context.fillRect(0, 0, width, height)
                        context.globalCompositeOperation = 'multiply'
                    }
                    context.drawImage(image, 0, 0, width, height)
                    return canvas
                }.bind(this)
            )
        },
    })
    const bdMapLayer = new bdMapTileLayer({ layerType: layerType })
    bdMapLayer.id = 'baidu'
    bdMapLayer.tileInfo = {
        rows: 256,
        cols: 256,
        dpi: 96,
        format: 'PNG',
        compressionQuality: 0,
        origin: {
            x: -22302233.217155,
            y: 19411662.217155,
        },
        spatialReference: {
            wkid: 102100,
            latestWkid: 3857,
        },
        lods: [
            {
                level: 0,
                resolution: 156543.03392800014,
                scale: 5.91657527591555e8,
            },
            {
                level: 1,
                resolution: 78271.51696399994,
                scale: 2.95828763795777e8,
            },
            {
                level: 2,
                resolution: 39135.75848200009,
                scale: 1.47914381897889e8,
            },
            {
                level: 3,
                resolution: 19567.87924099992,
                scale: 7.3957190948944e7,
            },
            {
                level: 4,
                resolution: 9783.93962049996,
                scale: 3.6978595474472e7,
            },
            {
                level: 5,
                resolution: 4891.96981024998,
                scale: 1.8489297737236e7,
            },
            {
                level: 6,
                resolution: 2445.98490512499,
                scale: 9244648.868618,
            },
            {
                level: 7,
                resolution: 1222.992452562495,
                scale: 4622324.434309,
            },
            {
                level: 8,
                resolution: 611.4962262813797,
                scale: 2311162.217155,
            },
            {
                level: 9,
                resolution: 305.74811314055756,
                scale: 1155581.108577,
            },
            {
                level: 10,
                resolution: 152.87405657041106,
                scale: 577790.554289,
            },
            {
                level: 11,
                resolution: 76.43702828507324,
                scale: 288895.277144,
            },
            {
                level: 12,
                resolution: 38.21851414253662,
                scale: 144447.638572,
            },
            {
                level: 13,
                resolution: 19.10925707126831,
                scale: 72223.819286,
            },
            {
                level: 14,
                resolution: 9.554628535634155,
                scale: 36111.909643,
            },
            {
                level: 15,
                resolution: 4.77731426794937,
                scale: 18055.954822,
            },
            {
                level: 16,
                resolution: 2.388657133974685,
                scale: 9027.977411,
            },
            {
                level: 17,
                resolution: 1.1943285668550503,
                scale: 4513.988705,
            },
            {
                level: 18,
                resolution: 0.5971642835598172,
                scale: 2256.994353,
            },
            {
                level: 19,
                resolution: 0.29858214164761665,
                scale: 1128.497176,
            },
        ],
    }
    return bdMapLayer;
}
const basemapIMG_baidu = new Basemap({
    baseLayers: [createBaiDuLayer('sate'), createBaiDuLayer('sl')],
    title: '百度影像图',
    id: 'basemapIMG_baidu',
    thumbnailUrl: Tdttyy
});
const basemapVec_baidu = new Basemap({
    baseLayers: [createBaiDuLayer('normal')],
    title: '百度街道图',
    id: 'basemapVec_baidu',
    thumbnailUrl: Tdtsl
});
// 腾讯地图自定义图层
const createTXLayer = (layerType) => {
    const txMapTileLayer = BaseTileLayer.createSubclass({
        properties: {
            urlTemplate: null,
            layerType: null
        },
        getTileUrl: function (level, row, col) {
            const numY = Math.pow(2, level) - 1 - row;
            const num = col % 3
            let url = ''
            switch (this.layerType) {
                case 'normal':
                    url = `https://rt${num}.map.gtimg.com/tile?z=${level}&x=${col}&y=${numY}&type=vector&styleid=1&version=328`;
                    break
                case 'satellite':
                    url =`https://p0.map.gtimg.com/sateTiles/${level}/${Math.floor(col / 16.0)}/${Math.floor(numY / 16.0)}/${col}_${numY}.jpg`;
                    break
                case 'sl':
                    url =`https://rt${num}.map.gtimg.com/tile?z=${level}&x=${col}&y=${numY}&styleid=2&version=328`;
                    break
                default:
                    url = `https://rt${num}.map.gtimg.com/tile?z=${level}&x=${col}&y=${numY}&type=vector&styleid=1&version=328`;
                    break
            }
            return url
        },
        fetchTile: function (level, row, col) {
            const url = this.getTileUrl(level, row, col);
            return esriRequest(url, {
                responseType: 'image',
            }).then(
                function (response) {
                    const image = response.data;
                    const width = this.tileInfo.size[0];
                    const height = this.tileInfo.size[0];
                    const canvas = document.createElement('canvas');
                    canvas.width = width
                    canvas.height = height
                    const context = canvas.getContext('2d');
                    if (this.tint) {
                        context.fillStyle = this.tint.toCss()
                        context.fillRect(0, 0, width, height)
                        context.globalCompositeOperation = 'multiply'
                    }
                    context.drawImage(image, 0, 0, width, height)
                    return canvas
                }.bind(this)
            )
        },
    })
    const txMapLayer = new txMapTileLayer({ layerType: layerType })
    txMapLayer.id = 'tengxun'
    return txMapLayer;
}
const basemapIMG_tx = new Basemap({
    baseLayers: [createTXLayer('satellite'), createTXLayer('sl')],
    title: '腾讯影像图',
    id: 'basemapIMG_tx',
    thumbnailUrl: Tdttyy
});
const basemapVec_tx = new Basemap({
    baseLayers: [createTXLayer('normal')],
    title: '腾讯街道图',
    id: 'basemapVec_tx',
    thumbnailUrl: Tdtsl
});
export {
    basemapVec_ArcGIS,
    basemapBlue_ArcGIS,
    basemapVec_tianditu,
    basemapImg_tianditu,
    basemapVec_gaode,
    basemapIMG_gaode,
    basemapIMG_baidu,
    basemapVec_baidu,
    basemapIMG_tx,
    basemapVec_tx
}