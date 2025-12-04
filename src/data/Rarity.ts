import { $t } from "@/locales";

// 物品稀有度
export const ITEM_RARITY = {
  NONE: "none",
  MEDIOCRE: "mediocre",
  COMMON: "common",
  UNCOMMON: "uncommon",
  RARE: "rare",
  EPIC: "epic",
  LEGENDARY: "legendary",
  MYTHICAL: "mythical",
  IMMORTAL: "immortal",
  DIVINE: "divine",
  ANCIENT: "ancient",
  ASTROLOGY: "astrology",
} as const;

// 稀有度配置
export const RARITY_CONFIG = {
  [ITEM_RARITY.NONE]: {
    level: 0,
    name: null,
    color: "#000000",
    dropChance: 0,
  },
  [ITEM_RARITY.MEDIOCRE]: {
    level: 1,
    name: $t("rarity.mediocre"),
    color: "#808080",
    dropChance: 1,
  },
  [ITEM_RARITY.COMMON]: {
    level: 2,
    name: $t("rarity.common"),
    color: "#FFFFFF",
    dropChance: [0.95, 1],
  },
  [ITEM_RARITY.UNCOMMON]: {
    level: 3,
    name: $t("rarity.uncommon"),
    color: "#96FF96",
    dropChance: [0.6, 0.8],
  },
  [ITEM_RARITY.RARE]: {
    level: 4,
    name: $t("rarity.rare"),
    color: "#3498db",
    dropChance: 0.3,
  },
  [ITEM_RARITY.EPIC]: {
    level: 5,
    name: $t("rarity.epic"),
    color: "#9b59b6",
    dropChance: 0.1,
  },
  [ITEM_RARITY.LEGENDARY]: {
    level: 6,
    name: $t("rarity.legendary"),
    color: "#FFAF00",
    dropChance: 0.05,
  },
  [ITEM_RARITY.MYTHICAL]: {
    level: 6,
    name: $t("rarity.mythical"),
    color: "#c0392b",
    dropChance: 0.01,
  },
  [ITEM_RARITY.IMMORTAL]: {
    level: 7,
    name: $t("rarity.immortal"),
    color: "#c0392b",
    dropChance: 0.01,
  },
  [ITEM_RARITY.DIVINE]: {
    level: 8,
    name: $t("rarity.divine"),
    color: "#c0392b",
    dropChance: 0.01,
  },
  [ITEM_RARITY.ANCIENT]: {
    level: -2,
    name: $t("rarity.ancient"),
    color: ["#c0392b", "#2c3e50"],
    dropChance: 0.01,
  },
  [ITEM_RARITY.ASTROLOGY]: {
    level: -1,
    name: $t("rarity.astrology"),
    color: ["#B53ED2", "#e74c3c", "#f1c40f"],
    dropChance: 0.01,
  },
} as const;
