import { AbstractMesh, ArcRotateCamera, BaseTexture, Animation, Camera, CubicEase, EasingFunction, FreeCamera, HighlightLayer, Mesh, Nullable, Scene, TargetCamera, TransformNode, Vector3, Color3, MeshBuilder, PointerEventTypes, Quaternion, ActionManager, ExecuteCodeAction, Matrix, DirectionalLight, ShadowGenerator } from "@babylonjs/core";
import { clearBuildingHighlight } from '../components/mainfun/LightAndMove';
import React from "react";
import styles from './index.module.scss'
import SceneIcons from "./icons";
import SceneUtils from "./utils";
import { Control } from "@babylonjs/gui/2D";
import gsap from "gsap";
import ProjectAPI from "../api";
import { iconList } from '../assets/list'

interface Props {
  scene: Scene;
}

interface States {
  visible: boolean,
  data: any,
  modalPos: Vector3,
}

class SceneActionManager extends React.PureComponent<Props, States> {
  public scene: Scene;
  private _isMount: boolean = false;
  public sceneIcons: Nullable<SceneIcons> = null;
  public highlightLayer: Nullable<HighlightLayer> = null;
  public cameraMesh: Nullable<AbstractMesh> = null;
  public pickedMesh: Nullable<AbstractMesh> = null;

  private _lastZIndexMeshGroupsName: string[] = [];
  private _lastZIndexMeshName: string = "";
  private _lastOpacityMeshName: string = "";
  private _lastLightmapTexture: Nullable<BaseTexture> = null;

  constructor(props: Props) {
    super(props);
    this.scene = props.scene

    this.state = {
      visible: false,
      data: [],
      modalPos: new Vector3(0, 0, 0),
    };
  }

  private async _createIcons() {
    // this._createBuildingIcons()
  }

  /**
   * 
   * @param rty camera实时角度
   * @param rotateY camera预设角度
   * @returns 
   */
  private setRotateY(rty: number, rotateY: number) {
    let num = parseInt((rty / (Math.PI * 2)) as any)
    let checkNum = rty - num * Math.PI * 2 - Math.PI / (180 / rotateY)
    if (checkNum > Math.PI || checkNum < -Math.PI) {
      checkNum > 0 ? num += 1 : num -= 1
    }
    const rotateNum = Math.PI / (180 / rotateY) + 2 * Math.PI * num
    return rotateNum
  }

  // fullScreenGui
  private _createBuildingIcons() {
    iconList.forEach(item => {
      const { container, text, button, plane } =
        this.sceneIcons?.createMeshIcon(
          item.parent ? this.scene.getMeshByName(item.parent) : null,
          {
            name: item.name,
            planeWidth: 0.01,
            planeHeight: 0.01,
            textureWidth: 46,
            textureHeight: 58,
            icon: {
              src: `./images/icons/${item.name}.png`,
              width: (item.width ?? 153) + "px",
              height: (item.height ?? 58) + "px",
            },
            tag: "icon_plane_building",
            isVisible: true,
            zIndex: 9,
            position: item.position ?? new Vector3(0, 16, 0),
          },
          this.scene
        )!;

      container.hoverCursor = "pointer";
      container.onPointerClickObservable.add(() => {

      });
    })
  }
  // 固定大小
  private _createDeviceIcon(lineName: string) {
    iconList.forEach(item => {
      const { plane } = SceneIcons.createPlaneIcon(item.name, {
        width: 2,
        height: 0.9,
        src: `./image/${item.name}.png`,
        position: new Vector3(0, 1, 0),
        visibility: 1,
        // tag: ``
      }, item.parent ? this.scene!.getMeshByName(item.parent)! : undefined);
      plane.billboardMode = Mesh.BILLBOARDMODE_ALL;
      plane.actionManager = new ActionManager(this.scene);
      plane.actionManager.registerAction(
        new ExecuteCodeAction(
          {
            trigger: ActionManager.OnPickTrigger,
          },
          () => { }
        )
      )
    })
  }

  public toggleIcons(show: boolean, tag?: string) {
    const containers =
      this.sceneIcons?.fullscreenGUI?.getDescendants(
        false,
        (control: any) => control.typeName === "Container"
      ) ?? [];
    containers.forEach((container: any) => {
      if (container.metadata.tag === (tag ?? "icon_plane")) {
        container.isVisible = show;
      }
    });
  }

