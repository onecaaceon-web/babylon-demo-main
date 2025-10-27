import React, { useEffect } from 'react';
import { Scene, Mesh } from '@babylonjs/core';
import { WaterMaterial } from '@babylonjs/materials';

interface AddReflectMeshProps {
  scene: Scene | undefined;
  waterMaterialName?: string;
  reflectMeshes?: string[];
}

/**
 * 添加反射对象到水面的组件
 */
const AddReflectMesh: React.FC<AddReflectMeshProps> = ({
  scene,
  waterMaterialName = 'water',
  reflectMeshes = []
}) => {
  useEffect(() => {
    if (!scene) return;

    // 查找场景中的水面材质
    const waterMaterial = scene.materials.find(
      material => material.name === waterMaterialName && material instanceof WaterMaterial
    ) as WaterMaterial | undefined;

    if (!waterMaterial) {
      return;
    }

    // 添加指定网格到反射列表
    reflectMeshes.forEach(meshName => {
      const mesh = scene.getMeshByName(meshName);
      if (mesh) {
        waterMaterial.addToRenderList(mesh);
      }
    });

    // 清理函数
    return () => {
      reflectMeshes.forEach(meshName => {
        const mesh = scene.getMeshByName(meshName);
        if (mesh && waterMaterial) {
          // 注意：Babylon.js的WaterMaterial没有直接移除反射对象的方法
        }
      });
    };
  }, [scene, waterMaterialName, reflectMeshes]);

  return null;
};

export default AddReflectMesh;