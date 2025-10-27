import { AbstractMesh, Color3, Scene, SceneLoader, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";

//摄像头扫描动画效果
class CameraEffect {
  public scene: Scene;
  public cameraMesh: AbstractMesh | undefined;
  constructor(scene: Scene) {
    this.scene = scene;
    this.importCameraEffect();
  }
  public showCameraEffect(position: Vector3, angle?: number) {
    if (this.cameraMesh) {
      this.cameraMesh.position = position.clone();
      this.cameraMesh.rotation = new Vector3(0, angle ?? 0, 0);
      this.cameraMesh
        .getChildMeshes()
        .forEach((childMesh) => (childMesh.renderingGroupId = 1));
      if (!this.cameraMesh.isEnabled(false)) {
        this.cameraMesh.setEnabled(true);
      }
    }
  }
  public removeCameraEffect() {
    this.cameraMesh
      ?.getChildMeshes()
      .forEach((childMesh) => (childMesh.renderingGroupId = 0));
    this.cameraMesh?.setEnabled(false);
  }
  // 引入摄像头动画
  public async importCameraEffect() {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./model/XC_Camera/",
      "XC_Camera.json",
      this.scene, null, '.babylon'
    );
    const XC_Camera = meshes.find((mesh) => mesh.name === "XC_Camera");
    XC_Camera!.scaling = new Vector3(0.6, 0.6, 0.6);
    XC_Camera?.setEnabled(false);

    const opacityTexture = new Texture(
      "./model/XC_Camera/XC_Camera_light_01.png",
      this.scene
    );
    this.scene.materials.forEach((mat) => {
      if (mat instanceof StandardMaterial) {
        if (mat.name === "XC_Camera_light_01") {
          mat.emissiveTexture?.dispose();
          mat.opacityTexture = opacityTexture;
          mat.diffuseColor = Color3.FromHexString("#068FFF");
          mat.emissiveColor = Color3.FromHexString("#028EFF");
          this.scene.registerAfterRender(() => {
            opacityTexture.vOffset += 0.005;
          });
        }

        if (mat.name === "XC_Camera_light_02") {
          mat.emissiveTexture?.dispose();
          mat.opacityTexture = mat.diffuseTexture;
          mat.diffuseColor = Color3.FromHexString("#1DACFF");
          mat.emissiveColor = Color3.FromHexString("#1E4EFF");
        }
      }
    });

    if (XC_Camera) {
      XC_Camera.scaling = new Vector3(10, 10, 10);
      this.cameraMesh = XC_Camera;
    }
  }

}
export default CameraEffect;