import React, { useEffect, useRef } from 'react';
import { Scene, Vector3, Animation, AnimationGroup, PointerEventTypes } from '@babylonjs/core';
import { Container, TextBlock, Image, Rectangle } from '@babylonjs/gui';
import { buildings } from '../buildsdata/buildings';
import { getBuildingDetailById } from '../buildsdata/buildinfo';
import SceneIcons from '../../scene/icons';

// 定义全局接口，让外部组件可以调用显示建筑信息的方法
interface WindowWithBuildingInfo extends Window {
  showBuildingInfo?: (buildingId: string) => void;
  hideBuildingInfo?: () => void;
}

interface InfoShowProps {
  scene: Scene | undefined;
}

const InfoShow: React.FC<InfoShowProps> = ({ scene }) => {
  const sceneIconsRef = useRef<SceneIcons | null>(null);
  const infoContainerRef = useRef<Container | null>(null);
  const currentBuildingIdRef = useRef<string | null>(null);
  const isFadingOutRef = useRef<boolean>(false); // 跟踪是否正在淡出动画中

  useEffect(() => {
    if (!scene) return;

    // 初始化SceneIcons
    sceneIconsRef.current = new SceneIcons(scene);

    // 设置全局方法
    const windowWithBuildingInfo = window as WindowWithBuildingInfo;
    windowWithBuildingInfo.showBuildingInfo = handleShowBuildingInfo;
    windowWithBuildingInfo.hideBuildingInfo = handleHideBuildingInfo;

    // 添加鼠标点击事件监听
    const handleSceneClick = () => {
      // 只有在有信息面板显示时才执行淡出操作
      if (infoContainerRef.current && currentBuildingIdRef.current) {
        handleHideBuildingInfo();
        // 取消建筑高光效果
        if ((window as any).cancelBuildingHighlight) {
          (window as any).cancelBuildingHighlight();
        }
      }
    };

    // 使用Babylon.js自带的PointerEventTypes实现点击判断
    // 跟踪鼠标按下和释放的位置，用于判断是否为点击而非拖动
    let pointerDownPosition: { x: number; y: number } | null = null;
    const clickThreshold = 5; // 点击阈值，像素
    
    const handlePointerObservable = (pointerInfo: any) => {
      switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN:
          // 记录鼠标按下的位置
          if (!pointerInfo.event.button) { // 左键
            pointerDownPosition = {
              x: pointerInfo.event.clientX,
              y: pointerInfo.event.clientY
            };
          }
          break;
          
        case PointerEventTypes.POINTERUP:
          // 检查是否为左键点击且移动距离小于阈值
          if (!pointerInfo.event.button && pointerDownPosition) {
            const distanceX = Math.abs(pointerInfo.event.clientX - pointerDownPosition.x);
            const distanceY = Math.abs(pointerInfo.event.clientY - pointerDownPosition.y);
            
            // 如果移动距离小于阈值，则视为点击
            if (distanceX <= clickThreshold && distanceY <= clickThreshold) {
              handleSceneClick();
            }
          }
          pointerDownPosition = null;
          break;
          
        case PointerEventTypes.POINTERMOVE:
          // 如果移动距离超过阈值，取消点击状态
          if (pointerDownPosition) {
            const distanceX = Math.abs(pointerInfo.event.clientX - pointerDownPosition.x);
            const distanceY = Math.abs(pointerInfo.event.clientY - pointerDownPosition.y);
            
            if (distanceX > clickThreshold || distanceY > clickThreshold) {
              pointerDownPosition = null;
            }
          }
          break;
      }
    };
    
    // 添加事件监听器
    scene.onPointerObservable.add(handlePointerObservable);
    
    // 在清理函数中移除事件监听器和其他资源
    return () => {
      // 移除全局方法
      delete windowWithBuildingInfo.showBuildingInfo;
      delete windowWithBuildingInfo.hideBuildingInfo;

      // 移除指针事件监听器
      scene.onPointerObservable.remove(handlePointerObservable);

      // 重置动画状态标志，确保清理过程中不会被干扰
      isFadingOutRef.current = false;
      
      // 安全清理当前显示的信息面板
      if (infoContainerRef.current && currentBuildingIdRef.current) {
        // 直接清理而不使用动画，避免组件卸载后发生内存泄漏
        const container = infoContainerRef.current;
        const buildingId = currentBuildingIdRef.current;
        
        // 清理引用
        infoContainerRef.current = null;
        currentBuildingIdRef.current = null;
        
        // 立即释放容器资源
        container.dispose();
        
        // 同时释放对应的平面网格
        const plane = scene.getMeshByName(`POS_info_${buildingId}`);
        if (plane) {
          plane.dispose();
        }
      }
      
      // 清理场景图标引用
      sceneIconsRef.current = null;
    };
  }, [scene]);
    const handleShowBuildingInfo = (buildingId: string) => {
      if (!scene || !sceneIconsRef.current) return;

      // 如果正在淡出动画中，取消后续操作
      if (isFadingOutRef.current) {
        return;
      }

      // 先隐藏之前的信息面板，但不立即设置新面板
      // 检查是否有正在进行的淡出动画
      if (infoContainerRef.current) {
        // 如果当前有面板，先隐藏它，使用一个小延迟确保淡出动画完成
        handleHideBuildingInfo();
        setTimeout(() => {
          createNewPanel(buildingId);
        }, 350); // 稍微长于淡出动画时间
        return;
      }

      // 如果没有当前面板，直接创建新面板
      createNewPanel(buildingId);
    };

    // 创建新面板的函数
    const createNewPanel = (buildingId: string) => {
      if (!scene || !sceneIconsRef.current) return;

      // 重置淡出状态标志
      isFadingOutRef.current = false;
      
      // 设置当前建筑ID
      currentBuildingIdRef.current = buildingId;

      // 查找对应的建筑信息
      const building = buildings.find(b => b.id === buildingId);
      if (!building || !building.position) return;

      // 计算信息面板位置（建筑上方）
      const panelPosition = new Vector3(
        building.position.x,
        building.position.y + 15, // 建筑上方稍高处
        building.position.z
      );

      // 创建信息面板
      // 获取建筑详细信息
      const buildingDetail = getBuildingDetailById(buildingId);
      
      // 创建信息面板 - 不包含内部返回按钮
      const result = sceneIconsRef.current.createMeshIcon(
        null,
        {
          name: `info_${building.id}`,
          planeWidth: 0.01,
          planeHeight: 0.01,
          textureWidth: 540, // 增大宽度，提供更好的视觉效果
          textureHeight: 420, // 增大高度
          icon: {
            src: '', // 不使用图片
            width: '540px',
            height: '420px',
          },
          text: {
            text: '', // 清空文本，后续使用结构化布局
            fontSize: '16px',
            textAlign: 2, // 居中对齐
            verticalAlign: 1, // 居中对齐
          },
          tag: 'info_panel',
          isVisible: true,
          zIndex: 10,
          position: panelPosition,
        },
        scene
      );

      // 获取返回的组件
      const { container, button, text } = result;
      
      // 移除默认按钮
      button.dispose();
      
      // 移除默认文本块
      if (text) text.dispose();
      
      // 创建现代化的背景容器 - 半透明效果
      const backgroundRect = new Rectangle(`bg_rect_${building.id}`);
      backgroundRect.width = '100%';
      backgroundRect.height = '100%';
      backgroundRect.cornerRadius = 12; // 圆角
      backgroundRect.background = 'rgba(255, 255, 255, 0.6)'; // 直接使用半透明背景色
      backgroundRect.thickness = 3; // 较粗的边框
      backgroundRect.color = 'rgba(59, 130, 246, 0.8)'; // 半透明蓝色边框
      backgroundRect.shadowBlur = 20; // 更明显的阴影效果
      backgroundRect.shadowOffsetX = 8;
      backgroundRect.shadowOffsetY = 8;
      backgroundRect.shadowColor = 'rgba(0, 0, 0, 0.2)';
      backgroundRect.zIndex = -1;
      // 设置初始透明度为0，用于淡入动画
      backgroundRect.alpha = 0;
      
      // 将背景矩形添加到容器
      container.addControl(backgroundRect);
      
      // 创建标题容器 - 半透明效果
      const titleContainer = new Rectangle(`title_container_${building.id}`);
      titleContainer.width = '95%';
      titleContainer.height = '72px';
      titleContainer.cornerRadius = 8;
      titleContainer.background = '#3b82f6'; // 蓝色背景
      titleContainer.thickness = 0; // 无边框
      titleContainer.verticalAlignment = 0; // 顶部对齐
      titleContainer.top = '15px'; // 距离顶部的距离
      titleContainer.zIndex = 1;
      // 设置初始透明度为0，用于淡入动画
      titleContainer.alpha = 0;
      
      // 创建标题文字
      const titleText = new TextBlock(`title_text_${building.id}`);
      titleText.text = buildingDetail ? buildingDetail.name : building.name;
      titleText.fontSize = '26px';
      titleText.fontWeight = 'bold';
      titleText.color = '#ffffff'; // 白色文字
      titleText.fontFamily = 'Arial, sans-serif';
      titleText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
      titleText.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;
      titleText.paddingLeft = '15px';
      titleText.paddingRight = '15px';
      
      // 将标题文字添加到标题容器
      titleContainer.addControl(titleText);
      
      // 创建内容容器 - 半透明效果
      const contentContainer = new Rectangle(`content_container_${building.id}`);
      contentContainer.width = '95%';
      contentContainer.height = '276px';
      contentContainer.thickness = 0; // 无边框
      contentContainer.verticalAlignment = 0;
      contentContainer.top = '85px'; // 位于标题下方
      contentContainer.zIndex = 1;
      // 设置初始透明度为0，用于淡入动画
      contentContainer.alpha = 0;
      
      // 创建详细信息文本块
      const detailText = new TextBlock(`detail_text_${building.id}`);
      detailText.fontSize = '17px';
      detailText.fontFamily = 'Arial, sans-serif';
      detailText.color = '#000000'; // 黑色文字
      detailText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
      detailText.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_TOP;
      detailText.paddingLeft = '20px';
      detailText.paddingRight = '20px';
      detailText.paddingTop = '10px';
      detailText.paddingBottom = '10px';
      detailText.lineSpacing = '8px'; // 增加行间距
      
      // 设置结构化的文本内容
      if (buildingDetail) {
        detailText.text = `描述: ${buildingDetail.description}\n\n`;
        detailText.text += `🏢 功能: ${buildingDetail.functions.join('、')}\n\n`;
        detailText.text += `📏 建筑面积: ${buildingDetail.area}\n`;
        detailText.text += `📊 容量: ${buildingDetail.capacity}\n`;
        detailText.text += `👥 员工数量: ${buildingDetail.staff}人\n`;
      } else {
        detailText.text = `🏢 建筑ID: ${building.id}`;
      }
      
      // 将详细信息添加到内容容器
      contentContainer.addControl(detailText);
      
      // 创建底部装饰条 - 半透明效果
      const bottomBar = new Rectangle(`bottom_bar_${building.id}`);
      bottomBar.width = '95%';
      bottomBar.height = '5px';
      bottomBar.cornerRadius = 3;
      bottomBar.background = '#3b82f6';
      bottomBar.thickness = 0;
      bottomBar.verticalAlignment = 0;
      bottomBar.top = '372px';
      bottomBar.zIndex = 1;
      // 设置初始透明度为0，用于淡入动画
      bottomBar.alpha = 0;
      
      // 添加所有容器到主容器
      container.addControl(titleContainer);
      container.addControl(contentContainer);
      container.addControl(bottomBar);

      // 设置渲染组ID为1
      if (container) {
        infoContainerRef.current = container;
        // 不添加内部返回按钮，完全依赖全局返回键来控制显示/隐藏
      }

      // 查找并设置平面网格的渲染组ID和半透明材质
      const plane = scene.getMeshByName(`POS_info_${building.id}`);
      if (plane) {
        plane.renderingGroupId = 1;
        // 确保网格材质也支持半透明
        if (plane.material) {
          // 设置初始透明度为0，用于淡入动画
          (plane.material as any).alpha = 0;
          (plane.material as any).backFaceCulling = false;
        }
      }

      // 添加淡入动画
      const fadeInDuration = 500; // 淡入动画持续时间（毫秒）
      const startTime = Date.now();
      const targetAlpha = {
        background: 0.8,
        title: 0.8,
        content: 0.9,
        bottomBar: 0.8,
        plane: 0.8
      };

      // 创建淡入动画函数
      const fadeInAnimation = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / fadeInDuration, 1);
        
        // 使用缓动函数让动画更自然
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        // 更新各元素的透明度
        backgroundRect.alpha = easeProgress * targetAlpha.background;
        titleContainer.alpha = easeProgress * targetAlpha.title;
        contentContainer.alpha = easeProgress * targetAlpha.content;
        bottomBar.alpha = easeProgress * targetAlpha.bottomBar;
        
        if (plane && plane.material) {
          (plane.material as any).alpha = easeProgress * targetAlpha.plane;
        }
        
        // 继续动画直到完成
        if (progress < 1) {
          requestAnimationFrame(fadeInAnimation);
        }
      };
      
      // 开始淡入动画
      fadeInAnimation();
    };

  // 隐藏建筑信息
    const handleHideBuildingInfo = () => {
      // 安全检查，确保引用有效
      if (!infoContainerRef.current || !currentBuildingIdRef.current || !scene) {
        return;
      }
      
      // 标记正在淡出动画中
      isFadingOutRef.current = true;
      
      // 获取当前显示的建筑ID对应的平面网格
      const plane = scene.getMeshByName(`POS_info_${currentBuildingIdRef.current}`);
      
      // 获取所有容器元素的引用
      const backgroundRect = infoContainerRef.current.getChildByName(`bg_rect_${currentBuildingIdRef.current}`) as Rectangle;
      const titleContainer = infoContainerRef.current.getChildByName(`title_container_${currentBuildingIdRef.current}`) as Rectangle;
      const contentContainer = infoContainerRef.current.getChildByName(`content_container_${currentBuildingIdRef.current}`) as Rectangle;
      const bottomBar = infoContainerRef.current.getChildByName(`bottom_bar_${currentBuildingIdRef.current}`) as Rectangle;
      
      const fadeOutDuration = 300; // 淡出动画持续时间（毫秒）
      const startTime = Date.now();
      const currentAlpha = {
        background: backgroundRect?.alpha || 0,
        title: titleContainer?.alpha || 0,
        content: contentContainer?.alpha || 0,
        bottomBar: bottomBar?.alpha || 0,
        plane: plane?.material ? (plane.material as any).alpha : 0
      };

      // 创建淡出动画函数
      const fadeOutAnimation = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / fadeOutDuration, 1);
        
        // 使用缓动函数让动画更自然
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        // 更新各元素的透明度
        if (backgroundRect) backgroundRect.alpha = currentAlpha.background * (1 - easeProgress);
        if (titleContainer) titleContainer.alpha = currentAlpha.title * (1 - easeProgress);
        if (contentContainer) contentContainer.alpha = currentAlpha.content * (1 - easeProgress);
        if (bottomBar) bottomBar.alpha = currentAlpha.bottomBar * (1 - easeProgress);
        
        if (plane && plane.material) {
          (plane.material as any).alpha = currentAlpha.plane * (1 - easeProgress);
        }
        
        // 继续动画直到完成
        if (progress < 1) {
          requestAnimationFrame(fadeOutAnimation);
        } else {
          // 动画完成后安全释放资源
          if (infoContainerRef.current) {
            // 确保在UI线程中执行dispose操作
            setTimeout(() => {
              infoContainerRef.current?.dispose();
              infoContainerRef.current = null;
              currentBuildingIdRef.current = null;
              isFadingOutRef.current = false; // 重置淡出状态标志
            }, 0);
          }
        }
      };
      
      // 开始淡出动画
      requestAnimationFrame(fadeOutAnimation);
    };

  // 移除了内部返回按钮功能，完全依赖全局返回键来控制信息面板的显示/隐藏

  // 这个组件不渲染任何React元素
  return null;
};

export default InfoShow;