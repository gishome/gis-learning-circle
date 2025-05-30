<template>
    <div id="cesiumContainer" class="cesium-container"></div>
    <div class="toolsDiv">
        <el-button type="primary" @click="drawCube">
            绘制立方体
        </el-button>
        <el-button type="primary" @click="drawSphere">
            绘制球体
        </el-button>
        <el-button type="primary" @click="drawEllipsoid">
            绘制椭圆体
        </el-button>
        <el-button type="primary" @click="drawCylinder">
            绘制圆柱体
        </el-button>
        <el-button type="primary" @click="drawCone">
            绘制圆锥体
        </el-button>
        <el-button type="danger" @click="clearGeometry">
            清除几何体
        </el-button>
    </div>
    <div class="color-picker-panel" v-if="selectedEntity">
        <el-color-picker v-model="selectedColor" @change="updateEntityColor" show-alpha></el-color-picker>
    </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import * as Cesium from 'cesium';
// 声明Cesium Viewer实例
let viewer = null;
// 声明变量用于存储事件处理器和实体集合
let handler = null;
let geometryEntities = [];
// 声明当前绘制模式
const drawingMode = ref(null);
// 声明当前选中的实体
const selectedEntity = ref(null);
// 声明选中的颜色
const selectedColor = ref('rgba(255, 0, 0, 0.7)'); // 默认颜色，与立方体一致
// 声明拖动状态
const isDragging = ref(false);
let dragHandler = null;
// 不再需要动画帧相关变量

