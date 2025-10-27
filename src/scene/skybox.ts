import { Color3, CubeTexture, Mesh, MeshBuilder, Scene, StandardMaterial, Texture } from "@babylonjs/core";
//天空盒
class Skybox {
  private _skybox: Mesh;
  private _skyboxMaterial: StandardMaterial;

  constructor(scene: Scene, prefix?: string, iSunny?:boolean) {
    this._skybox = MeshBuilder.CreateBox("skyBox", { size: 10000.0 }, scene);
    this._skyboxMaterial = new StandardMaterial("skyBox", scene);
    this._skyboxMaterial.backFaceCulling = false;
    this._skyboxMaterial.reflectionTexture = this.createCubeTexture(scene, prefix??'skybox/', iSunny);
    this._skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    this._skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    this._skyboxMaterial.specularColor = new Color3(0, 0, 0);
    this._skybox.material = this._skyboxMaterial;

    this._skyboxMaterial.fogEnabled = false;

    scene.fogMode = Scene.FOGMODE_LINEAR;
    scene.fogColor = Color3.FromHexString("#A8B3CA");
    scene.fogDensity = 0.5;
    scene.fogStart = 500;
    scene.fogEnd = 4000;
  }

  private createCubeTexture(scene: Scene, prefix?: string, iSunny?:boolean): CubeTexture {
    const faces = this.getSkyboxFaces(iSunny);
    return new CubeTexture(prefix?? 'skybox/', scene, faces);;
  }

  private getSkyboxFaces(iSunny:boolean = true): string[] {
    const sunnySky = [
      'px.png', // Right
      'py.png', // Top
      'pz.png', // Front
      'nx.png', // Left
      'ny.png', // Bottom
      'nz.png'  // Back
    ];
    const cloudySky = [
      'px_cloudy.png',
      'py_cloudy.png',
      'pz_cloudy.png',
      'nx_cloudy.png',
      'ny_cloudy.png',
      'nz_cloudy.png'
    ];
    return iSunny? sunnySky : cloudySky;
  }

  public switchSkybox(iSunny?:boolean, newPrefix?: string,): void {
    if (this._skyboxMaterial && this._skyboxMaterial.reflectionTexture) {
      (this._skyboxMaterial.reflectionTexture as CubeTexture).dispose();
      this._skyboxMaterial.reflectionTexture = this.createCubeTexture(this._skybox.getScene(), newPrefix??'skybox/', iSunny);
      this._skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    }
  }
}

export default Skybox