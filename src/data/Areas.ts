import { Area } from "@/types/game";
import { Items } from "./Items";

export const AREAS_DATA: Record<string, Area> = {
  XINGCHENG: {
    id: 1,
    name: "兴城",
    description: "",
    level: 0,
    unlocked: true,
    height: 1600,
    maxFloor: 0,
  },
  YINYUNZHISEN: {
    id: 2,
    name: "氤氲之森",
    description: "",
    level: 0,
    unlocked: true,
    height: 1600,
    maxFloor: 30,
    landColor: "#4a7c59",
    resources: [],
    minerals: [
      {
        id: Items.WOOD_ORE.id,
        height: 1601,
        abundance: [1, 1],
        explored: true,
        rarity: 1,
      },
    ],
  },
  QIHEIKUANGDONG: {
    id: 3,
    name: "漆黑矿洞",
    description: "",
    level: 5,
    unlocked: false,
    height: 1400,
    maxFloor: 300,
    minerals: [{}],
  },
};

// 场景类型定义
export type AreaData = (typeof AREAS_DATA)[keyof typeof AREAS_DATA];
export type AreaId = keyof typeof AREAS_DATA;

// 所有区域
export const ALL_AREAS = Object.values(AREAS_DATA);

export const getAreaById = (id: number): AreaData | undefined => {
  return Object.values(AREAS_DATA).find((area) => area.id === id);
};

export const getUnlockedAreas = (level: number): AreaData[] => {
  return Object.values(AREAS_DATA).filter(
    (area) => area.level <= level || area.unlocked
  );
};
