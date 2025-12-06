<style lang="scss" scoped>
.altitude-control {
  height: 100%;
  button {
    width: 30px;
    height: 30px;
    background-color: #000;
    color: #fff;
    border: none;
    border-radius: 0.2vw;
    cursor: pointer;
  }
  .altitude-bar {
    width: 100%;
    height: 100%;
    background-color: #464646;
    margin: 10px 0;
  }
}
</style>

<template>
  <div class="altitude-control">
    <button
      @click="goUpOneFloor(-1)"
      :disabled="currentFloor >= currentArea.floor"
    >
      上
    </button>
    <div class="altitude-bar"></div>
    <button @click="goDownOneFloor(1)" :disabled="currentFloor <= 0">下</button>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from "@/store/modules/gameStore";
const gameStore = useGameStore();
const currentArea = computed(() => gameStore.currentArea);
const currentFloor = computed(() => gameStore.currentArea.floor);
const changeFloor = computed(() => gameStore.changeFloor);

const mapLayers = computed(() => gameStore.mapLayers);
console.log(`output->`, mapLayers.value);

// 上升一层
const goUpOneFloor = (change: number) => {
  changeFloor.value(change);
};

// 下降一层
const goDownOneFloor = (change: number) => {
  changeFloor.value(change);
};
</script>
