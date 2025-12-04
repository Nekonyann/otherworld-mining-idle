import { defineStore } from "pinia";
import { AREAS_DATA } from "@/data/Areas";
// import { Area } from "";

// export interface Backpack {
//   items: backpackItem[];
//   maxItems: number;
// }

export interface areaItem {
  id: number;
  explored: number;
  num: number;
  infinite?: boolean;
  changeHeight: number;
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
      maxFloor: area.maxFloor,
      resources: area.resources,
      // minerals: area.minerals.map((mineral) => ({
      //   id: mineral.id,
      //   name: mineral.name,
      //   color: mineral.color,
      //   value: mineral.value,
      //   requiredDepth: mineral.requiredDepth,
      //   abundance: mineral.abundance,
      //   rarity: mineral.rarity,
      // })),
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
    currentAreaId.value = areaId;
  };

  // 地图数据
  const areaMapLayers = ref({});
  const currentAreaMapLayers = computed(
    () => areaMapLayers.value[currentAreaId.value] || []
  );

  const mapLayers = computed(() => currentAreaMapLayers.value);

  // 生成地图数据
  const generateMapLayers = () => {
    areas.value.forEach((area) => {
      areaMapLayers.value[area.id] = area.minerals.map((mineral) => ({
        id: mineral.id,
        name: mineral.name,
        color: mineral.color,
        position: mineral.position,
      }));
    });
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

  return {
    userStatus,
    expPercentage,
    areas,
    currentAreaId,
    currentArea,
    mapLayers,

    changeArea,
  };
});
