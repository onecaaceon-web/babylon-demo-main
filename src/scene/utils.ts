import { Camera, Matrix, Scene, Vector3 } from "@babylonjs/core";

class SceneUtils {
  /**
   * World vector3 to screen point
   * @param vector3 
   * @param camera 
   * @param scene 
   * @returns 
   */
  static WorldToScreenPoint = function (vector3: Vector3, camera: Camera, scene: Scene) {
    return Vector3.Project(vector3,
      Matrix.Identity(),
      scene.getTransformMatrix(),
      camera.viewport.toGlobal(
        scene.getEngine().getRenderWidth(),
        scene.getEngine().getRenderHeight(),
      ));
  }

  /**
   * 两个向量点是否相近
   * @param vec1 
   * @param vec2 
   * @returns 
   */
  static Vector3Equals(vec1: Vector3, vec2: Vector3) {
    return vec1.x.toFixed(1) === vec2.x.toFixed(1)
    && vec1.y.toFixed(1) === vec2.y.toFixed(1)
    && vec1.z.toFixed(1) === vec2.z.toFixed(1)
  }
}

export default SceneUtils;