import React, { useRef, useEffect } from 'react';
import { FreeCamera, Scene } from '@babylonjs/core';
import gsap from 'gsap';
import { CameraViewPoint, getViewPointById, getAllViewPoints } from './view';

interface ViewFunProps {
  scene: Scene | undefined;
  cameraName?: string;
  autoPlay?: boolean;        // 是否自动播放动画序列
  loop?: boolean;            // 是否循环播放
  defaultViewId?: string;    // 默认视角ID
  onAnimationComplete?: () => void; // 动画完成回调
}

const ViewFun: React.FC<ViewFunProps> = ({
  scene,
  cameraName = 'freeCamera',
  autoPlay = false,
  loop = false,
  defaultViewId,
  onAnimationComplete
}) => {
  const cameraRef = useRef<FreeCamera | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isAnimatingRef = useRef(false);

  // 初始化相机引用
  useEffect(() => {
    if (scene) {
      // 尝试通过名称获取相机
      let camera = scene.getCameraByName(cameraName);
      
      // 如果没找到指定名称的相机，尝试使用场景中的第一个相机
      if (!camera) {
        const allCameras = scene.cameras;
        if (allCameras.length > 0) {
          camera = allCameras[0];
        }
      }
      
      if (camera) {
        cameraRef.current = camera as FreeCamera;
        
        // 如果指定了默认视角，设置初始相机位置
        if (defaultViewId) {
          const defaultView = getViewPointById(defaultViewId);
          if (defaultView && cameraRef.current) {
            cameraRef.current.position.set(
              defaultView.position.x,
              defaultView.position.y,
              defaultView.position.z
            );
            cameraRef.current.rotation.set(
              defaultView.rotation.x,
              defaultView.rotation.y,
              defaultView.rotation.z
            );
          }
        }
      }
    }
  }, [scene, cameraName, defaultViewId]);

  // 自动播放功能
  useEffect(() => {
    if (autoPlay && cameraRef.current) {
      playViewSequence(loop);
    }
  }, [autoPlay, loop]);

  // 跳转到指定视角
    const jumpToView = (viewPoint: CameraViewPoint | string) => {
      if (!cameraRef.current) return;

      // 停止正在进行的动画
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }

      const targetView = typeof viewPoint === 'string' ? 
        getViewPointById(viewPoint) : viewPoint;

      if (!targetView) return;

      isAnimatingRef.current = true;

      // 使用gsap动画到目标位置和旋转
      gsap.to(cameraRef.current.position, {
        x: targetView.position.x,
        y: targetView.position.y,
        z: targetView.position.z,
        duration: targetView.duration,
        ease: 'power2.inOut',
        onComplete: () => {
          isAnimatingRef.current = false;
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }
      });

      // 处理Y轴旋转，确保角度在正确范围内
      const setRotateY = (rty: number, rotateY: number) => {
        let num = Math.floor(rty / (Math.PI * 2));
        let checkNum = rty - num * Math.PI * 2 - Math.PI / (180 / rotateY);
        if (checkNum > Math.PI || checkNum < -Math.PI) {
          checkNum > 0 ? num += 1 : num -= 1;
        }
        return Math.PI / (180 / rotateY) + 2 * Math.PI * num;
      };

      const targetRotationY = setRotateY(
        cameraRef.current.rotation.y, 
        targetView.rotation.y * (180 / Math.PI)
      );

      gsap.to(cameraRef.current.rotation, {
        x: targetView.rotation.x,
        y: targetRotationY,
        z: targetView.rotation.z,
        duration: targetView.duration,
        ease: 'power2.inOut'
      });
    };

  // 播放视角序列动画
    const playViewSequence = (loopSequence: boolean = false) => {
      if (!cameraRef.current) return;

      // 停止正在进行的动画
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // 获取所有视角点
      const allViewPoints = getAllViewPoints();
      
      // 筛选出需要按顺序播放的视角（view1, view2, view3, view4, view5, view6, view7）
      const viewNames = ['view1', 'view2', 'view3', 'view4', 'view5', 'view6', 'view7'];
      const sequenceViewPoints = allViewPoints.filter(view => 
        viewNames.includes(view.id)
      );
      
      if (sequenceViewPoints.length === 0) return;

      isAnimatingRef.current = true;
      
      timelineRef.current = gsap.timeline({ 
        repeat: loopSequence ? -1 : 0,
        onComplete: () => {
          isAnimatingRef.current = false;
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }
      });

      // 处理Y轴旋转，确保角度在正确范围内
      const setRotateY = (rty: number, rotateY: number) => {
        let num = Math.floor(rty / (Math.PI * 2));
        let checkNum = rty - num * Math.PI * 2 - Math.PI / (180 / rotateY);
        if (checkNum > Math.PI || checkNum < -Math.PI) {
          checkNum > 0 ? num += 1 : num -= 1;
        }
        return Math.PI / (180 / rotateY) + 2 * Math.PI * num;
      };

      // 为所有视角点添加动画
      sequenceViewPoints.forEach((viewPoint, index) => {
        const duration = viewPoint.duration;
        
        timelineRef.current!.to(cameraRef.current!.position, {
          x: viewPoint.position.x,
          y: viewPoint.position.y,
          z: viewPoint.position.z,
          duration: duration,
          ease: 'power2.inOut'
        }, index > 0 ? `-=${duration * 0.3}` : 0); // 添加一点重叠，使动画更流畅

        const targetRotationY = setRotateY(
          cameraRef.current!.rotation.y, 
          viewPoint.rotation.y * (180 / Math.PI)
        );

        timelineRef.current!.to(cameraRef.current!.rotation, {
          x: viewPoint.rotation.x,
          y: targetRotationY,
          z: viewPoint.rotation.z,
          duration: duration,
          ease: 'power2.inOut'
        }, `<`); // 与位置动画同步开始
      });
    };

  // 停止当前动画
  const stopAnimation = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    isAnimatingRef.current = false;
  };

  // 获取当前动画状态
  const isAnimating = () => isAnimatingRef.current;

  // 暴露方法给父组件
  useEffect(() => {
    if (scene) {
      // 将方法挂载到scene对象上供外部调用
      (scene as any).viewAnimation = {
        jumpToView,
        playViewSequence,
        stopAnimation,
        isAnimating,
        getViewPointById,
        getAllViewPoints
      };

      // 清理函数
      return () => {
        stopAnimation();
        if (scene) {
          delete (scene as any).viewAnimation;
        }
      };
    }
  }, [scene]);

  return null; // 这个组件不渲染任何UI元素，只提供功能
};

export default ViewFun;