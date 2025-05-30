<template>
  <div id="cesiumContainer" class="cesium-container">
    <!-- 模型调整控制面板 -->
    <div class="control-panel">
      <div class="panel-header">
        <h3>3D模型调整</h3>
      </div>
      <div class="panel-body">
        <!-- 高度调整 -->
        <div class="control-group">
          <label>高度调整:</label>
          <input type="range" min="-100" max="100" step="1" v-model="heightOffset" @input="updateHeight" />
          <span>{{ heightOffset }}米</span>
        </div>
        <!-- 重置按钮 -->
        <div class="control-group">
          <button @click="resetModel">重置模型</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import * as Cesium from 'cesium';

// 定义模型调整参数
const heightOffset = ref(0);
// 保存原始模型矩阵
let originalModelMatrix = null;

// Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZjQ5ZGUzNC1jNWYwLTQ1ZTMtYmNjYS05YTY4ZTVmN2I2MDkiLCJpZCI6MTE3MTM4LCJpYXQiOjE2NzY0NDUyODB9.ZaNSBIfc1sGLhQd_xqhiSsc0yr8oS0wt1hAo9gbke6M';
// 设置cesium静态资源路径
// window.CESIUM_BASE_URL = "/";
// 声明Cesium Viewer实例
let viewer, tileset = null;
let handler = null;

// 组件挂载后初始化Cesium
onMounted(async () => {
  // 初始化Cesium Viewer
  viewer = new Cesium.Viewer('cesiumContainer', {
    // 基础配置
    animation: false, // 动画小部件
    baseLayerPicker: false, // 底图选择器
    fullscreenButton: false, // 全屏按钮
    vrButton: false, // VR按钮
    geocoder: false, // 地理编码搜索框
    homeButton: false, // 主页按钮
    infoBox: false, // 信息框 - 禁用点击弹窗
    sceneModePicker: false, // 场景模式选择器
    selectionIndicator: false, // 选择指示器
    timeline: false, // 时间轴
    navigationHelpButton: false, // 导航帮助按钮
    navigationInstructionsInitiallyVisible: false, // 导航说明初始可见性
    scene3DOnly: false, // 仅3D场景
  });
  // 隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
  viewer.scene.globe.enableLighting = true;
  // 取消天空盒显示
  // viewer.scene.skyBox.show = false;
  // 禁用大气层和太阳
  viewer.scene.skyAtmosphere.show = false;
  // viewer.scene.sun.show = false;
  // viewer.scene.moon.show = false;
  // 设置背景为黑色
  // viewer.scene.backgroundColor = Cesium.Color.BLACK;
  //前提先把场景上的图层全部移除或者隐藏 
  // viewer.scene.globe.baseColor = Cesium.Color.BLACK; //修改地图蓝色背景
  viewer.scene.globe.baseColor = new Cesium.Color(0.0, 0.1, 0.2, 1.0); //修改地图为暗蓝色背景
  // 设置抗锯齿
  viewer.scene.postProcessStages.fxaa.enabled = true;
  // 清除默认底图
  viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
  // 加载底图 - 使用更暗的地图服务
  // const imageryProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl("https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");
  const imageryProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl("https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer");
  const layer = viewer.imageryLayers.addImageryProvider(imageryProvider);
  // 调整图层亮度和对比度，使其更暗
  layer.brightness = 0.8; // 降低亮度
  layer.contrast = 1.8; // 调整对比度
  // 设置默认视图位置 - 默认显示全球视图
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(104.0, 30.0, 10000000.0), // 中国中部上空
    orientation: {
      heading: 0.0,
      pitch: -Cesium.Math.PI_OVER_TWO,
      roll: 0.0
    }
  });

  // 启用地形深度测试，确保地形正确渲染
  viewer.scene.globe.depthTestAgainstTerrain = true;
  // // 清除默认地形
  // viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({});
  const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(3956);
  viewer.terrainProvider = terrainProvider;
  // 开启帧率
  viewer.scene.debugShowFramesPerSecond = true;

  // 使用异步方式加载3D Tiles数据集
  try {
    tileset = await Cesium.Cesium3DTileset.fromUrl("./public/data/tileset.json");
    // 设置3DTiles的样式，确保每个要素都有一个唯一的ID
    tileset.style = new Cesium.Cesium3DTileStyle({
      // 使用默认样式，但确保每个要素都可以被单独选择
      color: "color('white')"
    });
    
    // 保存原始模型矩阵，用于重置
    originalModelMatrix = Cesium.Matrix4.clone(tileset.modelMatrix);
    
    // 设置模型贴地
    // 启用贴地属性
    tileset.clampToGround = true;
    
    viewer.scene.primitives.add(tileset);
    viewer.zoomTo(tileset);
  } catch (error) {
    console.error("加载3D Tiles数据集失败:", error);
  }
});

// 更新模型高度
const updateHeight = () => {
  if (!tileset) return;
  
  // 创建一个新的矩阵，用于调整高度
  const heightMatrix = Cesium.Matrix4.fromTranslation(
    new Cesium.Cartesian3(0, 0, Number(heightOffset.value))
  );
  
  // 将原始矩阵与高度矩阵相乘，得到新的模型矩阵
  const newMatrix = Cesium.Matrix4.multiply(
    Cesium.Matrix4.clone(originalModelMatrix),
    heightMatrix,
    new Cesium.Matrix4()
  );
  // 应用位置偏移
  applyPositionOffset(newMatrix);
};
// 应用位置偏移的辅助函数
const applyPositionOffset = (baseMatrix) => {
  if (!tileset) return;
  
  // 创建一个位置偏移矩阵
  const positionMatrix = Cesium.Matrix4.fromTranslation(
    new Cesium.Cartesian3(
      Number(0),
      Number(0),
      Number(0)
    )
  );
  
  // 将基础矩阵与位置偏移矩阵相乘，得到最终的模型矩阵
  const finalMatrix = Cesium.Matrix4.multiply(
    baseMatrix,
    positionMatrix,
    new Cesium.Matrix4()
  );
  
  // 应用到模型
  tileset.modelMatrix = finalMatrix;
};

// 重置模型
const resetModel = () => {
  if (!tileset || !originalModelMatrix) return;

  // 重置所有调整参数
  heightOffset.value = 0;
  // 恢复原始模型矩阵
  tileset.modelMatrix = Cesium.Matrix4.clone(originalModelMatrix);
};

// 组件卸载前清理资源
onUnmounted(() => {
  // 清理事件处理器
  if (handler) {
    handler.destroy();
    handler = null;
  }
  
  if (viewer) {
    viewer.destroy();
    viewer = null;
  }
});
</script>

<style scoped>
.cesium-container {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.control-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  background-color: rgba(38, 38, 38, 0.85);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: white;
  z-index: 1000;
  overflow: hidden;
  transition: all 0.3s ease;
}

.panel-header {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.panel-body {
  padding: 15px;
}

.control-group {
  margin-bottom: 15px;
}

.control-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
}

.control-group input[type="range"] {
  width: 100%;
  margin-bottom: 5px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.control-group span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.control-group button {
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  transition: background-color 0.3s ease;
}

.control-group button:hover {
  background-color: #3367d6;
}
</style>