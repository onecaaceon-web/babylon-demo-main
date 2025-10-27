import React from 'react';
import { Suspense, useEffect, useRef, useState } from 'react'
import { ArcRotateCamera, Color3, Color4, DefaultRenderingPipeline, Engine, FreeCamera, HemisphericLight, Mesh, Scene, SceneLoader, StandardMaterial, Texture, Vector2, Vector3 } from '@babylonjs/core';
import CustomLoadingScreen from './scene/custom-loading-screen';
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import styles from './App.module.scss'
import { initWater } from './scene/current';
import Skybox from './scene/skybox';
import FuncExample from './components/FunctionExample';
import AutoView from './components/AutoView';
import { BuildIcon, LightAndMove, InfoShow } from './components/mainfun';
import { AddReflectMesh, ColorFix, MakeGround, WeatherControl, Hit } from './components/sidefun';
import { buildings } from './components/buildsdata/buildings';
import ViewFun from './components/view/viewfun';
import ViewExample from './components/view/ViewExample';

const BigScreen = React.lazy(() => import('./components/BigScreen'));

function App() {
  const renderCanvas = useRef<HTMLCanvasElement>(null);
  const [loadedPercent, setLoadedPercent] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false)

  const renderSceneRef = useRef<Scene>();
  const skyBoxRef = useRef<Skybox>();

  useEffect(() => {
    if (!renderSceneRef.current) init();

    return () => {
      window.removeEventListener("resize", () => renderSceneRef.current?.getEngine()?.resize());
    }
  }, [])

  function init() {
    const { current: canvas } = renderCanvas;
    if (!canvas) return;

    const engine = new Engine(canvas, true, {
      audioEngine: false,
      disableWebGL2Support: false,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: false,
      useHighPrecisionFloats: false,
      preserveDrawingBuffer: true,
      stencil: true,
    }, false);
    const scene = new Scene(engine);
    renderSceneRef.current = scene;

    window.addEventListener("resize", () => engine.resize());

    const loadingScreen = new CustomLoadingScreen("加载中!!");
    engine.loadingScreen = loadingScreen;
    engine.displayLoadingUI();

    SceneLoader.Append(
          "scene/",
          `scene.glb`,
          renderSceneRef.current,
          () => {

            const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)
            light.intensity = 2;

            skyBoxRef.current = new Skybox(scene);

            const camera = initCamera(canvas, scene)
            initWater(scene, 'FZ_JWZ_Road1_primitive1', [])
            
            // 初始化光照贴图
            initLightingMap(scene);
            
            engine.runRenderLoop(() => { scene.render(); });
            scene.executeWhenReady(async () => {
              setIsReady(true);

              if (process.env.NODE_ENV === "development") {
                // scene.debugLayer.show();
              }
            });
          }, evt => {
        let loadedPercent = 0;
        if (evt.lengthComputable) {
          loadedPercent = +(evt.loaded * 100 / evt.total).toFixed();
        } else {
          const dlCount = evt.loaded / (1024 * 1024);
          loadedPercent = Math.floor(dlCount * 100.0) / 100.0;
        }
        setLoadedPercent(loadedPercent)
      }, () => {}
    )
  }

  function initCamera(canvas: any, scene: Scene) {
    // 设置为用户指定的初始视角坐标
    const camera = new FreeCamera("freeCamera", new Vector3(-117.13669132119027, 53.47087366146173, 348.21225168926196));
    camera.rotation = new Vector3(0.20683572465666575, -3.3562545480038213, 0)
    camera.speed = 0.5;
    camera.keysUp.push(87); // "W"
    camera.keysLeft.push(65); // "A"
    camera.keysDown.push(83); // "S"
    camera.keysRight.push(68); //"D"
    camera.keysUpward.push(69); // "Q"
    camera.keysDownward.push(81); // "E"
    camera.attachControl(canvas, false);
    camera.checkCollisions = true;
    camera.minZ = 1;
    camera.maxZ = 10000;
    camera.inputs.addMouseWheel();
    camera.angularSensibility = 10000; 
    (camera.inputs.attached.mousewheel as any).wheelPrecisionY = 2;
    scene.activeCamera = camera;
    scene.collisionsEnabled = true;
    return camera
  }
  function initLightingMap(scene: Scene) {
    // 定义需要应用光照贴图的材质名称
    const materialNames = [
      'FZ_JWD_Terrain_CaoDi',
      'FZ_JWD_HuiShe',
      'FZ_JWD_TuDi',
      'FZ_JWD_YouBaiLu',
      'FZ_JWZ_Road_doalu',
      'FZ_JWD_ZhuanLu',
      'FZ_JWD_ShiZhiLu.001'
    ];

    // 创建光照贴图纹理
    const lightMapTx = new Texture('./textures/lightMap.jpg', scene);
    lightMapTx.level = 1;
    lightMapTx.vScale = -1;

    // 为指定材质应用光照贴图
    materialNames.forEach(materialName => {
      const material = scene.getMaterialByName(materialName) as StandardMaterial;
      if (material) {
        material.lightmapTexture = lightMapTx;
        lightMapTx.coordinatesIndex = 1;
        material.useLightmapAsShadowmap = true;
      }
    });
    
    // 查找并修改unique ID为438、434和605的纹理level为2
    setTimeout(() => {
      const textures = scene.textures;
      const targetIds = [438, 434, 605];
      const foundIds: number[] = [];
      
      textures.forEach((texture) => {
        if (texture) {
          const textureId = (texture as any).uniqueId;
          if (targetIds.includes(textureId)) {
            (texture as any).level = 2;
            foundIds.push(textureId);
          }
        }
      });
      
      // 完成纹理level设置
    }, 1000); // 延迟1秒执行，确保场景中的所有纹理都已加载完成
  }

  function initScene(scene: Scene) {
    scene.clearColor = new Color4;
    scene.imageProcessingConfiguration.contrast = 1.5;
    scene.imageProcessingConfiguration.exposure = 1;
  }

  return (
        <div className={styles.app}>
          <div className="loading" id="loadingScreen">
            <div className="wrap">
              <div className="cube">
                <div className="side s1"></div>
                <div className="side s2"></div>
                <div className="side s3"></div>
                <div className="side s4"></div>
                <div className="side top"></div>
              </div>
            </div>
            <div className="progress-bar">
              <div className="bar">
                <div className="progress" style={{ width: `${loadedPercent / 100 * 300}px` }}></div>
              </div>
              <p className="progress-text">三维场景加载中...</p>
            </div>
          </div>
          <canvas className={styles.canvas} ref={renderCanvas} />
          {isReady ? (
            <Suspense fallback={<div>大屏组件加载中</div>}>
              <BigScreen scene={renderSceneRef.current} />
            </Suspense>
          ) : null}
          {renderSceneRef.current && <BuildIcon scene={renderSceneRef.current} />}
          {/* 确保场景完全准备好后再渲染视角控制组件 */}
          {isReady && renderSceneRef.current && (
            <>
              <ViewFun 
                scene={renderSceneRef.current} 
                cameraName="freeCamera"
                defaultViewId="main_view"
              />
              <ViewExample scene={renderSceneRef.current} />
            </>
          )}
        {renderSceneRef.current && <LightAndMove scene={renderSceneRef.current} />}
        {renderSceneRef.current && <InfoShow scene={renderSceneRef.current} />}
        {renderSceneRef.current && (
          <AddReflectMesh 
            scene={renderSceneRef.current} 
            waterMaterialName="water"
            // 从buildings数据中提取所有建筑网格名称作为反射对象，并添加额外网格
            reflectMeshes={[
              ...buildings.map(building => building.meshName).filter((name): name is string => name !== undefined),
              // 添加Object310.001到Object310.100的网格
              ...Array.from({length: 100}, (_, i) => `Object310.${String(i + 1).padStart(3, '0')}`)
            ]}
          />
        )}
        {renderSceneRef.current && <ColorFix scene={renderSceneRef.current} />}
        {renderSceneRef.current && <MakeGround scene={renderSceneRef.current} />}
        {renderSceneRef.current && <WeatherControl scene={renderSceneRef.current} skyBox={skyBoxRef.current} />}
        {renderSceneRef.current && <Hit scene={renderSceneRef.current} />}
        </div>
      )
}

export default App
