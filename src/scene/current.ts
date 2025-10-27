import { Color3, FreeCamera, Mesh, Scene, Texture, Vector2, Vector3, Animation, CubeTexture, StandardMaterial } from "@babylonjs/core";
import { WaterMaterial } from "@babylonjs/materials";

/**
 * @description 水面波纹倒影效果
 * @export
 * @param {Scene} scene
 * @param {string} waterMeshName
 * @param {string[]} renderList
 * @return {*} 
 */
export function initWater(scene: Scene, waterMeshName: string, renderList: string[]) {
  if (!scene || !waterMeshName) return;
  const waterMesh01 = scene.getMeshByName(waterMeshName) as Mesh;
  
  // 创建水面材质 - 调整大小为512x512以匹配参考代码
  const water = new WaterMaterial("water", scene, new Vector2(512, 512));
  water.backFaceCulling = true;
  
  // 设置水面属性 - 根据参考代码更新
  water.bumpTexture = new Texture("textures/waterbump.png", scene);
  water.windForce = -5;  // 风力
  water.waveHeight = 0.2;  // 波浪高度，增加到0.2以匹配参考代码
  water.bumpHeight = 0.05;  // 法线贴图高度
  water.waterColor = new Color3(0.7, 0.9, 1.0);  // 修改为淡蓝色
  water.colorBlendFactor = 0.5;  // 增加颜色混合因子
  
  // 应用材质到水面网格
  waterMesh01.material = water;
  
  // 添加天空盒到反射列表
  const skybox = scene.getMeshByName("skyBox") as Mesh;
  if (skybox) {
    water.addToRenderList(skybox);
  }
  
  // 添加地面到反射列表（如果存在）
  const ground = scene.getMeshByName("ground") as Mesh;
  if (ground) {
    water.addToRenderList(ground);
  }
  
  // 添加自定义网格到反射列表
  renderList?.forEach((meshName: string) => {
    const mesh = scene.getMeshByName(meshName);
    if (mesh) {
      water.addToRenderList(mesh);
    }
  });
}

