import { useEffect, useState } from 'react';
import { Scene, FreeCamera, Observable } from '@babylonjs/core';

interface HitProps {
  scene: Scene;
}

const Hit = ({ scene }: HitProps) => {
  const [isSceneReady, setIsSceneReady] = useState(false);

  useEffect(() => {
    // 检查场景准备状态
    const checkSceneReady = () => {
      if (scene.isReady()) {
        setIsSceneReady(true);
      } else {
        setTimeout(checkSceneReady, 100);
      }
    };

    checkSceneReady();
  }, [scene]);

  useEffect(() => {
    if (!isSceneReady) return;

    // 获取并限制相机高度
    const camera = scene.getCameraByName("freeCamera") as FreeCamera;
    if (!camera) return;

    const minHeight = 5;
    const maxHeight = 200; // 最高建筑高度+50

    // 限制相机Y轴位置
    const beforeRenderObserver = scene.onBeforeRenderObservable.add(() => {
      if (camera.position.y < minHeight) {
        camera.position.y = minHeight;
      }
      else if (camera.position.y > maxHeight) {
        camera.position.y = maxHeight;
      }
    });

    // 清理函数
    return () => {
      if (beforeRenderObserver) {
        scene.onBeforeRenderObservable.remove(beforeRenderObserver);
      }
    };
  }, [scene, isSceneReady]);

  return null; 
};

export default Hit;