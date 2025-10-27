import { Color4, MeshBuilder, ParticleSystem, Scene, Texture, Vector3 } from "@babylonjs/core";

//天气系统
class Weather {
  public scene: Scene;
  public skyBox: any;
  constructor(scene: Scene, skyBox: any) {
    this.scene = scene;
    this.skyBox = skyBox;
    this.initWeather();
  }
  private _createRainBig() {
    const stone_emitter = MeshBuilder.CreateBox(`rain`, { size: 0.5 }, this.scene)
    stone_emitter.position = new Vector3(0, 10, 15)
    stone_emitter.rotation = new Vector3(Math.PI * 0 / 180, Math.PI * 0 / 180, Math.PI * 0 / 180)
    stone_emitter.isVisible = false;
    const ps = new ParticleSystem(`big_rain`, 100, this.scene);
    const rainTx = new Texture('./textures/zip_YU_01.png', this.scene)
    ps.particleTexture = rainTx;
    ps.isLocal = true;
    ps.blendMode = ParticleSystem.BLENDMODE_MULTIPLYADD
    ps.emitter = stone_emitter; // the starting object, the emitter
    ps.minEmitBox = new Vector3(-10, -10, -10); // Starting all from
    ps.maxEmitBox = new Vector3(10, 10, 10); // To...
    ps.direction1 = new Vector3(0, -1, 0);
    ps.direction2 = new Vector3(0, -1, 0);
    ps.targetStopDuration = 0
    ps.color1 = Color4.FromHexString("#F5F5F5")
    ps.color2 = Color4.FromHexString("#FFFFFF")
    ps.colorDead = new Color4(1, 1, 1, 0)
    ps.minSize = 5;
    ps.maxSize = 10;
    ps.maxScaleX = 1;
    ps.minScaleX = 1;
    ps.maxScaleY = 1;
    ps.minScaleY = 1;
    ps.minLifeTime = 0.5;
    ps.maxLifeTime = 2;
    ps.minEmitPower = 10;
    ps.maxEmitPower = 15;
    ps.maxAngularSpeed = 0
    ps.minAngularSpeed = 0
    ps.minInitialRotation = 0;
    ps.maxInitialRotation = 0;
    ps.isAnimationSheetEnabled = false
    ps.spriteCellHeight = 0;
    ps.spriteCellWidth = 0;
    ps.startSpriteCellID = 0;
    ps.spriteRandomStartCell = false;
    ps.spriteCellLoop = true;
    ps.endSpriteCellID = 8;
    ps.emitRate = 100;
    ps.spriteCellChangeSpeed = 1;
    ps.isBillboardBased = true;
    ps.minInitialRotation = 0;
    ps.maxInitialRotation = 0;
    const camera = this.scene.getCameraByName('freeCamera')
    stone_emitter.parent = camera;
  }
  private _createRainMiddle() {
    const stone_emitter = MeshBuilder.CreateBox(`rain`, { size: 0.5 }, this.scene)
    stone_emitter.position = new Vector3(0, 10, 15)
    stone_emitter.rotation = new Vector3(Math.PI * 0 / 180, Math.PI * 0 / 180, Math.PI * 0 / 180)
    stone_emitter.isVisible = false;
    const ps = new ParticleSystem(`middle_rain`, 100, this.scene);
    const rainTx = new Texture('./textures/zip_YU_02.png', this.scene)
    ps.particleTexture = rainTx;
    ps.isLocal = true;
    ps.blendMode = ParticleSystem.BLENDMODE_MULTIPLYADD
    ps.emitter = stone_emitter; // the starting object, the emitter
    ps.minEmitBox = new Vector3(-10, -10, -10); // Starting all from
    ps.maxEmitBox = new Vector3(10, 10, 10); // To...
    ps.direction1 = new Vector3(0, -1, 0);
    ps.direction2 = new Vector3(0, -1, 0);
    ps.targetStopDuration = 0
    ps.color1 = Color4.FromHexString("#F5F5F5")
    ps.color2 = Color4.FromHexString("#FFFFFF")
    ps.colorDead = new Color4(1, 1, 1, 0)
    ps.minSize = 10;
    ps.maxSize = 12;
    ps.maxScaleX = 1;
    ps.minScaleX = 1;
    ps.maxScaleY = 1;
    ps.minScaleY = 1;
    ps.minLifeTime = 0.5;
    ps.maxLifeTime = 2;
    ps.minEmitPower = 8;
    ps.maxEmitPower = 12;
    ps.maxAngularSpeed = 0
    ps.minAngularSpeed = 0
    ps.minInitialRotation = 0;
    ps.maxInitialRotation = 0;
    ps.isAnimationSheetEnabled = false
    ps.spriteCellHeight = 0;
    ps.spriteCellWidth = 0;
    ps.startSpriteCellID = 0;
    ps.spriteRandomStartCell = false;
    ps.spriteCellLoop = true;
    ps.endSpriteCellID = 8;
    ps.emitRate = 100;
    ps.spriteCellChangeSpeed = 1;
    ps.isBillboardBased = true;
    ps.minInitialRotation = 0;
    ps.maxInitialRotation = 0;
    const camera = this.scene.getCameraByName('freeCamera')
    stone_emitter.parent = camera;
  }
  private _createRainSmall() {
    const stone_emitter = MeshBuilder.CreateBox(`rain`, { size: 0.5 }, this.scene)
    stone_emitter.position = new Vector3(0, 10, 15)
    stone_emitter.rotation = new Vector3(Math.PI * 0 / 180, Math.PI * 0 / 180, Math.PI * 0 / 180)
    stone_emitter.isVisible = false;
    const ps = new ParticleSystem(`small_rain`, 100, this.scene);
    const rainTx = new Texture('./textures/zip_YU_02.png', this.scene)
    ps.particleTexture = rainTx;
    ps.blendMode = ParticleSystem.BLENDMODE_MULTIPLYADD;
    ps.isLocal = true;
    ps.emitter = stone_emitter; // the starting object, the emitter
    ps.minEmitBox = new Vector3(-10, -10, -10); // Starting all from
    ps.maxEmitBox = new Vector3(10, 10, 10); // To...
    ps.direction1 = new Vector3(0, -1, 0);
    ps.direction2 = new Vector3(0, -1, 0);
    ps.targetStopDuration = 0
    ps.color1 = Color4.FromHexString("#F5F5F5")
    ps.color2 = Color4.FromHexString("#FFFFFF")
    ps.colorDead = new Color4(1, 1, 1, 0)
    ps.minSize = 5;
    ps.maxSize = 10;
    ps.maxScaleX = 1;
    ps.minScaleX = 1;
    ps.maxScaleY = 1;
    ps.minScaleY = 1;
    ps.minLifeTime = 0.5;
    ps.maxLifeTime = 2;
    ps.minEmitPower = 8;
    ps.maxEmitPower = 12;
    ps.maxAngularSpeed = 0
    ps.minAngularSpeed = 0
    ps.minInitialRotation = 0;
    ps.maxInitialRotation = 0;
    ps.isAnimationSheetEnabled = false
    ps.spriteCellHeight = 0;
    ps.spriteCellWidth = 0;
    ps.startSpriteCellID = 0;
    ps.spriteRandomStartCell = false;
    ps.spriteCellLoop = true;
    ps.endSpriteCellID = 8;
    ps.emitRate = 30;
    ps.spriteCellChangeSpeed = 1;
    ps.isBillboardBased = true;
    ps.minInitialRotation = 0;
    ps.maxInitialRotation = 0;
    const camera = this.scene.getCameraByName('freeCamera')
    stone_emitter.parent = camera;
  }
  private _createSnowBig() {
    const stone_emitter = MeshBuilder.CreateBox(`snow`, { size: 0.5 }, this.scene)
    stone_emitter.position = new Vector3(0, 10, 40)
    stone_emitter.rotation = new Vector3(Math.PI * 0 / 180, Math.PI * 0 / 180, Math.PI * 0 / 180)
    stone_emitter.isVisible = false;
    const ps = new ParticleSystem(`big_snow`, 100, this.scene);
    const snowTx = new Texture('./textures/zip_xue_01.png', this.scene)
    snowTx.vScale = -1;
    ps.updateSpeed = 0.017
    // ps.isLocal = true;
    ps.particleTexture = snowTx;
    ps.blendMode = ParticleSystem.BLENDMODE_STANDARD
    ps.emitter = stone_emitter; // the starting object, the emitter
    ps.minEmitBox = new Vector3(-20, -20, -20); // Starting all from
    ps.maxEmitBox = new Vector3(40, 20, 40); // To...
    ps.direction1 = new Vector3(0, -1, -0.2);
    ps.direction2 = new Vector3(-0.1, -1, 0);
    ps.targetStopDuration = 0
    ps.color1 = Color4.FromHexString("#FFFFFF")
    ps.color2 = Color4.FromHexString("#FFFFFF")
    ps.colorDead = new Color4(1, 1, 1, 0)
    ps.minSize = 20;
    ps.maxSize = 25;
    ps.maxScaleX = 1;
    ps.minScaleX = 1;
    ps.maxScaleY = 1;
    ps.minScaleY = 1;
    ps.minLifeTime = 2;
    ps.maxLifeTime = 4;
    ps.minEmitPower = 10;
    ps.maxEmitPower = 20;
    ps.maxAngularSpeed = 0.2
    ps.minAngularSpeed = 0.05
    ps.isAnimationSheetEnabled = false
    ps.spriteCellHeight = 0;
    ps.spriteCellWidth = 0;
    ps.startSpriteCellID = 0;
    ps.spriteRandomStartCell = false;
    ps.spriteCellLoop = true;
    ps.endSpriteCellID = 8;
    ps.emitRate = 200;
    ps.spriteCellChangeSpeed = 1;
    ps.isBillboardBased = true;
    ps.minInitialRotation = 5;
    ps.maxInitialRotation = 25;

    const camera = this.scene.getCameraByName('freeCamera')
    stone_emitter.parent = camera;
    //   this.scene.particleSystems.forEach(ps => {
    //     if (ps.name === "XHPSJ_Up_Falling_1" || ps.name === "XHPSJ_Below_Falling_1") {
    //         ps.start()
    //     }
    // })
    // ps.start()
  }
  private _createSnowMiddle() {
    const stone_emitter = MeshBuilder.CreateBox(`snow`, { size: 0.5 }, this.scene)
    stone_emitter.position = new Vector3(0, 35, 40)
    stone_emitter.rotation = new Vector3(Math.PI * 0 / 180, Math.PI * 0 / 180, Math.PI * 0 / 180)
    stone_emitter.isVisible = false;
    const ps = new ParticleSystem(`middle_snow`, 100, this.scene);
    const snowTx = new Texture('./textures/zip_xue_01.png', this.scene)
    snowTx.vScale = -1;
    ps.updateSpeed = 0.017
    // ps.isLocal = true;
    ps.particleTexture = snowTx;
    ps.blendMode = ParticleSystem.BLENDMODE_STANDARD
    ps.emitter = stone_emitter; // the starting object, the emitter
    ps.minEmitBox = new Vector3(-20, -20, -20); // Starting all from
    ps.maxEmitBox = new Vector3(40, 30, 40); // To...
    ps.direction1 = new Vector3(0, -1, -0.2);
    ps.direction2 = new Vector3(-0.1, -1, 0);
    ps.targetStopDuration = 0
    ps.color1 = Color4.FromHexString("#FFFFFF")
    ps.color2 = Color4.FromHexString("#FFFFFF")
    ps.colorDead = new Color4(1, 1, 1, 0)
    ps.minSize = 10;
    ps.maxSize = 15;
    ps.maxScaleX = 1;
    ps.minScaleX = 1;
    ps.maxScaleY = 1;
    ps.minScaleY = 1;
    ps.minLifeTime = 4;
    ps.maxLifeTime = 8;
    ps.minEmitPower = 5;
    ps.maxEmitPower = 15;
    ps.maxAngularSpeed = 0.2
    ps.minAngularSpeed = 0.05
    ps.isAnimationSheetEnabled = false
    ps.spriteCellHeight = 0;
    ps.spriteCellWidth = 0;
    ps.startSpriteCellID = 0;
    ps.spriteRandomStartCell = false;
    ps.spriteCellLoop = true;
    ps.endSpriteCellID = 8;
    ps.emitRate = 200;
    ps.spriteCellChangeSpeed = 1;
    ps.isBillboardBased = true;
    ps.minInitialRotation = 5;
    ps.maxInitialRotation = 25;

    const camera = this.scene.getCameraByName('freeCamera')
    stone_emitter.parent = camera;
    //   this.scene.particleSystems.forEach(ps => {
    //     if (ps.name === "XHPSJ_Up_Falling_1" || ps.name === "XHPSJ_Below_Falling_1") {
    //         ps.start()
    //     }
    // })
    // ps.start()
  }
  private _createSnowSmall() {
    const stone_emitter = MeshBuilder.CreateBox(`snow`, { size: 0.5 }, this.scene)
    stone_emitter.position = new Vector3(0, 40, 40)
    stone_emitter.rotation = new Vector3(Math.PI * 0 / 180, Math.PI * 0 / 180, Math.PI * 0 / 180)
    stone_emitter.isVisible = false;
    const ps = new ParticleSystem(`small_snow`, 100, this.scene);
    const snowTx = new Texture('./textures/zip_xue_01.png', this.scene)
    snowTx.vScale = -1;
    ps.updateSpeed = 0.015
    // ps.isLocal = true;
    ps.particleTexture = snowTx;
    ps.blendMode = ParticleSystem.BLENDMODE_STANDARD
    ps.emitter = stone_emitter; // the starting object, the emitter
    ps.minEmitBox = new Vector3(-20, -20, -20); // Starting all from
    ps.maxEmitBox = new Vector3(40, 10, 40); // To...
    ps.direction1 = new Vector3(0, -1, -0.2);
    ps.direction2 = new Vector3(-0.1, -1, 0);
    ps.targetStopDuration = 0
    ps.color1 = Color4.FromHexString("#FFFFFF")
    ps.color2 = Color4.FromHexString("#FFFFFF")
    ps.colorDead = new Color4(1, 1, 1, 0)
    ps.minSize = 25;
    ps.maxSize = 35;
    ps.maxScaleX = 1;
    ps.minScaleX = 1;
    ps.maxScaleY = 1;
    ps.minScaleY = 1;
    ps.minLifeTime = 2;
    ps.maxLifeTime = 4;
    ps.minEmitPower = 8;
    ps.maxEmitPower = 12;
    ps.maxAngularSpeed = 0.1
    ps.minAngularSpeed = 0.01
    ps.isAnimationSheetEnabled = false
    ps.spriteCellHeight = 0;
    ps.spriteCellWidth = 0;
    ps.startSpriteCellID = 0;
    ps.spriteRandomStartCell = false;
    ps.spriteCellLoop = true;
    ps.endSpriteCellID = 8;
    ps.emitRate = 5;
    ps.spriteCellChangeSpeed = 1;
    ps.isBillboardBased = true;
    ps.minInitialRotation = 5;
    ps.maxInitialRotation = 15;

    const camera = this.scene.getCameraByName('freeCamera')
    stone_emitter.parent = camera;
    //   this.scene.particleSystems.forEach(ps => {
    //     if (ps.name === "XHPSJ_Up_Falling_1" || ps.name === "XHPSJ_Below_Falling_1") {
    //         ps.start()
    //     }
    // })
    // ps.start()
  }

  public initWeather() {
    this._createRainBig()
    this._createRainMiddle()
    this._createRainSmall()
    this._createSnowBig()
    this._createSnowMiddle()
    this._createSnowSmall()
  }

  public weatherControl(type: "rain" | "snow" | "none", size: "big" | "middle" | "small") {
    // 先停止所有粒子系统
    this.scene.particleSystems.forEach(ps => {
      ps.stop()
    })
    
    if (type !== 'none') {
      this.skyBox.switchSkybox(false)
      // 启动指定类型和大小的粒子系统
      this.scene.particleSystems.forEach(ps => {
        if (ps.name === `${size}_${type}`) {
          ps.start()
        }
      })
    } else {
      this.skyBox.switchSkybox()
    }
  }
}

export default Weather;