/**
   * @description 创建天空盒
   * @export
   * @param {Scene} scene
   * @param {string} skyboxTexturePath 天空盒纹理路径
   * @param {string} skyboxName 天空盒名称
   * @return {Mesh} 创建的天空盒网格
   */
  export function createSkybox(scene: Scene, skyboxTexturePath: string = "textures/skybox", skyboxName: string = "skyBox"): Mesh {
    // 创建天空盒网格
    const skybox = Mesh.CreateBox(skyboxName, 1000.0, scene);
    
    // 创建天空盒材质
    const skyboxMaterial = new StandardMaterial(skyboxName, scene);
    skyboxMaterial.backFaceCulling = false;
    
    // 设置天空盒纹理
    skyboxMaterial.reflectionTexture = new CubeTexture(skyboxTexturePath, scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    
    // 禁用光照影响
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    
    // 应用材质到天空盒
    skybox.material = skyboxMaterial;
    
    return skybox;
  }

  /**
   * @description 创建地面
   * @export
   * @param {Scene} scene
   * @param {string} texturePath 地面纹理路径
   * @param {number} size 地面大小
   * @param {string} groundName 地面名称
   * @param {number} positionY Y轴位置
   * @return {Mesh} 创建的地面网格
   */
  export function createGround(
    scene: Scene, 
    texturePath: string = "textures/ground.jpg", 
    size: number = 512, 
    groundName: string = "ground", 
    positionY: number = -1
  ): Mesh {
    // 创建地面纹理
    const groundTexture = new Texture(texturePath, scene);
    groundTexture.vScale = groundTexture.uScale = 4.0;
    
    // 创建地面材质
    const groundMaterial = new StandardMaterial(groundName + "Material", scene);
    groundMaterial.diffuseTexture = groundTexture;
    
    // 创建地面网格
    const ground = Mesh.CreateGround(groundName, size, size, 32, scene, false);
    ground.position.y = positionY;
    ground.material = groundMaterial;
    
    return ground;
  }

/**
 * @description clone model 以及对应骨骼和动画组
 * @export
 * @param {Scene} scene
 * @param {string} modelName
 * @param {any[]} masterAnimations
 * @param {Vector3} position
 * @return {*} 
 */
export function prepareModel(scene: Scene, modelName: string, masterAnimations: any[], position: Vector3){
  const masterSkel = scene.skeletons[0];
  const root = scene.getMeshByName("target")!; //目标mesh

  const clonePete = root.instantiateHierarchy(null, { doNotInstantiate: true }, (source: any, clone: any) => {
    clone.name = source.name;
  })!;

  clonePete.name = modelName;
  clonePete.setEnabled(true);
  clonePete.position.copyFrom(position);

  const cloneSkeleton = masterSkel.clone(modelName + ".clone");
  const map: any = {};
  const descendants = clonePete.getDescendants(false);
  for (let i = 0; i < descendants.length; i++) {
    //@ts-ignore
    if (descendants[i].subMeshes && descendants[i].skeleton) {
      //@ts-ignore
      descendants[i].skeleton = cloneSkeleton;
    }
    map[descendants[i].name] = descendants[i];
  }

  for (const bone of cloneSkeleton.bones) {
    const tf = bone.getTransformNode();
    if (tf && map[tf.name]) {
      bone.linkTransformNode(map[tf.name]);
    }
  }
  //[...scene.animationGroups];
  masterAnimations.forEach((ag) => {
    const clone = ag.clone(ag.name, (oldTarget: any) => {
      const newTarget = map[oldTarget.name];
      const newAg = modelName + "." + ag.name;

      return newTarget || oldTarget;
    });
    clone.name = modelName + "." + clone.name;
  });
  return clonePete;
}

/**
 * @description 更新模型方向
 * @export
 * @param {*} mesh
 * @param {Vector3} pointA
 * @param {Vector3} pointB
 * @param {number} [adjust]
 */
export function orientModelToDirection(mesh: any, pointA: Vector3, pointB: Vector3, adjust?: number) {
  // 确保传入的是 js 的 Vector3 对象
  if (!(pointA instanceof Vector3) || !(pointB instanceof Vector3)) {
    throw new Error('Points must be instances of Vector3');
  }

  // 计算方向向量（忽略Y轴，因为我们只关心XZ平面上的旋转）
  let direction = new Vector3(pointB.x - pointA.x, 0, pointB.z - pointA.z);
  direction.normalize(); // 归一化方向向量

  // 计算角度（相对于正X轴的逆时针方向）
  let angleInRadians = Math.atan2(direction.z, direction.x);

  // 调整角度以修正90度偏差
  angleInRadians += Math.PI / 2 + (adjust ?? 0); // 或者 angleInRadians -= Math.PI / 2;

  // 应用旋转到模型的Y轴
  mesh.getChildMeshes().forEach((m: any) => {
    //点位图标不旋转
    if (m.name.includes("POS")) return
    m.rotation.y = angleInRadians;
  })
  // // 或者
  // // 重置初始旋转角度
  // mesh.getChildren()[0].rotationQuaternion = Quaternion.Identity();
  // mesh.getChildren()[0].rotate(Axis.Y, angleInRadians);
}

/**
 * @description freeCamera聚焦
 * @export
 * @param {Scene} scene
 * @param {FreeCamera} camera
 * @param {Mesh} targetMesh
 * @param {*} [polarAngle=Math.PI / 4]
 * @param {number} [azimuthalAngle=0]
 * @param {number} [distance=300]
 * @return {*} 
 */
export function setupFixedDistanceCamera(scene: Scene, camera: FreeCamera, targetMesh: Mesh, polarAngle = Math.PI / 4, azimuthalAngle = 0, distance = 300) {
  const frameRate = 120;
  // 初始化摄像机位置
  function updatePosition() {
    if (!targetMesh.absolutePosition) return;

    // 计算新的摄像机位置
    var x = distance * Math.sin(polarAngle) * Math.cos(azimuthalAngle);
    var z = distance * Math.sin(polarAngle) * Math.sin(azimuthalAngle);
    var y = distance * Math.cos(polarAngle);

    var newPosition = new Vector3(
      targetMesh.absolutePosition.x + x,
      targetMesh.absolutePosition.y + y,
      targetMesh.absolutePosition.z + z
    );

    // 更新摄像机的位置并设置目标
    // camera.position.copyFrom(newPosition);
    // camera.setTarget(targetMesh.absolutePosition);

    let translation = targetMesh.absolutePosition ?? Vector3.Zero();
    if (camera["target"]) {
      const a = new Animation("FocusTargetAnimation", "target", frameRate, Animation.ANIMATIONTYPE_VECTOR3);
      a.setKeys([{ frame: 0, value: camera.getTarget() }, { frame: frameRate, value: translation }]);

      scene.beginDirectAnimation(camera, [a], 0, frameRate, false, 3);
    } else {
      camera.setTarget(translation);
    }

    const a = new Animation("FocusPositionAnimation", "position", frameRate, Animation.ANIMATIONTYPE_VECTOR3);
    a.setKeys([{ frame: 0, value: camera.position.clone() }, { frame: frameRate, value: newPosition }]);

    scene.beginDirectAnimation(camera, [a], 0, frameRate, false, 3);
  }

  // 第一次调用以初始化位置
  updatePosition();

  // 返回一个函数，用于在需要时更新摄像机位置
  return updatePosition;
}