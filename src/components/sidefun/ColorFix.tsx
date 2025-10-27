import { Scene, Color3 } from "@babylonjs/core";
import React from "react";

interface ColorFixProps {
  scene: Scene;
}

const ColorFix: React.FC<ColorFixProps> = ({ scene }) => {
  React.useEffect(() => {
    const executeWhenReady = () => {
      // 修改YT_Tree01材质
      const material1 = scene.getMaterialByName("YT_Tree01");
      if (material1) {
        (material1 as any).albedoColor = new Color3(0.8433697303921693, 1, 0.20471011883667684); // #ECFF7C
        (material1 as any).emissiveColor = new Color3(0.04777575355617064, 0.05459227728176034, 0.03423020656508195); // #404437
        (globalThis as any).debugNode = material1 as any;
      }
      
      // 修改YT_Tree02材质
      const material2 = scene.getMaterialByName("YT_Tree02");
      if (material2) {
        (material2 as any).emissiveColor = new Color3(0.01, 0.03, 0.015);
      }
      
      // 修改YT_Tree03材质
      const material3 = scene.getMaterialByName("YT_Tree03");
      if (material3) {
        (material3 as any).albedoColor = new Color3(0.6054842999109072, 1, 0); // #CBFF00
        (material3 as any).emissiveColor = new Color3(0.03287591694838383, 0.03287591694838383, 0.03155139140022645); // #363635
        (globalThis as any).debugNode = material3 as any;
      }
      
      // 修改建筑材质为灰色
      const grayMaterials = [
        { name: "mq_WS012_PLASTER-Sand-Structure", color: [0.7, 0.7, 0.7] },
        { name: "FZ_JWD_WSCL", color: [0.7, 0.7, 0.7] },
        { name: "FZ_JWD_LOGO", color: [0.7, 0.7, 0.7] },
        { name: "FZ_JWD_GongZuolou", color: [0.7, 0.7, 0.7] },
        { name: "FANGWU66", color: [0.7, 0.7, 0.7] },
        { name: "FZ_JWD_HuiShe", color: [0.7, 0.7, 0.7] },
        { name: "FZ_JWD_DianLiXiuKu", color: [0.7, 0.7, 0.7] },
        { name: "FZ_JWD_WuShuiChuLi", color: [0.7, 0.7, 0.7] },
        { name: "FZ_JWD_NeiRanJiJianPeng", color: [0.7, 0.7, 0.7] },
        { name: "FZ_JWD_BanGongLou", color: [0.7, 0.7, 0.7] },
        { name: "BANGONG9", color: [0.7, 0.7, 0.7] },
        { name: "FZ_JWD_FangWu_1", color: [0.7, 0.7, 0.7] },
        { name: "FZ_JWD_GuiDaoXiuKu", color: [0.7, 0.7, 0.7] }
      ];
      
      grayMaterials.forEach(item => {
        const material = scene.getMaterialByName(item.name);
        if (material) {
          (material as any).albedoColor = new Color3(item.color[0], item.color[1], item.color[2]);
        }
      });
      
      // 修改Surface Tree_001材质
      const material10 = scene.getMaterialByName("Surface Tree_001");
      if (material10) {
        (material10 as any).albedoColor = new Color3(0.5924380303208466, 0.7372047873606051, 0.028991186547107816);
        (material10 as any).emissiveColor = new Color3(0.04777575355617064, 0.06190747560545576, 0.04614884242235095);
        (globalThis as any).debugNode = material10 as any;
      }
      
      // 修改Surface Tree_003材质
      const material9 = scene.getMaterialByName("Surface Tree_003");
      if (material9) {
        (material9 as any).albedoColor = new Color3(0.7154654323350483, 0.8993845130465294, 0.2195197180748679); // #DBF380
        (material9 as any).emissiveColor = new Color3(0.03287591694838383, 0.03287591694838383, 0.03155139140022645); // #363635
        (globalThis as any).debugNode = material9 as any;
      }
      
      // 修改surfacedtree01材质
      const material20 = scene.getMaterialByName("surfacedtree01");
      if (material20) {
        (material20 as any).albedoColor = new Color3(0.7592995506950911, 0.8277257944550337, 0.000005077051900661759); // #E1EA01
        (material20 as any).emissiveColor = new Color3(0.02422294206753424, 0.03287591694838383, 0.012663720031582098); // #2F3623
        (globalThis as any).debugNode = material20 as any;
      }
      
      // 延迟修改纹理level
      setTimeout(() => {
        const targetIds = [637, 466, 470];
        const foundIds: number[] = [];
        
        scene.textures.forEach((texture) => {
          if (texture) {
            const textureId = (texture as any).uniqueId;
            if (targetIds.includes(textureId)) {
              (texture as any).level = 2;
              foundIds.push(textureId);
            }
          }
        });
        
        console.log('已设置纹理ID level为2:', foundIds);
      }, 1500);
    };

    if (scene.isReady()) {
      executeWhenReady();
    } else {
      scene.executeWhenReady(executeWhenReady);
    }
  }, [scene]);

  return null;
};

export default ColorFix;