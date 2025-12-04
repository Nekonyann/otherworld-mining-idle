export type ItemCategory =
  | "ore"
  | "ingot"
  | "gem"
  | "material"
  | "consumable"
  | "tool"
  | "equipment"
  | null;

export interface Item {
  id: number;
  level: number;
  name: string;
  tooltip: string;
  // 图标路径
  icon: string;
  // 稀有度
  rarity: string;
  // 物品分类
  category: ItemCategory;
  // 物品数量
  quantity?: number;
  // 物品上限
  maxQuantity: number;
}

export interface Backpack {
  items: Item[];
  maxItems?: number;
}

export interface Rarity {
  color: string[];
}

export interface Entity {
  id: number;
  name: string;
  description: string;
  health: number;
  attack: number;
  defense: number;
  inventory: Item[];
}

export interface Area {
  id: number;
  name: string;
  description: string;
  level: number;
  image: string;
  height?: number;
  unlocked: boolean;
  children?: [];
  maxFloor: number;
  floors?: number[];
  resources?: string[];
  minerals?: Array<object>[];
  spawnPath?: Array<spawnOre>[];
}

export interface spawnOre {
  id: number;
  floors: number[];
}

export interface Tools {
  id: number;
  name: string;
  tooltip: string;
  icon: string;
  rarity: string;
  category: string;
  maxQuantity: number;
}
