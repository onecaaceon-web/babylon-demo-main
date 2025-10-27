// 建筑详细信息数据
export interface BuildingDetailInfo {
  id: string;          // 建筑唯一标识
  name: string;        // 建筑名称
  description: string; // 建筑描述
  functions: string[]; // 建筑职能/功能
  area: string;        // 建筑面积
  capacity: string;    // 建筑容量/处理能力
  staff: number;       // 员工数量
  imageUrl?: string;   // 建筑图片路径（可选）
}

// 建筑详细信息列表
export const buildingDetails: BuildingDetailInfo[] = [
  {
    id: "building_1",
    name: "电力中修库",
    description: "电力中修库是专门用于电力机车中等规模维修和保养的场所，配备了先进的检测和维修设备。",
    functions: ["电力机车维修", "部件检测", "故障诊断", "预防性维护"],
    area: "2,500 平方米",
    capacity: "每年维修 50 台机车",
    staff: 45,
    imageUrl: "./images/building_bg_1.png"
  },
  {
    id: "building_2",
    name: "轨道车架构库",
    description: "轨道车架构库负责轨道车辆的结构维护和组装工作，确保车辆结构安全可靠。",
    functions: ["车辆结构维护", "部件组装", "焊接修复", "质量检测"],
    area: "1,800 平方米",
    capacity: "每年组装 30 辆轨道车",
    staff: 32,
    imageUrl: "./images/building_bg_2.png"
  },
  {
    id: "building_3",
    name: "电力机车检测棚",
    description: "电力机车检测棚是专门用于电力机车全面检测的设施，配备先进的检测设备和系统。",
    functions: ["机车全面检测", "数据分析", "故障排查", "性能评估"],
    area: "1,200 平方米",
    capacity: "每年检测 100 台机车",
    staff: 28,
    imageUrl: "./images/building_bg_3.png"
  },
  {
    id: "building_4",
    name: "整备车间",
    description: "整备车间负责机车出库前的准备工作和入库后的初步检查，确保机车运行状态良好。",
    functions: ["机车整备", "清洁保养", "出库检查", "入库检测"],
    area: "3,000 平方米",
    capacity: "每日整备 20 台机车",
    staff: 55
  },
  {
    id: "building_5",
    name: "救援车间综合楼",
    description: "救援车间综合楼是处理紧急救援任务的指挥和执行中心，配备应急设备和专业人员。",
    functions: ["应急救援", "事故处理", "设备维护", "人员培训"],
    area: "2,200 平方米",
    capacity: "24小时待命响应",
    staff: 38
  },
  {
    id: "building_6",
    name: "电力小辅修库",
    description: "电力小辅修库负责电力机车的小规模维修和辅助保养工作，确保机车正常运行。",
    functions: ["小修保养", "部件更换", "日常维护", "技术升级"],
    area: "1,500 平方米",
    capacity: "每年维修 80 台机车",
    staff: 25
  },
  {
    id: "building_7",
    name: "检测棚",
    description: "检测棚是进行机车部件和系统检测的专业场所，确保各项指标符合安全标准。",
    functions: ["部件检测", "系统测试", "质量控制", "数据记录"],
    area: "1,000 平方米",
    capacity: "每年检测 500 套部件",
    staff: 20
  },
  {
    id: "building_8",
    name: "内燃中修库",
    description: "内燃中修库专门负责内燃机车的中等规模维修和保养，配备专业的内燃机设备。",
    functions: ["内燃机维修", "系统保养", "故障修复", "性能优化"],
    area: "2,800 平方米",
    capacity: "每年维修 40 台机车",
    staff: 42
  },
  {
    id: "building_9",
    name: "内部作业棚",
    description: "内部作业棚是进行日常维护和内部作业的多功能场所，支持多种维修和保养工作。",
    functions: ["日常维护", "内部作业", "临时维修", "工具存储"],
    area: "1,600 平方米",
    capacity: "支持多工种作业",
    staff: 30
  },
  {
    id: "building_10",
    name: "配件中心库",
    description: "配件中心库是存储和管理机车配件的中心仓库，确保配件供应及时准确。",
    functions: ["配件存储", "库存管理", "配件分发", "采购协调"],
    area: "2,000 平方米",
    capacity: "存储 10,000 种配件",
    staff: 18
  }
];

// 根据建筑ID获取详细信息
export function getBuildingDetailById(id: string): BuildingDetailInfo | undefined {
  return buildingDetails.find(building => building.id === id);
}