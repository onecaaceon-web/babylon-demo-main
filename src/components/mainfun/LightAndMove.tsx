import React, { useEffect, useRef } from 'react';
import { Scene, Vector3, Mesh, FreeCamera, HighlightLayer, Color3, ActionManager, ExecuteCodeAction } from '@babylonjs/core';
import { buildings } from '../buildsdata/buildings';
import gsap from 'gsap';

interface LightAndMoveProps {
  scene: Scene | undefined;
}

// 创建全局变量来存储场景和高光层引用
export let globalScene: Scene | undefined = undefined;
export let globalHighlightLayer: HighlightLayer | null = null;
export let currentHighlightedMesh: Mesh | null = null;

// 清除建筑高光效果的函数
export const clearBuildingHighlight = () => {
  if (currentHighlightedMesh && globalHighlightLayer) {
    globalHighlightLayer.removeMesh(currentHighlightedMesh);
    currentHighlightedMesh = null;
  }
};

// 取消建筑高光效果的全局函数
export const cancelBuildingHighlight = () => {
  if (currentHighlightedMesh && globalHighlightLayer) {
    globalHighlightLayer.removeMesh(currentHighlightedMesh);
    currentHighlightedMesh = null;
  }
};

// 全局处理建筑点击事件的函数
export const handleBuildingClickGlobal = (buildingId: string) => {
  if (!globalScene) return;

  // 找到对应的建筑数据
  const building = buildings.find(b => b.id === buildingId);
  if (!building) return;

  // 取消之前的高光效果
  if (currentHighlightedMesh && globalHighlightLayer) {
    globalHighlightLayer.removeMesh(currentHighlightedMesh);
  }

  // 获取相机
  const camera = globalScene.getCameraByName('freeCamera') as FreeCamera;
  if (!camera) return;

  // 相机跳转动画时长（毫秒）
  const animationDuration = 800; // 与gsap动画时长一致

  // 如果有网格名称，跳转到网格
  if (building.meshName) {
    const targetMesh = globalScene.getMeshByName(building.meshName);
    if (targetMesh && targetMesh instanceof Mesh) {
      // 添加高光效果
      if (globalHighlightLayer) {
        globalHighlightLayer.addMesh(targetMesh, Color3.Yellow());
        currentHighlightedMesh = targetMesh;
      }

      // 相机跳转到网格
      focusOnMesh(targetMesh, camera);
      
      // 等待相机动画完成后再显示信息面板
      setTimeout(() => {
        const windowWithBuildingInfo = window as any;
        if (windowWithBuildingInfo.showBuildingInfo) {
          windowWithBuildingInfo.showBuildingInfo(buildingId);
        }
      }, animationDuration + 100); // 额外加100ms确保动画完全结束
    }
  } else if (building.camrapoint) {
    // 如果没有网格名称但有相机点，则直接跳转到指定坐标
    // 设置相机位置
    gsap.to(camera.position, {
      x: building.camrapoint.x,
      y: building.camrapoint.y,
      z: building.camrapoint.z,
      duration: 1,
      ease: 'power2.out'
    });

    // 如果有视角坐标，也设置相机旋转
    if (building.viewPosition) {
      gsap.to(camera.rotation, {
        x: building.viewPosition.x,
        y: building.viewPosition.y,
        z: building.viewPosition.z,
        duration: 1,
        ease: 'power2.out'
      });
    }
    
    // 等待相机动画完成后再显示信息面板
    setTimeout(() => {
      const windowWithBuildingInfo = window as any;
      if (windowWithBuildingInfo.showBuildingInfo) {
        windowWithBuildingInfo.showBuildingInfo(buildingId);
      }
    }, animationDuration + 100); // 额外加100ms确保动画完全结束
  }
};

const focusOnMesh = (mesh: Mesh, camera: FreeCamera) => {
  // 获取网格的边界框中心
  mesh.refreshBoundingInfo({});
  const boundingInfo = mesh.getBoundingInfo();
  const center = boundingInfo?.boundingBox?.centerWorld?.clone() ?? Vector3.Zero();

  // 计算缩放
  const scaling = Vector3.Zero();
  (mesh as any).getWorldMatrix().decompose(scaling, undefined, undefined);

  // 设置相机旋转角度
  const rotationX = 33.72;
  const rotationY = 37.75;
  const distanceRatio = 1;
  let isFront = true;
  let newRotation = Vector3.Zero();
  const remaindRotationValue = camera.rotation.y % Math.PI;

  if (remaindRotationValue >= 0 && remaindRotationValue < Math.PI) {
    isFront = camera.rotation.y % (Math.PI * 2) > Math.PI;
    newRotation = new Vector3(
      Math.PI / (180 / rotationX),
      camera.rotation.y - remaindRotationValue + Math.PI / (180 / rotationY),
      0
    );
  } else if (remaindRotationValue > -Math.PI && remaindRotationValue < 0) {
    isFront = camera.rotation.y % (Math.PI * 2) > -Math.PI;
    newRotation = new Vector3(
      Math.PI / (180 / rotationX),
      camera.rotation.y -
      remaindRotationValue +
      Math.PI / (180 / -(180 - rotationY)),
      0
    );
  }

  // 动画旋转相机
  gsap.to([camera.rotation], {
    x: newRotation.x,
    y: newRotation.y,
    z: newRotation.z,
    duration: 0.8,
    ease: 'power2.out'
  });

  // 计算距离和位置
  if (mesh.getBoundingInfo()) {
    const distance = Vector3.Distance(
      mesh.getBoundingInfo().minimum.multiply(scaling),
      mesh.getBoundingInfo().maximum.multiply(scaling)
    );

    const newPosition = new Vector3(
      distanceRatio *
      (isFront ? 1 : -1) *
      Math.max(15, Math.min(80, distance)),
      distanceRatio * Math.max(15, Math.min(80, distance)),
      distanceRatio *
      (isFront ? 1 : -1) *
      Math.max(15, Math.min(80, distance))
    );

    // 动画移动相机位置
    gsap.to([camera.position], {
      x: center.add(newPosition).x,
      y: center.add(newPosition).y,
      z: center.add(newPosition).z,
      duration: 0.8,
      ease: 'power2.out'
    });
  }
};

const LightAndMove: React.FC<LightAndMoveProps> = ({ scene }) => {
  const highlightLayerRef = useRef<HighlightLayer | null>(null);
  const currentHighlightedMeshRef = useRef<Mesh | null>(null);

  useEffect(() => {
    if (!scene) return;

    // 初始化高光层
    highlightLayerRef.current = new HighlightLayer('highlightLayer', scene);
    
    // 设置全局引用
    globalScene = scene;
    globalHighlightLayer = highlightLayerRef.current;
    
    // 设置全局取消高光方法
    (window as any).cancelBuildingHighlight = cancelBuildingHighlight;
    
    // 清理函数
    return () => {
      if (highlightLayerRef.current) {
        highlightLayerRef.current.dispose();
      }
      // 清理全局引用
      globalScene = undefined;
      globalHighlightLayer = null;
      currentHighlightedMesh = null;
    };
  }, [scene]);

  // 这个组件不渲染任何React元素
  return null;
};

export default LightAndMove;