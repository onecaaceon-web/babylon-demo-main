import React, { useState, useEffect } from 'react';
import { Scene } from '@babylonjs/core';

interface ViewExampleProps {
  scene: Scene | undefined;
}

const ViewExample: React.FC<ViewExampleProps> = ({ scene }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // 监听动画状态变化
    const checkAnimationStatus = setInterval(() => {
        if (scene && (scene as any).viewAnimation) {
          setIsAnimating((scene as any).viewAnimation.isAnimating());
        }
      }, 100);

    return () => clearInterval(checkAnimationStatus);
  }, [scene]);

  // 播放视角序列
  const handlePlaySequence = () => {
    if (scene && (scene as any).viewAnimation) {
      (scene as any).viewAnimation.playViewSequence(false); // 播放一次后停止
    }
  };

  // 取消/停止动画
  const handleStopAnimation = () => {
    if (scene && (scene as any).viewAnimation) {
      (scene as any).viewAnimation.stopAnimation();
    }
  };

  const [iconsVisible, setIconsVisible] = useState(true);

  const handleToggleIcons = () => {
    const newVisibility = !iconsVisible;
    setIconsVisible(newVisibility);
    // 调用全局函数来控制图标显示/隐藏
    if ((window as any).toggleBuildingIcons) {
      (window as any).toggleBuildingIcons(newVisibility);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '0',
      right: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '15px',
      borderRadius: '8px',
      zIndex: 1000,
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '5px' }}>自动视角</div>
      
      <button
        onClick={handlePlaySequence}
        disabled={isAnimating}
        style={{
          padding: '12px 16px',
          backgroundColor: isAnimating ? '#6c757d' : '#28beffff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isAnimating ? 'not-allowed' : 'pointer',
          opacity: isAnimating ? 0.6 : 1,
          fontSize: '14px',
          transition: 'all 0.3s ease'
        }}
      >
        播放
      </button>
      
      <button
        onClick={handleStopAnimation}
        disabled={!isAnimating}
        style={{
          padding: '12px 16px',
          backgroundColor: !isAnimating ? '#6c757d' : '#2b00ffff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: !isAnimating ? 'not-allowed' : 'pointer',
          opacity: !isAnimating ? 0.6 : 1,
          fontSize: '14px',
          transition: 'all 0.3s ease'
        }}
      >
        取消
      </button>

      <button
        onClick={handleToggleIcons}
        style={{
          padding: '12px 16px',
          backgroundColor: iconsVisible ? '#ff6b6b' : '#4ecdc4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          transition: 'all 0.3s ease'
        }}
      >
        {iconsVisible ? '隐藏图标' : '显示图标'}
      </button>

      {isAnimating && (
        <div style={{
          padding: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#0787ffff',
          textAlign: 'center'
        }}>
          自动视角播放中...
        </div>
      )}
    </div>
  );
};

export default ViewExample;