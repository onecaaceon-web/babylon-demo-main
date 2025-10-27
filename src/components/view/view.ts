// 摄像头坐标数据存储

// 定义相机位置和旋转的数据结构
export interface CameraPosition {
  x: number;
  y: number;
  z: number;
}

export interface CameraRotation {
  x: number;
  y: number;
  z: number;
}

export interface CameraViewPoint {
  id: string;        
  name: string;        
  position: CameraPosition; 
  rotation: CameraRotation;  
  duration: number;     
  description?: string; 
}

// 预设的视角点列表
export const predefinedViewPoints: CameraViewPoint[] = [
  {
    id: 'main_view',
    name: '主视角',
    position: { x: -117.13669132119027, y: 53.47087366146173, z: 348.21225168926196 },
    rotation: { x: 0.20683572465666575, y: -3.3562545480038213, z: 0 },
    duration: 4,
    description: '默认初始视角'
  },
  {
    id: 'view1',
    name: '视角1',
    position: { x: -312.4931189690341, y: 90.37581284700865, z: 290.3866961683689 },
    rotation: { x: 0.4705058404859292, y: -3.909626808662249, z: 0 },
    duration: 5,
    description: '视角1'
  },
  {
    id: 'view2',
    name: '视角2',
    position: { x: -395.2394510831513, y: 101.05955643496314, z: 92.13827952831534 },
    rotation: { x: 0.37546424269846446, y: -4.94778301054817, z: 0 },
    duration: 5,
    description: '视角2'
  },
  {
    id: 'view3',
    name: '视角3',
    position: { x: 84.31738599387518, y: 119.87160039529864, z: -236.09459622930885 },
    rotation: { x: 0.4669417568857986, y: -5.83919566056241, z: 0 },
    duration: 5,
    description: '视角3'
  },
  {
    id: 'view4',
    name: '视角4',
    position: { x: 391.56293278543626, y: 62.43567512659837, z: -79.31281792290805 },
    rotation: { x: 0.3582245998084863, y: -7.772926262174438, z: 0 },
    duration: 5,
    description: '视角4'
  },
  {
    id: 'view5',
    name: '视角5',
    position: { x: 239.00144536852437, y: 60.04635642345256, z: 90.35374370810648 },
    rotation: { x: 0.3359905650866786, y: -8.890267071294012, z: 0 },
    duration: 5,
    description: '视角5'
  },
  {
    id: 'view6',
    name: '视角6',
    position: { x: 103.1251667946011, y: 70.13898762388663, z: 206.34740292027396 },
    rotation: { x: 0.3274236358551262, y: -9.316211426667284, z: 0 },
    duration: 5,
    description: '视角6'
  },
  {
    id: 'view7',
    name: '视角7',
    position: { x: -159.51689950220518, y: 57.40718541279069, z: 338.0649437008166 },
    rotation: { x: 0.23940760342499992, y: -10.038442907679682, z: 0 },
    duration: 5,
    description: '视角7'
  },
];

export const getViewPointById = (id: string): CameraViewPoint | undefined => {
  return predefinedViewPoints.find(view => view.id === id);
};

export const getAllViewPoints = (): CameraViewPoint[] => {
  return [...predefinedViewPoints];
};

export const addViewPoint = (viewPoint: Omit<CameraViewPoint, 'id'>): CameraViewPoint => {
  const newViewPoint: CameraViewPoint = {
    ...viewPoint,
    id: `view_${Date.now()}` 
  };
 
  return newViewPoint;
};