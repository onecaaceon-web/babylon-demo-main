import React from 'react';
import { Scene } from '@babylonjs/core';
import SceneActionManager from '../../scene/action-manager';
import styles from './index.module.scss';

let actionManager: SceneActionManager | null = null;

const BigScreen = ({ scene }: {
  scene: Scene | undefined
}) => {

  return (
    <div className={styles.bigScreen}>
      {scene !== undefined ? <SceneActionManager scene={scene} ref={el => actionManager = el} /> : null}
      <img src="./images/return.png" alt="" style={{
        position: "absolute",
        bottom: "5vh",
        right: "25vw",
        width: "80px",
        cursor: "pointer",
        pointerEvents: "all"
      }} onClick={() => {
        actionManager?.returnView()
      }} />

      {
        process.env.NODE_ENV === "development" ?
          <div className={styles.debug}>
            <div className={styles.getPos} onClick={() => actionManager?.getPos()}>
              获取坐标
            </div>
            <div className={styles.debugMenu} onClick={() => actionManager?.debugShow()}>调试</div>
          </div> : null
      }
    </div>
  )
}

export default BigScreen