  private getMeshPos() {
    if (!this.pickedMesh) {
      return;
    }
    const pos = Vector3.Project(
      this.pickedMesh!.getBoundingInfo().boundingBox.centerWorld,
      Matrix.Identity(),
      this.scene.getTransformMatrix(),
      this.scene.activeCamera!.viewport.toGlobal(
        this.scene.getEngine().getRenderWidth(),
        this.scene.getEngine().getRenderHeight()
      )
    );
    this.setState({ modalPos: pos })
  }

  public returnView() {
    const camera = this.scene.getCameraByName('freeCamera') as FreeCamera
    // 更新为新的视角坐标
    gsap.to([camera?.position], { x: -117.13669132119027, y: 53.47087366146173, z: 348.21225168926196, duration: 2 })
    
    // 使用setRotateY方法处理Y轴旋转
    const targetRotationY = this.setRotateY(camera.rotation.y, -3.3562545480038213 * (180 / Math.PI));
    gsap.to([camera?.rotation], { x: 0.20683572465666575, y: targetRotationY, z: 0, duration: 2 })
    
    // 隐藏建筑信息面板
    if (window && typeof (window as any).hideBuildingInfo === 'function') {
      (window as any).hideBuildingInfo();
    }
    
    // 清除建筑高光效果
    clearBuildingHighlight();
  }

  public getPos() {
    const camera = this.scene.getCameraByName('freeCamera') as FreeCamera
    const { x, y, z } = camera.position
    // position
    
    const { x: rotaX, y: rotaY, z: rotaZ } = camera.rotation
    // rotation
    
    console.log('相机位置坐标:', { x, y, z });
    console.log('相机旋转坐标:', { rotaX, rotaY, rotaZ });
  }

  public debugShow() {
    this.scene?.debugLayer.isVisible() == true
      ? this.scene.debugLayer.hide()
      : this.scene?.debugLayer.show();
  }

  async componentDidMount(): Promise<void> {
    if (!this._isMount) {
      this._isMount = true;

      this.highlightLayer = new HighlightLayer(
        "Highlight Layer",
        this.scene, {
        mainTextureRatio: 0.8,
      });
      this.pickedMesh = MeshBuilder.CreatePlane(
        "Modal_Anchore_Plane",
        { size: 0.01 },
        this.scene
      );
      this.pickedMesh.isVisible = false;
      this.pickedMesh.isPickable = false;
      this.scene.onPointerObservable.add(async (pointerInfo) => {
        if (
          this.scene.activeCamera ==
          this.scene.getCameraByName("Editor Orthographic Camera")
        ) {
          if (pointerInfo.type == PointerEventTypes.POINTERPICK) {
            this.closeModal();
            this.clearOverlay();
          }
          return;
        }
        switch (pointerInfo.type) {
          case PointerEventTypes.POINTERPICK:
            const pickedMesh = pointerInfo.pickInfo?.pickedMesh as Mesh;

            this.closeModal();
            this.clearOverlay();
            this.removeCameraEffect();
            this.restoreMeshesZIndex();
        }
      });
      this.sceneIcons = new SceneIcons(this.scene);
      // this.scene.registerAfterRender(() => this.getMeshPos());

      this._createIcons()
    }
  }


  //通用方法

  private _onPointerClickObservable(
    plane: AbstractMesh,
    hightlightMeshName?: string,
    hideModal?: boolean,
    onComp?: () => void
  ) {
    this.clearOverlay();
    this.removeCameraEffect();
    this.restoreMeshesZIndex();
    // this.showModalByPosition(plane.absolutePosition.clone());
    this.focus(
      hightlightMeshName ? this.scene.getMeshByName(hightlightMeshName) : plane as any,
      null,
      () => {
        if (hightlightMeshName) {
          this.renderOverlay(hightlightMeshName);
          if (onComp) {
            onComp()
          }
        }
        if (!hideModal)
          this.showModalByPosition(plane.absolutePosition.clone());
      }
    );
  }

  public showModalByPosition(position: Vector3, pos?: any) {
    if (this.pickedMesh) {
      // this.pickedMesh.position = position.clone();
      this.pickedMesh.position.x = position.clone().x + pos?.x
      this.pickedMesh.position.y = position.clone().y + pos?.y
      this.pickedMesh.position.z = position.clone().z + pos?.z
      this.setState({ visible: true });
    }
  }

  public focus(
    node: Nullable<Node>,
    camera?: Nullable<Camera>,
    onComplete?: () => void
  ) {
    if (!node) {
      return;
    }

    if (!camera) {
      camera = this.scene.getCameraByName("freeCamera");
    }

    if (!camera || !(camera instanceof TargetCamera)) {
      return;
    }

    if (camera instanceof FreeCamera) {
      this.freeFocus(node, camera, onComplete);
    } else if (camera instanceof ArcRotateCamera) {
      this.targetFocus(node, camera, onComplete);
    }
  }

  /**
   * 高亮物体
   * @param name
   */
  public renderOverlay(name: string, color?: string) {
    const mesh = this.scene.getMeshByName(name);
    // console.log(mesh)
    if (mesh instanceof Mesh) {
      this.highlightLayer?.addMesh(
        mesh,
        Color3.FromHexString(color ?? "#FCD819")
      );
    }
  }

  /**
   * Free camera focus
   * @param node
   * @param camera
   * @param onComplete
   */
  public freeFocus(
    node: Nullable<Node>,
    camera: FreeCamera,
    onComplete?: () => void
  ) {
    let translation = Vector3.Zero();
    const scaling = Vector3.Zero();
    (node as any).getWorldMatrix().decompose(scaling, undefined, translation);

    if (node instanceof AbstractMesh) {
      node.refreshBoundingInfo({});
      translation =
        node.getBoundingInfo()?.boundingBox?.centerWorld?.clone() ??
        translation;
    }

    const rotationX = 33.72;
    const rotationY = 37.75;
    const distanceRatio = 1;
    let isFront = true;
    let newRotation = Vector3.Zero();
    const remaindRotationValue = camera.rotation.y % Math.PI;

    if (remaindRotationValue >= 0 && remaindRotationValue < Math.PI) {
      isFront = camera.rotation.y % (Math.PI * 2) > Math.PI;
      newRotation = new Vector3(
        Math.PI / (180 / rotationX),
        camera.rotation.y - remaindRotationValue + Math.PI / (180 / rotationY),
        0
      );
    } else if (remaindRotationValue > -Math.PI && remaindRotationValue < 0) {
      isFront = camera.rotation.y % (Math.PI * 2) > -Math.PI;
      newRotation = new Vector3(
        Math.PI / (180 / rotationX),
        camera.rotation.y -
        remaindRotationValue +
        Math.PI / (180 / -(180 - rotationY)),
        0
      );
    }

    let runAnimation = false;
    if (!SceneUtils.Vector3Equals(camera.rotation, newRotation)) {
      runAnimation = true;
      gsap.to([camera.rotation], {
        x: newRotation.x,
        y: newRotation.y,
        z: newRotation.z,
        yoyo: true,
        duration: 0.8,
        onComplete,
      });
    }

    if (node instanceof AbstractMesh && node.getBoundingInfo()) {
      const distance = Vector3.Distance(
        node.getBoundingInfo().minimum.multiply(scaling),
        node.getBoundingInfo().maximum.multiply(scaling)
      );

      const newPosition = new Vector3(
        distanceRatio *
        (isFront ? 1 : -1) *
        Math.max(15, Math.min(80, distance)),
        distanceRatio * Math.max(15, Math.min(80, distance)),
        distanceRatio *
        (isFront ? 1 : -1) *
        Math.max(15, Math.min(80, distance))
      );

      // 当前位置是否相等
      if (
        !SceneUtils.Vector3Equals(
          camera.position.clone(),
          translation.add(newPosition)
        )
      ) {
        runAnimation = true;
        gsap.to([camera.position], {
          x: translation.add(newPosition).x,
          y: translation.add(newPosition).y,
          z: translation.add(newPosition).z,
          yoyo: true,
          duration: 0.8,
          onComplete,
        });
      }
    }

    if (!runAnimation) {
      onComplete && onComplete();
    }
  }

  /**
   * Arc Rotate camera focus
   * @param node
   * @param camera
   * @param onComplete
   * @returns
   */
  public targetFocus(
    node: Nullable<Node>,
    camera: ArcRotateCamera,
    onComplete?: () => void
  ) {
    const ease = new CubicEase();
    ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);

    this.scene.stopAnimation(camera);

    let translation = Vector3.Zero();

    const scaling = Vector3.Zero();
    (node as any).getWorldMatrix().decompose(scaling, undefined, translation);

