import { Scene, Vector3 } from '@babylonjs/core';
import styles from './index.module.scss';
import Skybox from '../../scene/skybox';
import { useEffect, useRef } from 'react';
import Weather from '../../scene/weather';
import CameraEffect from '../../scene/cameraEffect';

const FuncExample = ({ scene, skyBox }: {
  scene: Scene | undefined,
  skyBox: Skybox | undefined
}) => {
  const isSunny  = useRef<boolean>(true);
  const weather = useRef<Weather>();
  const cameraEffect = useRef<CameraEffect>();

  useEffect(() => {
    weather.current = new Weather(scene!, skyBox);
    cameraEffect.current = new CameraEffect(scene!);
  }, [])

  const switchSkybox = () => {
    isSunny.current = !isSunny.current;
    skyBox?.switchSkybox(isSunny.current);
  }

  const rain = () => {
    weather.current?.weatherControl('rain', 'small');
  }
  const snow = () => {
    weather.current?.weatherControl('snow', 'small');
  }
  const stop = () => {
    weather.current?.weatherControl('none', 'middle');
  }

  const cameraEffectShow = () => {
    cameraEffect.current?.showCameraEffect(new Vector3(0, 50, 0));
  }
  const cameraEffectRemove = () => {
    cameraEffect.current?.removeCameraEffect();
  }

  return (
    <div className={styles.funcExample}>
      <div className={styles.btn} onClick={() => switchSkybox()}>切换天空盒</div>
      <div className={styles.btn} onClick={() => rain()}>下雨</div>
      <div className={styles.btn} onClick={() => snow()}>下雪</div>
      <div className={styles.btn} onClick={() => stop()}>停止雨/雪</div>
      <div className={styles.btn} onClick={() => cameraEffectShow()}>摄像头动画</div>
      <div className={styles.btn} onClick={() => cameraEffectRemove()}>移除</div>
    </div>
  ) 
}

export default FuncExample;