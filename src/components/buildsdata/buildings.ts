// 建筑信息数据
export interface BuildingInfo {
  id: string;          // 建筑唯一标识
  name: string;        // 建筑名称
  position: {          // 建筑坐标
    x: number;
    y: number;
    z: number;
  };
  camrapoint?: {       // 跳转相机坐标（可选）
    x: number;
    y: number;
    z: number;
  };
  viewPosition?: {     // 视角坐标（可选）
    x: number;
    y: number;
    z: number;
  };
  meshName?: string;   // 对应的网格名称（可选）
  icon: {              // 图标配置
    src: string;       // 图标图片路径
    width: number;     // 图标宽度
    height: number;    // 图标高度
  };
  background?: string; // 容器背景图片路径（可选）
}

// 建筑信息列表
export const buildings: BuildingInfo[] = [
  {
    id: "building_1",
    name: "电力中修库",
    position: { x: 119.16, y: 20.85, z: 8.20 },
    camrapoint: { x: 30.10, y: 24.48, z: -21.13 }, // 跳转相机坐标
    viewPosition: { x: 0.1957, y: -4.9700, z: 0.0000 }, // 视角坐标
    meshName: "FZ_JWD_ZhongXiuKu", // 示例网格名称
    icon: {
      src: "./images/divicon.png",
      width: 153,
      height: 58
    },
    background: "./images/building_bg_1.png"
  },
  {
    id: "building_2",
    name: "轨道车架构库",
    position: { x: 72.39, y: 21.37, z: -52.88 },
    camrapoint: { x: 154.47, y: 21.75, z: -67.31 }, // 跳转相机坐标
    viewPosition: { x: 0.2119, y: -1.5630, z: 0.0000 }, // 视角坐标
    meshName: "FZ_JWD_GuiDaoXiuKu.002", // 更新后的网格名称
    icon: {
      src: "./images/divicon.png",
      width: 153,
      height: 58
    },
    background: "./images/building_bg_2.png"
  },
  {
    id: "building_3",
    name: "电力机车检测棚",
    position: { x: 131.05, y: 16.53, z: -89.19 },
    camrapoint: { x: 185.20, y: 20.21, z: -100.51 }, // 跳转相机坐标
    viewPosition: { x: 0.2794, y: -1.6188, z: 0.0000 }, // 视角坐标
    meshName: "FZ_JWD_GuiDaoXiuKu.001", // 更新后的网格名称
    icon: {
      src: "./images/divicon.png",
      width: 153,
      height: 58
    },
    background: "./images/building_bg_3.png"
  },
  {
    id: "building_4",
    name: "整备车间",
    position: { x: 265.25, y: 13.97, z: -125.69 },
    camrapoint: { x: 335.11, y: 19.93, z: -192.84 }, // 跳转相机坐标
    viewPosition: { x: 0.3308, y: 5.7528, z: 0.0000 }, // 视角坐标
    meshName: "FZ_JWD_NeiRanJiJianPeng", // 更新后的网格名称
    icon: {
      src: "./images/divicon.png",
      width: 153,
      height: 58
    }
  },
  {
    id: "building_5",
    name: "救援车间综合楼",
    position: { x: 218.52, y: 24.35, z: -185.66 },
    camrapoint: { x: 277.65, y: 32.38, z: -232.72 }, // 跳转相机坐标
    viewPosition: { x: 0.2838, y: 5.4882, z: 0.0000 }, // 视角坐标
    meshName: "FZ_JWD_weizuowan5", // 更新后的网格名称
    icon: {
      src: "./images/divicon.png",
      width: 153,
      height: 58
    }
  },
  {
    id: "building_6",
    name: "电力小辅修库",
    position: { x: -138.32, y: 20.89, z: 92.52 },
    camrapoint: { x: -142.92, y: 36.58, z: 150.02 }, // 跳转相机坐标
    viewPosition: { x: 0.4266, y: -3.4720, z: 0.0000 }, // 视角坐标
    meshName: "FZ_JWD_DianLiXiuKu.003", // 材质名称
    icon: {
      src: "./images/divicon.png",
      width: 153,
      height: 58
    }
  },
  {
    id: "building_7",
    name: "检测棚",
    position: { x: -61.13, y: 12.73, z: 48.16 },
    camrapoint: { x: -30.14, y: 10.47, z: 42.40 }, // 跳转相机坐标
    viewPosition: { x: 0.1763, y: -1.2816, z: 0.0000 }, // 视角坐标
    meshName: "FZ_JWD_DianLiXiuKu", // 材质名称
    icon: {
      src: "./images/divicon.png",
      width: 153,
      height: 58
    }
  },
  {
    id: "building_8",
    name: "内燃中修库",
    position: { x: -71.55, y: 30.60, z: -22.67 },
    camrapoint: { x: -28.11, y: 40.10, z: -117.97 }, // 跳转相机坐标
    viewPosition: { x: 0.3178, y: -0.4187, z: 0.0000 }, // 视角坐标
    meshName: "FZ_JWD_ZhongXiuKu1_1.001", // 材质名称
    icon: {
      src: "./images/divicon.png",
      width: 153,
      height: 58
    }
  },
  {
    id: "building_9",
    name: "内部作业棚",
    position: { x: -125.89, y: 12.69, z: 7.85 },
    camrapoint: { x: -173.16, y: 16.17, z: 37.12 }, // 跳转相机坐标
    viewPosition: { x: 0.2332, y: 8.2965, z: 0.0000 }, // 视角坐标
    meshName: "FZ_JWD_ZhongXiuKu1_1.002", // 材质名称
    icon: {
      src: "./images/divicon.png",
      width: 153,
      height: 58
    }
  },
  {
    id: "building_10",
    name: "配件中心库",
    position: { x: -8.58, y: 24.08, z: -50.46 },
    camrapoint: { x: 50.45, y: 25.66, z: -121.33 }, // 跳转相机坐标
    viewPosition: { x: 0.2910, y: -0.3631, z: 0.0000 }, // 视角坐标
    meshName: "FZ_JWD_ZhongXiuKu1_1.003", // 更新后的网格名称
    icon: {
      src: "./images/divicon.png",
      width: 153,
      height: 58
    }
  }
];