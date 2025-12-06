import { defineStore } from "pinia";
import { AREAS_DATA } from "@/data/Areas";
import { Area } from "@/types/game";

// export interface Backpack {
//   items: backpackItem[];
//   maxItems: number;
// }

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
}

export interface MapBlock {
  id: number;
  name: string;
  /** 显示颜色 */
  color: string;
  /** 是否可采集 */
  collectible: boolean;
  /** 需要的工具ID，如果为null则表示不需要工具 */
  requiredTool?: number | null;
  /** 稿力 */
  miningPowerRequired?: number;
  /** 硬度 */
  hardness: number;
  /** 韧性 */
  toughness: number;
}

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
  });

  // 当前区域
  // const currentArea = ref({
  //   id: 1,
  //   name: "",
  //   height: 0,
  //   maxFloor: 0,
  //   floor: 0,
  //   level: 0,
  // });

  const backpack = ref<Backpack>({
    items: [],
    maxItems: 200,
  });

  const currentAreaId = ref(1);
  // const currentArea = computed(() => AREAS_DATA[currentAreaId.value]);

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

  const changeFloor = (changeFloor: number) => {
    const currentLayers = currentAreaMapLayers.value;
    if (changeFloor !== 0 && changeFloor < currentLayers.length) {
      currentArea.value.floor -= changeFloor;
      updateCurrentLayer();
    }
  };

  const updateCurrentLayer = () => {
    const currentLayers = currentAreaMapLayers.value;
    currentLayers.forEach((layer, index) => {
      // layer.current = index === currentArea.value.floor;
      if (!layer.explored) {
        layer.explored = 1;
      }
    });
  };

  // 地图数据
  const areaMapLayers = ref<Record<string, MapLayer[]>>({});
  const currentAreaMapLayers = computed(
    () => areaMapLayers.value[currentAreaId.value] || []
  );

  const mapLayers = computed(() => currentAreaMapLayers.value);

  const MapBlock: Record<string, MapBlock> = {
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
      color: currentArea.value.areaInfo?.landColor || "#ffffff",
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
  };

  // 生成地图数据
  const generateMapLayers = (areaId: number) => {
    const mapConfig = {
      baseBlock: MapBlock.AIR,
      defaultMinFloor: (currentArea.value.areaInfo?.floors[0] ?? 0) - 20,
      defaultMaxFloor: (currentArea.value.areaInfo?.floors[1] ?? 0) + 20,
    };
    const targetAreaId = areaId || currentAreaId.value;
    const area = areas.value.find((a) => a.id === targetAreaId);
    if (!area) return;

    // 如果该场景已有地图数据，则不重新生成
    if (areaMapLayers.value[targetAreaId]) {
      return;
    }

    const layers: MapLayer[] = [];

    for (
      let floor = mapConfig.defaultMinFloor;
      floor <= mapConfig.defaultMaxFloor;
      floor++
    ) {
      // 第0层特殊生成
      if (floor === 0) {
        layers.push({
          floor: 0,
          mineralId: MapBlock.LAND_SURFACE.id,
          explored: 1,
          remainingCount: 1,
          infinite: false,
          changeHeight: 1,
        });
        continue;
      }

      // 当前层可生成的矿物列表
      const availableMinerals = [];

      if (currentArea.value.areaInfo?.minerals) {
        for (const mineralConfig of currentArea.value.areaInfo.minerals) {
          const [minFloor, maxFloor] = mineralConfig.floor;

          if (floor >= minFloor && floor <= maxFloor) {
            availableMinerals.push(mineralConfig);
          }
        }
      }

      // 地表生成
      if (floor >= mapConfig.defaultMaxFloor && floor > 0) {
        if (currentArea.value.areaInfo?.minerals) {
          layers.push({
            floor,
            mineralId: currentArea.value.areaInfo?.minerals[0].id,
            explored: 1,
            remainingCount: 1,
            infinite: false,
            changeHeight: 1,
          });
        }
        layers.push({
          floor,
          mineralId: MapBlock.AIR.id,
          explored: 1,
          remainingCount: 1,
          infinite: false,
          changeHeight: 1,
        });
        continue;
      }

      const layer: MapLayer = {
        floor,
        mineralId: null,
        explored: 0,
        remainingCount: 100,
        infinite: false,
        changeHeight: 1,
        // current:
        //   floor ===
        //   (areaId === currentAreaId.value ? currentArea.value.floor : 0),
      };

      layers.push(layer);
    }

    // 保存到区域地图数据中
    areaMapLayers.value[targetAreaId] = layers;
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

  // 初始化游戏
  const initGame = () => {
    // generateMapLayers();
  };

  return {
    userStatus,
    expPercentage,
    areas,
    currentAreaId,
    currentArea,
    mapLayers,

    changeArea,
    changeFloor,
  };
});
