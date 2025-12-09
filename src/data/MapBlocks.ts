import { Items } from "./Items";

export interface MapBlock {
  id: number;
  name: string;
  /** 显示颜色 */
  color: string;
  /** 是否可采集 */
  collectible: boolean;
  /** 采集凋落物 */
  dropItems?: number[];
  /** 需要的工具ID，如果为null则表示不需要工具 */
  requiredTool?: number | null;
  /** 稿力 */
  miningPowerRequired?: number;
  /** 硬度 */
  hardness: number;
  /** 韧性 */
  toughness: number;
}

export const MAP_BLOCKS: Record<string, MapBlock> = {
  AIR: {
    id: 0,
    name: "空气",
    color: "#81d4fa",
    collectible: false,
    hardness: 0,
    toughness: 0,
  },
  LAND_SURFACE: {
    id: 1,
    name: "地皮",
    color: "#ffffff",
    collectible: false,
    hardness: 0,
    toughness: 0,
  },
  BEDROCK: {
    id: 2,
    name: "基岩",
    color: "#000000",
    collectible: false,
    hardness: 10,
    toughness: 10,
  },
  DIRT: {
    id: 3,
    name: "泥土",
    color: "#8b4513",
    collectible: true,
    miningPowerRequired: 1,
    hardness: 1,
    toughness: 1,
  },
  STONE: {
    id: 4,
    name: "石头",
    color: "#7f7f7f",
    collectible: true,
    hardness: 10,
    toughness: 10,
  },
  WOOD: {
    id: 5,
    name: "木头",
    color: "#8b4513",
    collectible: true,
    dropItems: [Items.WOOD_ORE.id],
    requiredTool: 0,
    miningPowerRequired: 1,
    hardness: 1,
    toughness: 1,
  },
};

export const getBlockById = (id: number): MapBlock | undefined => {
  return Object.values(MAP_BLOCKS).find((block) => block.id === id);
};

export const MAP_BLOCKS_BY_ID: Record<number, MapBlock> = Object.fromEntries(
  Object.values(MAP_BLOCKS).map((block) => [block.id, block])
);
