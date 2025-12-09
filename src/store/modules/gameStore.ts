import { defineStore } from "pinia";
import { AREAS_DATA } from "@/data/Areas";
import { Area } from "@/types/game";
import { MAP_BLOCKS, MAP_BLOCKS_BY_ID } from "@/data/MapBlocks";

export interface Backpack {
  items: backpackItem[];
  maxItems: number;
}

export interface MapLayer {
  /** 所在层数 */
  floor: number;
  /** 矿物id */
  mineralId: number | null;
  /** 本层探索度 */
  explored: number;
  /** 矿物剩余数量 */
  remainingCount: number;
  /** 是否无限 */
  infinite?: boolean;
  /** 本层高度 */
  changeHeight: number;
  /** 本层颜色 */
  color?: string;
}

export interface SaveData {}

export const useGameStore = defineStore("game", () => {
  // 游戏状态
  const isNewPlayer = ref(true); // 是否是新玩家

  // 角色属性
  const userStatus = ref({
    name: "",
    level: 0,
    experience: 0,
    experienceMax: 10,
    experienceRate: 0, // 经验倍率
    expPercentage: 0,
    health: 50,
    attack: 0,
    defense: 0,
    money: 0,
    backpackSize: 0,
  });

  // 仓库状态
  // const storeroomStatus = ref({
  //
  // });

  // 背包状态
  const backpackStatus = ref<Backpack>({
    items: [],
    maxItems: userStatus.value.backpackSize,
  });

  const currentAreaId = ref(1);

  // 区域信息
  const areas = ref<Area[]>(
    Object.values(AREAS_DATA).map((area) => ({
      id: area.id,
      name: area.name,
      description: area.description,
      image: area.image,
      level: area.level,
      height: area.height,
      unlocked: area.unlocked,
      landColor: area.landColor,
      floors: area.floors,
      maxFloor: area.maxFloor,
      resources: area.resources,
      minerals: area.minerals.map((mineral) => ({
        id: mineral.id,
        floor: mineral.floor,
        abundance: mineral.abundance,
        explored: mineral.explored,
        rarity: mineral.rarity,
      })),
      // maxDepth: scene.maxDepth,
      // backgroundImage: scene.backgroundImage,
      // ambientColor: scene.ambientColor,
    }))
  );

  // 当前区域信息
  const currentArea = ref({
    height: 0,
    floor: 0,
    areaInfo: computed(() =>
      areas.value.find((area) => area.id === currentAreaId.value)
    ),
  });

  // 地图配置
  const mapConfig = {
    baseBlock: MAP_BLOCKS.AIR,
    defaultMinFloor: computed(
      () => (currentArea.value.areaInfo?.floors[0] ?? 0) - 20
    ),
    defaultMaxFloor: computed(
      () => (currentArea.value.areaInfo?.floors[1] ?? 0) + 20
    ),
  };

  // 切换区域
  const changeArea = (areaId: number) => {
    const area = areas.value.find((area) => area.id === areaId);
    if (area && (area.unlocked || area.unlocked === undefined)) {
      // 保存当前场景的深度信息
      const currentLayers = currentAreaMapLayers.value;
      // if (currentLayers.length > 0) {
      //   currentLayers.forEach((layer, index) => {
      //     layer.current = false;
      //   });
      // }

      currentAreaId.value = areaId;
      currentArea.value.floor = 0;
      currentArea.value.height = area.height;
      currentArea.value.areaInfo = area;

      // 如果没有地图数据则生成
      generateMapLayers(areaId);

      // 设置新区域的当前层
      const newLayers = currentAreaMapLayers.value;
      if (newLayers.length > 0) {
        // newLayers[0].current = true;
        newLayers[0].explored = 1;
      }
    }
  };

  const changeFloor = (
    changeVal: number
  ): { disableUp: boolean; disableDown: boolean } => {
    const currentFloor = currentArea.value.floor;
    const max = mapConfig.defaultMaxFloor.value;
    const min = mapConfig.defaultMinFloor.value;

    const targetFloor = changeVal + currentFloor;

    if (changeVal !== 0 && targetFloor <= max && targetFloor >= min) {
      currentArea.value.floor = targetFloor;
      updateCurrentLayer(targetFloor);
    }

    const newCurrent = currentArea.value.floor;
    return {
      disableUp: newCurrent <= min,
      disableDown: newCurrent >= max,
    };
  };

  const updateCurrentLayer = (targetFloor: number) => {
    const currentLayers = currentAreaMapLayers.value;

    // TODO 范围探索 - （上层?）、当前层、下层
    const floorsToExplore = [targetFloor, targetFloor + 0];

    currentLayers.forEach((layer) => {
      if (floorsToExplore.includes(layer.floor) && !layer.explored) {
        layer.explored = 1;
      }
    });
  };

  // 所有地图数据
  const areaMapLayers = ref<Record<string, MapLayer[]>>({});

  // 当前地图数据
  const currentAreaMapLayers = computed(
    () => areaMapLayers.value[currentAreaId.value] || []
  );

  const mapLayers = computed(() => currentAreaMapLayers.value);

  const index = computed(
    () => currentArea.value.floor - mapConfig.defaultMinFloor.value
  );
  // 当前层矿物信息
  const currentMineral = computed(() => {
    const currentLayer = mapLayers.value[index.value];
    return currentLayer || null;
  });

  // TODO 生成地图数据
  const generateMapLayers = (areaId: number) => {
    const targetAreaId = areaId || currentAreaId.value;
    const area = areas.value.find((a) => a.id === targetAreaId);
    if (!area) return;

    // 如果该场景已有地图数据，则不重新生成
    if (areaMapLayers.value[targetAreaId]) {
      return;
    }

    const layers: MapLayer[] = [];

    for (
      let floor = mapConfig.defaultMinFloor.value;
      floor <= mapConfig.defaultMaxFloor.value;
      floor++
    ) {
      // 第0层特殊生成
      if (floor === 0) {
        const color = currentArea.value.areaInfo?.landColor;
        layers.push(createBaseLayer(floor, MAP_BLOCKS.LAND_SURFACE.id, color));
        continue;
      }

      // 当前层可生成的block列表
      const availableBlocks = [];

      // 判断世界是否给出资源
      if (currentArea.value.areaInfo?.minerals) {
        for (const mineralConfig of currentArea.value.areaInfo.minerals) {
          const [minFloor, maxFloor] = mineralConfig.floor;

          if (floor >= minFloor && floor <= maxFloor) {
            availableBlocks.push(mineralConfig);
          }
        }
      }

      // TODO 生成逻辑
      const m =
        availableBlocks.length === 1
          ? availableBlocks[0]
          : availableBlocks.find(
              (item, index, array) =>
                index === Math.floor(Math.random() * array.length)
            );

      // 地上层生成
      if (floor >= mapConfig.defaultMinFloor.value && floor < 0) {
        // 找到可生成资源

        if (m) {
          layers.push(createMineralLayer(floor, m.id, true, 1));
          continue;
        }

        // 未找到直接生成空气
        layers.push(createBaseLayer(floor, MAP_BLOCKS.AIR.id));
        continue;
      }

      // 地下层生成
      if (m) {
        layers.push(createMineralLayer(floor, m.id, false));
      } else {
        let i = Math.floor(Math.random() * 100 + floor);
        if (i % 2 === 0) {
          layers.push(createMineralLayer(floor, MAP_BLOCKS.DIRT.id, false));
        } else {
          layers.push(createMineralLayer(floor, MAP_BLOCKS.STONE.id, false));
        }
      }
    }

    // 保存到区域地图数据中
    areaMapLayers.value[targetAreaId] = layers;
  };

  // 创建Layer
  const createLayer = (
    floor: number,
    mineralId: number,
    explored: number,
    remainingCount: number,
    infinite: boolean,
    changeHeight: number,
    color?: string
  ) => {
    return {
      floor,
      mineralId,
      explored,
      remainingCount,
      infinite,
      changeHeight,
      color: color || MAP_BLOCKS_BY_ID[mineralId]?.color,
    } as MapLayer;
  };

  // 创建Base层
  const createBaseLayer = (
    floor: number,
    mineralId: number,
    color?: string
  ) => {
    return createLayer(floor, mineralId, 1, -1, false, 1, color);
  };

  // 创建矿物层
  const createMineralLayer = (
    floor: number,
    mineralId: number,
    infinite: boolean,
    explored?: number
  ) => {
    return createLayer(floor, mineralId, explored ?? 0, 1, infinite, 1);
  };

  // 计算经验百分比
  const expPercentage = computed(() => {
    if (
      userStatus.value.experience === 0 ||
      userStatus.value.experienceMax === 0
    ) {
      return "0%";
    }

    let percentage =
      (userStatus.value.experience / userStatus.value.experienceMax) * 100;

    if (percentage >= 100) {
      return "100%";
    }

    return `${percentage.toFixed(1)}%`;
  });

  // 初始化基础游戏数据
  const initializeGameData = () => {
    // 初始化地图数值
    currentArea.value.areaInfo = areas.value.find(
      (area) => area.id === currentAreaId.value
    );
    currentArea.value.height = currentArea.value.areaInfo?.height || 0;
  };

  // TODO 初始化游戏
  const initGame = () => {
    initializeGameData();
    generateMapLayers(currentAreaId.value);
  };

  // TODO 重置游戏
  const resetGame = () => {};

  // TODO 存档
  const saveGame = async () => {};

  // TODO 读档
  const loadGame = async () => {};

  return {
    userStatus,
    expPercentage,
    areas,
    currentAreaId,
    currentArea,
    index, // 当前层索引
    currentMineral,

    mapLayers,

    changeArea,
    changeFloor,

    initGame,
  };
});
