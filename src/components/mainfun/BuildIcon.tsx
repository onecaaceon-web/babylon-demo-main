import React, { useEffect, useRef } from 'react';
import { Scene, Vector3, AbstractMesh } from '@babylonjs/core';
import { buildings } from '../buildsdata/buildings';
import SceneIcons from '../../scene/icons';
import { handleBuildingClickGlobal } from './LightAndMove';

interface BuildIconProps {
  scene: Scene | undefined;
}

const BuildIcon: React.FC<BuildIconProps> = ({ scene }) => {
  const sceneIconsRef = useRef<SceneIcons | null>(null);
  const iconContainersRef = useRef<Map<string, { container: any, plane: AbstractMesh }>>(new Map());

  useEffect(() => {
    if (!scene) return;

    // 初始化SceneIcons
    sceneIconsRef.current = new SceneIcons(scene);
    createBuildingIcons();
    return () => {
      iconContainersRef.current.forEach(({ plane }) => {
        if (plane && scene.getMeshByName(plane.name)) {
          plane.dispose();
        }
      });
      iconContainersRef.current.clear();
    };
  }, [scene]);

  const createBuildingIcons = () => {
    if (!scene || !sceneIconsRef.current) return;

    buildings.forEach((building) => {
      if (!building.position || !building.name) return;
      const planePosition = new Vector3(
        building.position.x,
        building.position.y + 10, 
        building.position.z
      );
      const { container, plane } = sceneIconsRef.current!.createMeshIcon(
        null, 
        {
          name: building.id,
          planeWidth: 0.01,
          planeHeight: 0.01,
          textureWidth: 200,
          textureHeight: 100,
          icon: {
            src: './images/divicon.png',
            width: '153px',
            height: '58px',
          },
          text: {
            text: building.name,
            fontSize: '16px',
            textAlign: 2, // 居中对齐
            verticalAlign: 1, 
            paddingTop: '-200px', //大概是因为背景存在虚假空白，以至于调高200px才能实现居中
          },
          tag: 'icon_plane_building',
          isVisible: true,
          zIndex: 9,
          position: planePosition,
        },
        scene
      );

      // 保存创建的容器和平面，以便后续管理，删除这个保存不会影响功能但隐藏图标效果会出现很多bug因为找不到目标对象
      iconContainersRef.current.set(building.id, { container, plane });
      container.hoverCursor = 'pointer';
      container.onPointerClickObservable.add(() => {
        // 先跳转镜头，咋i做信息展示
        handleBuildingClickGlobal(building.id);
      });
    });
  };

  // 这个组件不渲染任何React元素，它只在Babylon场景中创建图标
  // 添加到window对象上，以便从其他组件调用
  (window as any).toggleBuildingIcons = (show: boolean) => {
    iconContainersRef.current.forEach(({ container, plane }) => {
      if (container) {
        container.isVisible = show;
      }
      if (plane && plane.isVisible !== undefined) {
        plane.isVisible = show;
      }
    });
  };

  return null;
};

export default BuildIcon;