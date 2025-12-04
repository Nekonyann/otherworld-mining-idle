<style scoped lang="scss">
.item-card {
  background-blend-mode: normal;
  margin: 0.12vw;
  height: 3.6rem;
  width: 3.6rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  transition: 0.05s;
  overflow: hidden;
  position: relative;
  min-height: 3.6rem;
  min-width: 3.6rem;

  .item-quantity {
    position: absolute;
    margin-right: 2px;
    background-color: rgba(0, 0, 0, 0.4);
    font-size: 12.5px;
  }
}

.info-card {
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0.2rem;
    .name {
      font-size: 18px;
      font-weight: 600;
      -webkit-text-stroke: 0.5px #aaaaaa;
    }

    .info-quantity {
    }
  }
}
</style>

<!--TODO props.quantity ? props.quantity : 1  -->

<template>
  <n-popover
    trigger="hover"
    :keep-alive-on-hover="false"
    :style="{
      'max-width': '360px',
      border: `0.1vw solid ${setRarityColor(props.rarity)}`,
    }"
  >
    <template #trigger>
      <div
        class="item-card"
        :style="{
          background: `url(${props.icon}) no-repeat center, #31313D70 `,
          'background-size': 'cover',
          border: `0.1vw solid ${setRarityColor(props.rarity)}`,
        }"
      >
        <span class="item-quantity">{{ formatNumberAbbreviation(10000) }}</span>
      </div>
    </template>
    <div class="info-card">
      <div class="title">
        <span
          class="name"
          :style="{ color: `${setRarityColor(props.rarity)}` }"
          >{{ $t(props.name) }}</span
        >
        <span class="info-quantity">{{
          props.quantity ? props.quantity : 1
        }}</span>
      </div>
      <n-tag
        size="small"
        :color="{
          color: `${setRarityColor(props.rarity)}`,
          textColor: '#000',
          borderColor: '#555',
        }"
      >
        {{ $t(props.rarity) }}
      </n-tag>
      <div class="tooltip">
        {{ $t(props.tooltip) }}
      </div>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import { Item } from "./test";
import { formatNumberAbbreviation } from "@/utils/format";

const props = defineProps({
  id: { type: Number }, // 物品编号
  name: { type: String }, // 物品名称
  tooltip: { type: String }, // 物品描述
  icon: { type: String }, // 物品图标
  rarity: { type: String }, // 物品稀有度
  quantity: { type: Number }, // 物品数量
  category: { type: Number }, // 物品分类
  maxQuantity: { type: Number }, // 物品最大数量
});

const emit = defineEmits(["click"]);

const handleClick = () => {
  emit("click", props.id);
};

const setRarityColor = (r: string) => {
  switch (r.split(".")[1]) {
    case "mediocre":
      return "#808080";
    case "common":
      return "#FFFFFF";
    case "uncommon":
      return "#96FF96";
    case "rare":
      return "#9696FF";
    case "epic":
      return "#FF9696";
    case "legendary":
      return "#FF96FF";
    case "astrology":
      return "#B53ED2";
    default:
      return "#00000000";
  }
};
</script>