// 节流函数 - 限制函数执行频率
const throttle = (fn, delay) => {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            return fn.apply(this, args);
        }
    };
};

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
        infoBox: false, // 信息框
        sceneModePicker: false, // 场景模式选择器
        selectionIndicator: false, // 选择指示器
        timeline: false, // 时间轴
        navigationHelpButton: false, // 导航帮助按钮
        navigationInstructionsInitiallyVisible: false, // 导航说明初始可见性
        scene3DOnly: false, // 仅3D场景
    });
    // 隐藏logo
    viewer.cesiumWidget.creditContainer.style.display = "none";
    viewer.scene.globe.enableLighting = false;
    //前提先把场景上的图层全部移除或者隐藏 
    viewer.scene.globe.baseColor = new Cesium.Color(0.0, 0.1, 0.2, 1.0); //修改地图为暗蓝色背景
    // 设置抗锯齿
    viewer.scene.postProcessStages.fxaa.enabled = true;
    // 清除默认底图
    viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
    // 加载底图 - 使用更暗的地图服务
    const imageryProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl("https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");
    viewer.imageryLayers.addImageryProvider(imageryProvider);
    // 设置默认视图位置 - 默认显示全球视图
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(104.0, 30.0, 10000.0), // 中国中部上空
        orientation: {
            heading: 0.0,
            pitch: -Cesium.Math.PI_OVER_TWO,
            roll: 0.0
        }
    });

    // 添加用于选择和拖动实体的事件处理器
    dragHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // 左键按下事件：选择实体并准备拖动
    dragHandler.setInputAction((movement) => {
        const pickedObject = viewer.scene.pick(movement.position);
        // if (Cesium.defined(pickedObject) && pickedObject.id instanceof Cesium.Entity && geometryEntities.includes(pickedObject.id)) {
        if (Cesium.defined(pickedObject) && pickedObject.id instanceof Cesium.Entity) {
            selectedEntity.value = pickedObject.id;
            isDragging.value = true;
            viewer.scene.screenSpaceCameraController.enableRotate = false; // 禁用相机旋转
            viewer.scene.canvas.style.cursor = 'move'; // 设置鼠标样式为移动
            // 获取当前实体的颜色并设置给颜色选择器
            let currentColor;
            if (selectedEntity.value.box) {
                currentColor = selectedEntity.value.box.material.color.getValue(viewer.clock.currentTime);
            } else if (selectedEntity.value.ellipsoid) {
                currentColor = selectedEntity.value.ellipsoid.material.color.getValue(viewer.clock.currentTime);
            } else if (selectedEntity.value.cylinder) {
                currentColor = selectedEntity.value.cylinder.material.color.getValue(viewer.clock.currentTime);
            }
            if (currentColor) {
                selectedColor.value = currentColor.toCssColorString();
            }
        } else {
            selectedEntity.value = null; // 点击空白区域取消选择
            isDragging.value = false;
            viewer.scene.canvas.style.cursor = 'default'; // 恢复默认鼠标样式
        }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    // 不再需要单独的更新实体位置函数，因为我们在鼠标移动时直接更新位置

    // 处理位置计算的函数 - 使用节流控制计算频率，但设置极小的延迟以获得最佳响应
    const calculatePosition = throttle((endPosition) => {
        if (isDragging.value && selectedEntity.value) {
            // 使用 pickPosition 获取精确的世界坐标
            const cartesian = viewer.scene.pickPosition(endPosition);
            // 也可以尝试使用 camera.pickEllipsoid 获取椭球体上的点
            if (Cesium.defined(cartesian)) {
                // 直接更新实体位置，不使用中间变量存储
                selectedEntity.value.position = cartesian;
                // 确保视图立即更新
                viewer.scene.requestRender();
            }
        }
    }, 0); // 移除延迟，实现即时响应



    // 鼠标移动事件：计算新位置但不直接更新
    dragHandler.setInputAction((movement) => {
        if (isDragging.value && selectedEntity.value) {
            calculatePosition(movement.endPosition);
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 左键抬起事件：结束拖动
    dragHandler.setInputAction(() => {
        if (isDragging.value) { // 仅在拖动状态下执行
            isDragging.value = false;
            viewer.scene.screenSpaceCameraController.enableRotate = true; // 恢复相机旋转
            viewer.scene.canvas.style.cursor = 'default'; // 恢复默认鼠标样式
        }
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    // 注意：这里我们不在 onUnmounted 中单独处理 dragHandler，因为它会在 viewer destroy 时自动清理
    // 但为了代码清晰，可以显式管理，或者依赖 Cesium 的清理机制
});

// 绘制立方体
const drawCube = () => {
    // 清除之前的事件处理器
    if (handler) {
        handler.destroy();
    }

    // 设置当前绘制模式
    drawingMode.value = 'cube';

    // 创建新的事件处理器
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // 监听左键点击事件
    handler.setInputAction((click) => {
        // 获取点击位置的笛卡尔坐标
        const cartesian = viewer.scene.pickPosition(click.position);

        if (Cesium.defined(cartesian)) {
            // 创建立方体实体
            const entity = viewer.entities.add({
                position: cartesian,
                box: {
                    dimensions: new Cesium.Cartesian3(1000.0, 1000.0, 1000.0), // 尺寸（米）
                    material: Cesium.Color.RED.withAlpha(0.7), // 半透明红色
                    outline: true,
                    outlineColor: Cesium.Color.TRANSPARENT,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND // 贴地
                }
            });

            // 将实体添加到集合中，以便后续清除
            geometryEntities.push(entity);

            // 清除事件处理器
            handler.destroy();
            handler = null;
            drawingMode.value = null;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

// 绘制球体
const drawSphere = () => {
    // 清除之前的事件处理器
    if (handler) {
        handler.destroy();
    }

    // 设置当前绘制模式
    drawingMode.value = 'sphere';

    // 创建新的事件处理器
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // 监听左键点击事件
    handler.setInputAction((click) => {
        // 获取点击位置的笛卡尔坐标
        const cartesian = viewer.scene.pickPosition(click.position);

        if (Cesium.defined(cartesian)) {
            // 创建球体实体
            const entity = viewer.entities.add({
                position: cartesian,
                ellipsoid: {
                    radii: new Cesium.Cartesian3(500.0, 500.0, 500.0), // 半径（米）
                    material: Cesium.Color.BLUE.withAlpha(0.7), // 半透明蓝色
                    outline: true,
                    outlineColor: Cesium.Color.TRANSPARENT,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND // 贴地
                }
            });

            // 将实体添加到集合中，以便后续清除
            geometryEntities.push(entity);

            // 清除事件处理器
            handler.destroy();
            handler = null;
            drawingMode.value = null;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

// 绘制椭圆体
const drawEllipsoid = () => {
    // 清除之前的事件处理器
    if (handler) {
        handler.destroy();
    }

    // 设置当前绘制模式
    drawingMode.value = 'ellipsoid';

    // 创建新的事件处理器
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // 监听左键点击事件
    handler.setInputAction((click) => {
        // 获取点击位置的笛卡尔坐标
        const cartesian = viewer.scene.pickPosition(click.position);

        if (Cesium.defined(cartesian)) {
            // 创建椭圆体实体
            const entity = viewer.entities.add({
                position: cartesian,
                ellipsoid: {
                    radii: new Cesium.Cartesian3(800.0, 500.0, 300.0), // 不同轴的半径（米）
                    material: Cesium.Color.GREEN.withAlpha(0.7), // 半透明绿色
                    outline: true,
                    outlineColor: Cesium.Color.TRANSPARENT,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND // 贴地
                }
            });

            // 将实体添加到集合中，以便后续清除
            geometryEntities.push(entity);

            // 清除事件处理器
            handler.destroy();
            handler = null;
            drawingMode.value = null;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

// 绘制圆柱体
const drawCylinder = () => {
    // 清除之前的事件处理器
    if (handler) {
        handler.destroy();
    }

    // 设置当前绘制模式
    drawingMode.value = 'cylinder';

    // 创建新的事件处理器
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // 监听左键点击事件
    handler.setInputAction((click) => {
        // 获取点击位置的笛卡尔坐标
        const cartesian = viewer.scene.pickPosition(click.position);

        if (Cesium.defined(cartesian)) {
            // 创建圆柱体实体
            const entity = viewer.entities.add({
                position: cartesian,
                cylinder: {
                    length: 1000.0, // 长度（米）
                    topRadius: 300.0, // 顶部半径（米）
                    bottomRadius: 300.0, // 底部半径（米）
                    material: Cesium.Color.ORANGE.withAlpha(0.7), // 半透明橙色
                    outline: true,
                    outlineColor: Cesium.Color.TRANSPARENT,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND // 贴地
                }
            });

            // 将实体添加到集合中，以便后续清除
            geometryEntities.push(entity);

            // 清除事件处理器
            handler.destroy();
            handler = null;
            drawingMode.value = null;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

// 绘制圆锥体
const drawCone = () => {
    // 清除之前的事件处理器
    if (handler) {
        handler.destroy();
    }

    // 设置当前绘制模式
    drawingMode.value = 'cone';

    // 创建新的事件处理器
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // 监听左键点击事件
    handler.setInputAction((click) => {
        // 获取点击位置的笛卡尔坐标
        const cartesian = viewer.scene.pickPosition(click.position);

        if (Cesium.defined(cartesian)) {
            // 创建圆锥体实体（使用圆柱体，顶部半径为0）
            const entity = viewer.entities.add({
                position: cartesian,
                cylinder: {
                    length: 1000.0, // 长度（米）
                    topRadius: 0.0, // 顶部半径为0（米）
                    bottomRadius: 400.0, // 底部半径（米）
                    material: Cesium.Color.PURPLE.withAlpha(0.7), // 半透明紫色
                    outline: true,
                    outlineColor: Cesium.Color.TRANSPARENT,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND // 贴地
                }
            });

            // 将实体添加到集合中，以便后续清除
            geometryEntities.push(entity);

            // 清除事件处理器
            handler.destroy();
            handler = null;
            drawingMode.value = null;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

// 清除所有几何体
const clearGeometry = () => {
    // 清除所有几何体实体
    for (let i = 0; i < geometryEntities.length; i++) {
        viewer.entities.remove(geometryEntities[i]);
    }
    // 清空实体集合
    geometryEntities = [];
    // 清除事件处理器
    if (handler) {
        handler.destroy();
        handler = null;
    }
    // 重置绘制模式
    drawingMode.value = null;
};

// 更新选中实体的颜色
const updateEntityColor = (newColor) => {
    if (selectedEntity.value && newColor) {
        const cesiumColor = Cesium.Color.fromCssColorString(newColor);
        if (selectedEntity.value.box) {
            selectedEntity.value.box.material = cesiumColor;
        } else if (selectedEntity.value.ellipsoid) {
            selectedEntity.value.ellipsoid.material = cesiumColor;
        } else if (selectedEntity.value.cylinder) {
            selectedEntity.value.cylinder.material = cesiumColor;
        }
    }
};

// 组件卸载前清理资源
onUnmounted(() => {
    // 清除事件处理器
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
}

.toolsDiv {
    position: absolute;
    top: 10px;
    left: 10px;

    button {
        margin-right: 10px;
    }
}

.color-picker-panel {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(40, 40, 40, 0.8);
    padding: 10px;
    border-radius: 5px;
    z-index: 10;
}
</style>