import React, { useEffect, useRef, useState } from 'react';
import { Scene, Vector3 } from '@babylonjs/core';
import Skybox from '../../scene/skybox';
import Weather from '../../scene/weather';
import CameraEffect from '../../scene/cameraEffect';
import styles from './WeatherControl.module.scss';

interface WeatherControlProps {
  scene: Scene;
  skyBox?: Skybox;
}

const WeatherControl: React.FC<WeatherControlProps> = ({ scene, skyBox }) => {
  const weather = useRef<Weather>();
  const cameraEffect = useRef<CameraEffect>();
  const [weatherType, setWeatherType] = useState<'rain' | 'snow' | 'none'>('none');
  const [weatherSize, setWeatherSize] = useState<'big' | 'middle' | 'small'>('small');
  const [isSunny, setIsSunny] = useState(true);
  const [isFoggy, setIsFoggy] = useState(false);

  useEffect(() => {
    if (scene && skyBox) {
      weather.current = new Weather(scene, skyBox);
    }
  }, [scene, skyBox]);

  // 初始化相机效果
  useEffect(() => {
    if (scene) {
      cameraEffect.current = new CameraEffect(scene);
    }
    
    return () => {
      if (cameraEffect.current) {
        cameraEffect.current.removeCameraEffect();
      }
    };
  }, [scene]);

  const handleWeatherTypeChange = (type: 'rain' | 'snow' | 'none') => {
    setWeatherType(type);
    weather.current?.weatherControl(type, weatherSize);
    
    if (type === 'none') {
      setIsSunny(true);
      skyBox?.switchSkybox(true);
    } else {
      setIsSunny(false);
    }
  };

  const handleWeatherSizeChange = (size: 'big' | 'middle' | 'small') => {
    setWeatherSize(size);
    if (weatherType !== 'none') {
      weather.current?.weatherControl(weatherType, size);
    }
  };

  const toggleSkybox = () => {
    setIsSunny(!isSunny);
    skyBox?.switchSkybox(!isSunny);
    
    if (weatherType !== 'none') {
      weather.current?.weatherControl(weatherType, weatherSize);
    }
  };

  // 切换雾效
  const toggleFog = () => {
    setIsFoggy(!isFoggy);
    if (skyBox && skyBox._skyboxMaterial) {
      skyBox._skyboxMaterial.fogEnabled = !isFoggy;
    }
  };

  // 显示相机效果
  const showCameraEffect = () => {
    const position = new Vector3(-98.93078156602732, 24.942913268696714, 232.1085658761349);
    const angle = 120 * Math.PI / 180; // 120度转弧度
    
    cameraEffect.current?.showCameraEffect(position, angle);
  };

  // 移除相机效果
  const removeCameraEffect = () => {
    cameraEffect.current?.removeCameraEffect();
  };

  return (
    <div className={styles.weatherControl}>
      <div className={styles.title}>天气控制</div>
      
      <div className={styles.section}>
        <div className={styles.sectionTitle}>天气类型</div>
        <div className={styles.options}>
          <button 
            className={`${styles.option} ${weatherType === 'none' ? styles.active : ''}`}
            onClick={() => handleWeatherTypeChange('none')}
          >
            无天气
          </button>
          <button 
            className={`${styles.option} ${weatherType === 'rain' ? styles.active : ''}`}
            onClick={() => handleWeatherTypeChange('rain')}
          >
            下雨
          </button>
          <button 
            className={`${styles.option} ${weatherType === 'snow' ? styles.active : ''}`}
            onClick={() => handleWeatherTypeChange('snow')}
          >
            下雪
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>强度</div>
        <div className={styles.options}>
          <button 
            className={`${styles.option} ${weatherSize === 'small' ? styles.active : ''}`}
            onClick={() => handleWeatherSizeChange('small')}
          >
            小
          </button>
          <button 
            className={`${styles.option} ${weatherSize === 'middle' ? styles.active : ''}`}
            onClick={() => handleWeatherSizeChange('middle')}
          >
            中
          </button>
          <button 
            className={`${styles.option} ${weatherSize === 'big' ? styles.active : ''}`}
            onClick={() => handleWeatherSizeChange('big')}
          >
            大
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>天空盒</div>
        <button 
          className={`${styles.option} ${isSunny ? styles.active : ''}`}
          onClick={toggleSkybox}
        >
          {isSunny ? '晴天' : '多云'}
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>雾效</div>
        <button 
          className={`${styles.option} ${isFoggy ? styles.active : ''}`}
          onClick={toggleFog}
        >
          {isFoggy ? '关闭大雾' : '开启大雾'}
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>相机效果</div>
        <div className={styles.options}>
          <button 
            className={styles.option}
            onClick={showCameraEffect}
          >
            显示效果
          </button>
          <button 
            className={styles.option}
            onClick={removeCameraEffect}
          >
            移除效果
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherControl;