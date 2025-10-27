import {
  AbstractMesh,
  Mesh,
  MeshBuilder,
  Nullable,
  Vector3,
  Scene,
  SpriteManager,
  Sprite,
  ArcRotateCamera,
  StandardMaterial,
  TransformNode,
} from "@babylonjs/core";
import {
  AdvancedDynamicTexture,
  Image,
  TextBlock,
  Container,
  Control,
} from "@babylonjs/gui";
import gsap from "gsap";

class SceneIcons {
  public fullscreenGUI: AdvancedDynamicTexture;
  private _timer: any = null;
  private _focusIcon: Nullable<Image> = null;

  constructor(scene: Scene, postEffect?: boolean) {
    this.fullscreenGUI = AdvancedDynamicTexture.CreateFullscreenUI(
      "Fullscreen UI",
      true,
      scene
    );

    if (postEffect) {
      this.fullscreenGUI.layer!.layerMask = 0x10000000
    }
  }

  // 自适应大小
  public createMeshIcon(
    parent: Nullable<AbstractMesh>,
    options: {
      name: string;
      icon: {
        src: string;
        width: number | string;
        height: number | string;
      };
      text?: {
        text: string;
        fontSize: number | string;
        paddingLeft?: number | string;
        textAlign?: number;
        paddingTop?: number | string;
        verticalAlign?: number;
      };
      textureWidth: number;
      textureHeight: number;
      planeWidth: number;
      planeHeight: number;
      beat?: {
        enabled: boolean;
        offsetY: number;
      };
      position?: Vector3;
      tag?: string;
      deviceType?: string; // 用于设备类型筛选
      zIndex?: number;
      isVisible?: boolean;
    },
    scene: Scene,
    isFullscreen: boolean = true
  ): {
    ui: AdvancedDynamicTexture;
    plane: Mesh;
    container: Container;
    button: Image;
    text?: TextBlock;
  } {
    const plane = MeshBuilder.CreatePlane(
      `POS_${options.name}`,
      {
        width: options.planeWidth,
        height: options.planeHeight,
      },
      scene
    );
    plane.position = options.position ?? Vector3.Zero();
    if (isFullscreen) {
      plane.setEnabled(false);
    }

    if (parent) {
      plane.parent = parent;
    }
    plane.metadata = {
      tag: options.tag ?? "icon_plane",
      deviceType: options.deviceType ?? "",
    };

    const container = new Container(`Container_${options.name}`);
    container.width = options.icon.width;
    container.height = options.icon.height;
    container.metadata = {
      tag: options.tag ?? "icon_plane",
      deviceType: options.deviceType ?? "",
    };
    container.isPointerBlocker = true;
    container.isVisible = options.isVisible ?? true;
    container.zIndex = options.zIndex ?? 1;

    if (isFullscreen) {
      this.fullscreenGUI.addControl(container);
    } else {
      const meshUI = AdvancedDynamicTexture.CreateForMesh(
        plane,
        options.textureWidth,
        options.textureHeight,
        true
      );
      meshUI.addControl(container);
    }

    const button = new Image(`ICON_${options.name}`, options.icon.src);
    button.width = options.icon.width;
    button.height = options.icon.height;
    button.scaleX = button.scaleY = 0.75;
    container.addControl(button);

    container.linkWithMesh(plane);

    if (options.beat?.enabled) {
      gsap.to(plane.position, {
        y: plane.position.y + options.beat.offsetY,
        duration: 1,
        repeat: -1,
        delay: Math.random(),
        yoyo: true,
      });
    }
    if (options.text) {
      const text = new TextBlock(`Text_${options.name}`, options.text.text);
      container.addControl(text);
      text.color = "#ffffff";
      text.fontSize = options.text.fontSize ?? "12px";
      text.paddingLeft = options.text.paddingLeft ?? 0;
      text.paddingTop = options.text.paddingTop ?? 0;
      text.textHorizontalAlignment =
        options.text.textAlign ?? Control.HORIZONTAL_ALIGNMENT_CENTER;
      text.textVerticalAlignment =
        options.text.verticalAlign ?? Control.VERTICAL_ALIGNMENT_CENTER;
      text.scaleX = text.scaleY = 0.75;

      return {
        ui: this.fullscreenGUI,
        container,
        button,
        plane,
        text,
      };
    }
    return {
      ui: this.fullscreenGUI,
      container,
      button,
      plane,
    };
  }

  // 固定大小
  public static createPlaneIcon(name: string, options: {
    src: string,
    position: Vector3,
    width: number,
    height: number,
    visibility?: number,
    bill?: boolean,
    tag?: string
  }, parent?: AbstractMesh | TransformNode) {
    const plane = MeshBuilder.CreatePlane(name + "_gui_plane", {
      width: options.width,
      height: options.height,
      sideOrientation: Mesh.DOUBLESIDE
    });
    if (options.bill) {
      plane.billboardMode = Mesh.BILLBOARDMODE_NONE
    } else {
      plane.billboardMode = Mesh.BILLBOARDMODE_Y
    }
    plane.renderingGroupId = 1;
    plane.visibility = options?.visibility ?? 1;
    if (parent) {
      plane.parent = parent;
      // parent.setPivotPoint(Vector3.Zero().subtract(parent.position))
    }
    if (options.tag) {
      plane.metadata = {
        tag: options.tag ?? "icon_plane",
      };
    }
    plane.position = options.position;
    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane, options.width * 80, options.height * 40, undefined, undefined, undefined, (mesh, uniqueId, texture) => {
      const mat = new StandardMaterial("Advanced_" + mesh.name + "_texture")
      mesh.material = mat
      mat.emissiveTexture = texture
      mat.opacityTexture = texture
      mat.disableLighting = true
    });
    const image = new Image(name + "_gui_icon", options.src);
    image.width = 1;
    image.height = 1;

    advancedTexture.addControl(image);
    return { plane }
  }

  public createSpriteMeshIcon(
    parent: Nullable<AbstractMesh>,
    options: {
      name: string;
      icon: {
        src: string;
        width: number | string;
        height: number | string;
        iconType?: string;
      };
      text?: {
        text: string;
        fontSize: number | string;
        paddingLeft?: number | string;
        textAlign?: number;
        paddingTop?: number | string;
        verticalAlign?: number;
      };
      textureWidth: number;
      textureHeight: number;
      planeWidth: number;
      planeHeight: number;
      beat?: {
        enabled: boolean;
        offsetY: number;
      };
      position?: Vector3;
      tag?: string;
      deviceType?: string;
      zIndex?: number;
      isVisible?: boolean;
    },
    scene: Scene,
    isFullscreen: boolean = true
  ): {
    ui: AdvancedDynamicTexture;
    plane: Mesh;
    container: Container;
    button: Image;
    text?: TextBlock;
  } {
    const plane = MeshBuilder.CreatePlane(
      `POS_${options.name}`,
      {
        width: options.planeWidth,
        height: options.planeHeight,
      },
      scene
    );

    plane.position = options.position ?? Vector3.Zero();
    if (isFullscreen) {
      plane.setEnabled(false);
    }

    if (parent) {
      plane.parent = parent;
    }
    plane.metadata = {
      tag: options.tag ?? "icon_plane",
      deviceType: options.deviceType ?? "",
    };

    const container = new Container(`Container_${options.name}`);
    container.width = options.icon.width;
    container.height = options.icon.height;
    container.metadata = {
      tag: options.tag ?? "icon_plane",
      deviceType: options.deviceType ?? "",
    };
    container.isPointerBlocker = true;
    container.isVisible = options.isVisible ?? true;
    container.zIndex = options.zIndex ?? 1;

    if (isFullscreen) {
      this.fullscreenGUI.addControl(container);
    } else {
      const meshUI = AdvancedDynamicTexture.CreateForMesh(
        plane,
        options.textureWidth,
        options.textureHeight,
        true
      );
      meshUI.addControl(container);
    }

    const button = new Image(`ICON_${options.name}`, options.icon.src);
    button.width = options.icon.width;
    button.height = options.icon.height;
    button.scaleX = button.scaleY = 0.75;
    button.cellId = 1;
    button.metadata = { iconType: options.icon.iconType ?? "" };
    // button.cellHeight = 115;
    // button.cellWidth = 94;

    container.addControl(button);

    container.linkWithMesh(plane);

    if (options.beat?.enabled) {
      gsap.to(plane.position, {
        y: plane.position.y + options.beat.offsetY,
        duration: 1,
        repeat: -1,
        delay: Math.random(),
        yoyo: true,
      });
    }
    if (options.text) {
      const text = new TextBlock(`Text_${options.name}`, options.text.text);
      container.addControl(text);
      text.color = "#ffffff";
      text.fontSize = options.text.fontSize ?? "12px";
      text.paddingLeft = options.text.paddingLeft ?? 0;
      text.paddingTop = options.text.paddingTop ?? 0;
      text.textHorizontalAlignment =
        options.text.textAlign ?? Control.HORIZONTAL_ALIGNMENT_CENTER;
      text.textVerticalAlignment =
        options.text.verticalAlign ?? Control.VERTICAL_ALIGNMENT_CENTER;
      text.scaleX = text.scaleY = 0.75;

      return {
        ui: this.fullscreenGUI,
        container,
        button,
        plane,
        text,
      };
    }
    return {
      ui: this.fullscreenGUI,
      container,
      button,
      plane,
    };
  }

  public startMeshSpriteAnimation(plane: AbstractMesh, icon: Image) {
    if (icon) {
      if (this._timer) clearInterval(this._timer);
      icon.linkWithMesh(plane);
      icon.cellId = 1;
      let cellFlag = true;
      if (cellFlag) {
        icon.cellId = 1;
        icon.cellHeight = 115;
        icon.cellWidth = 94;
      } else {
        icon.sourceWidth = 94;
        icon.sourceHeight = 115;
      }
      // icon.isVisible = true;
      setInterval(() => {
        if (cellFlag) {
          if (icon.cellId < 25) icon.cellId++;
          else icon.cellId = 1;
        } else {
          icon.sourceLeft += icon.sourceWidth;
          if (icon.sourceLeft >= 1408) icon.sourceLeft = 0;
        }
      }, 50);
    }
  }

  public createSpriteIcon(options: {
    width: number | string;
    height: number | string;
    icon: {
      src: string;
      width: number;
      height: number;
    };
    name: string;
    position?: Vector3;
  }) {
    const button = new Image(`ANIMATION_${options.name}`, options.icon.src);
    button.width = options.width;
    button.height = options.height;
    button.isVisible = false;

    button.cellId = 1;
    button.cellHeight = options.icon.width;
    button.cellWidth = options.icon.height;

    this.fullscreenGUI?.addControl(button);

    this._focusIcon = button;
    return button;
  }
  // public newCreateSpriteIcon(options: {
  //   width: number | string;
  //   height: number | string;
  //   icon: {
  //     src: string;
  //     width: number;
  //     height: number;
  //   };
  //   animationInfo:{
  //     from: number,
  //     to: number,
  //     loop: boolean,
  //     delay: number
  //   }
  //   name: string;
  //   scene: Scene
  //   parent?: Mesh;
  //   position?: Vector3;
  // }) {
  //   const icon = options.icon
  //   const animationInfo = options.animationInfo
  //   const spriteManagerCycle = new SpriteManager("spriteManager", icon.src, 4, {width:icon.width,height: icon.height}, options.scene)
  //   const spriteInstance = new Sprite(options.name, spriteManagerCycle)
  //   spriteInstance.position = options.parent!.absolutePosition.clone()
  //   spriteInstance.position.y += 7
  //   spriteInstance.playAnimation(animationInfo.from, animationInfo.to, animationInfo.loop, animationInfo.delay)
  //   // spriteCycle.position = options.position?? new Vector3(0,5,0)
  //   spriteInstance.width = Number(options.width);
  //   spriteInstance.height = Number(options.height);
  //   spriteInstance.isPickable = true;
  //   spriteManagerCycle.isPickable = true;
  //   return spriteInstance;
  // }

  public startSpriteAnimation(plane: AbstractMesh, onComplete: () => void) {
    if (this._focusIcon) {
      if (this._timer) clearInterval(this._timer);

      this._focusIcon.linkWithMesh(plane);
      this._focusIcon.cellId = 1;
      this._focusIcon.isVisible = true;
      this._timer = setInterval(
        () => this._startInternalTimer(this._focusIcon!, onComplete),
        40
      );
    }
  }

  private _startInternalTimer(icon: Image, onComplete: () => void) {
    if (icon.cellId < 33) icon.cellId++;
    else {
      if (this._timer) clearInterval(this._timer);
      icon.isVisible = false;
      icon.cellId = 1;
      if (typeof onComplete === "function") onComplete();
    }
  }

  public clearAnimation() {
    if (this._focusIcon) {
      if (this._timer) clearInterval(this._timer);

      this._focusIcon.isVisible = false;
      this._focusIcon.cellId = 1;
    }
  }
}

export default SceneIcons;