    if (node instanceof AbstractMesh) {
      node.refreshBoundingInfo({});
      translation =
        node.getBoundingInfo()?.boundingBox?.centerWorld?.clone() ??
        translation;
    }

    let runAnimation = false;
    if (!SceneUtils.Vector3Equals(camera.getTarget(), translation)) {
      if (camera["target"]) {
        // 当前目标位置是否相等
        runAnimation = true;
        const a = new Animation(
          "FocusTargetAnimation",
          "target",
          60,
          Animation.ANIMATIONTYPE_VECTOR3
        );
        a.setEasingFunction(ease);
        a.setKeys([
          { frame: 0, value: camera.getTarget() },
          { frame: 60, value: translation },
        ]);
        this.scene.beginDirectAnimation(
          camera,
          [a],
          0,
          60,
          false,
          0.8,
          onComplete
        );
      } else {
        camera.setTarget(translation);
      }
    }

    if (node instanceof AbstractMesh && node.getBoundingInfo()) {
      const distance = Vector3.Distance(
        node.getBoundingInfo().minimum.multiply(scaling),
        node.getBoundingInfo().maximum.multiply(scaling)
      );

      const newPosition = new Vector3(
        -1.2 * Math.max(15, distance),
        1.2 * Math.max(15, distance),
        -1.2 * Math.max(15, distance)
      );
      // 当前位置是否相等
      if (
        !SceneUtils.Vector3Equals(
          camera.position.clone(),
          translation.add(newPosition)
        )
      ) {
        runAnimation = true;
        const startFrame = { frame: 0, value: camera.position.clone() };
        const a = new Animation(
          "FocusPositionAnimation",
          "position",
          60,
          Animation.ANIMATIONTYPE_VECTOR3
        );
        a.setEasingFunction(ease);
        a.setKeys([
          startFrame,
          { frame: 60, value: translation.add(newPosition) },
        ]);
        this.scene.beginDirectAnimation(
          camera,
          [a],
          0,
          60,
          false,
          0.8,
          onComplete
        );
      }
    }

    if (!runAnimation) {
      onComplete && onComplete();
    }
  }

  public removeCameraEffect() {
    this.cameraMesh
      ?.getChildMeshes()
      .forEach((childMesh) => (childMesh.renderingGroupId = 0));
    this.cameraMesh?.setEnabled(false);
  }

  /**
 * 取消高亮的物体
 */
  public clearOverlay() {
    this.highlightLayer?.removeAllMeshes();
  }

  public restoreMeshesZIndex() {
    this._lastZIndexMeshGroupsName.forEach((name) =>
      this.setChildMeshesZIndex(name, 0)
    );
    this.setMeshOpacity(this._lastOpacityMeshName, 1);
    this.setMeshZIndex(this._lastZIndexMeshName, 0);
    this._lastZIndexMeshGroupsName = [];
    this._lastOpacityMeshName = "";
    this._lastZIndexMeshName = "";
    if (this._lastLightmapTexture) {
      this._lastLightmapTexture.coordinatesIndex = 1;
    }
  }

  public setChildMeshesZIndex(meshName: string, renderGroupId: number) {
    this._getChildMeshesByName(meshName)?.forEach(
      (childMesh) => (childMesh.renderingGroupId = renderGroupId)
    );
  }

  private _getChildMeshesByName(name: string, directDescendantsOnly?: boolean) {
    return this.scene
      .getMeshByName(name)
      ?.getChildMeshes(directDescendantsOnly);
  }

  public setMeshOpacity(meshName: string, visibility: number) {
    if (!meshName) {
      return;
    }
    const mesh = this.scene.getMeshByName(meshName);
    if (mesh) {
      mesh.visibility = visibility;
      this._lastOpacityMeshName = meshName;
    }
    if (mesh?.getChildMeshes()) {
      mesh.getChildMeshes().forEach((item) => {
        item.visibility = visibility;
      })
    }
  }

  public setMeshZIndex(meshName: string, renderingGroupId: number) {
    if (!meshName) {
      return;
    }
    const mesh = this.scene.getMeshByName(meshName);
    if (mesh) {
      mesh.renderingGroupId = renderingGroupId;
      this._lastZIndexMeshName = meshName;
    }
  }
  public closeModal() {
    this.setState({ visible: false, data: [] });
  }

  render(): React.ReactNode {
    return (
      <>

      </>
    )
  }
}

export default SceneActionManager;