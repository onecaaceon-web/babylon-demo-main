import { Scene, MeshBuilder, StandardMaterial, Color3, Vector3, Texture } from '@babylonjs/core';
import React, { useEffect } from 'react';

interface MakeGroundProps {
  scene: Scene | undefined;
}

const MakeGround: React.FC<MakeGroundProps> = ({ scene }) => {
  useEffect(() => {
    if (!scene) return;

    // 场景准备就绪后创建地面
    if (scene.isReady()) {
      createGround();
    } else {
      scene.executeWhenReady(createGround);
    }

    function createGround() {
      try {
        // 移除旧地面避免重复
        const existingGround = scene?.getMeshByName('greenGround');
        if (existingGround) {
          existingGround.dispose();
        }

        // 创建6000x6000地面网格
        const ground = MeshBuilder.CreateGround(
          'greenGround',
          {
            width: 6000,
            height: 6000,
            subdivisions: 4
          },
          scene
        );

        // 设置地面位置
        ground.position = new Vector3(0, -50, 0);

        // 创建地面材质
        const groundMaterial = new StandardMaterial('greenGroundMaterial', scene);
        groundMaterial.diffuseColor = new Color3(0.23921568627450981, 0.3254901960784314, 0.12156862745098039); // #3D531F
        groundMaterial.alpha = 1.0;
        groundMaterial.specularColor = new Color3(0.1, 0.1, 0.1);
        groundMaterial.emissiveColor = new Color3(0, 0, 0);

        // 创建圆形渐变透明纹理
        const createCircleOpacityTexture = () => {
          const canvas = document.createElement('canvas');
          const size = 512;
          canvas.width = size;
          canvas.height = size;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) return null;
          
          // 创建从中心到边缘的径向渐变
          const centerX = size / 2;
          const centerY = size / 2;
          const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size / 2);
          
          // 设置渐变透明度
          gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
          gradient.addColorStop(0.7, 'rgba(255, 255, 255, 1.0)');
          gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.7)');
          gradient.addColorStop(0.9, 'rgba(255, 255, 255, 0.3)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
          
          // 填充渐变
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, size, size);
          
          // 转为纹理
          const texture = new Texture(canvas.toDataURL(), scene);
          texture.wrapU = Texture.WRAP_ADDRESSMODE;
          texture.wrapV = Texture.WRAP_ADDRESSMODE;
          
          return texture;
        };

        // 应用透明纹理
        const opacityTexture = createCircleOpacityTexture();
        if (opacityTexture) {
          groundMaterial.opacityTexture = opacityTexture;
          groundMaterial.useOpacityFromTexture = true;
        }
        
        // 调试用
        (globalThis as any).debugNode = groundMaterial;

        // 应用材质
        ground.material = groundMaterial;
        ground.isVisible = true;

        // 设置UV映射
        ground.material.opacityTexture.uScale = 1;
        ground.material.opacityTexture.vScale = 1;
        //run build编译没有报错
        // 设置alpha混合
        groundMaterial.backFaceCulling = false;
        groundMaterial.alphaMode = 2; 
        
      } catch (error) {
        console.error('创建地面时发生错误：', error);
      }
    }

    // 清理函数
    return () => {
      const ground = scene.getMeshByName('greenGround');
      if (ground) {
        ground.dispose();
      }
    };
  }, [scene]);

  // 这个组件不渲染任何React元素
  return null;
};

export default MakeGround;