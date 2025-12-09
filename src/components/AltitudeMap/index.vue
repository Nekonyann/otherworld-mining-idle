<style lang="scss" scoped>
$layer-height: 2rem;
$bar-bg: #464646;
$highlight-border-color: #ffffff;
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
    position: relative;
    width: 100%;
    height: $layer-height * 17;
    overflow-y: auto;
    background-color: $bar-bg;
    border-radius: 4px;

    .layer-row {
      position: relative;
      height: $layer-height;
      display: flex;
      align-items: center;
      justify-content: center;

      // 文字样式
      color: rgba(255, 255, 255, 0.85);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      user-select: none;

      transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);

      // 未探索层样式
      &.not-explored {
        cursor: not-allowed;
      }

      &:not(.current):not(.not-explored):hover {
        filter: brightness(1.2);
        font-size: 18px;
      }

      &.current {
        box-shadow: inset 0 0 0 2px $highlight-border-color;

        color: #fff;
        font-weight: 700;
        font-size: 14px;

        //文字阴影
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);

        z-index: 2;
      }
    }
  }
}
</style>

<template>
  <div class="altitude-control">
    <button @click="goFloor(-1)" :disabled="buttonState.disableUp">上</button>
    <div class="altitude-bar" ref="barRef">
      <div
        v-for="layer in mapLayers"
        :key="layer.floor"
        class="layer-row"
        :class="{
          current: layer.floor === currentFloor && layer.explored,
          'not-explored': !layer.explored,
          // restricted: layer.restricted,
        }"
        :style="{
          backgroundColor: layer.explored ? layer.color : '#000000',
        }"
      >
        {{ Math.abs(layer.floor) }}
      </div>
    </div>
    <button @click="goFloor(1)" :disabled="buttonState.disableDown">下</button>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from "@/store/modules/gameStore";
const gameStore = useGameStore();
const currentArea = computed(() => gameStore.currentArea);
const currentFloor = computed(() => gameStore.currentArea.floor);
const changeFloor = computed(() => gameStore.changeFloor);
const index = computed(() => gameStore.index);

const mapLayers = computed(() => gameStore.mapLayers);

const buttonState = ref({
  disableUp: false,
  disableDown: false,
});

// 变更层数
const goFloor = (change: number) => {
  const { disableUp, disableDown } = changeFloor.value(change);
  buttonState.value.disableUp = disableUp;
  buttonState.value.disableDown = disableDown;
  scrollToCurrentFloor();
};

const barRef = ref(null);

const scrollToCurrentFloor = async () => {
  await nextTick();
  if (!barRef.value) return;

  const currentEl = barRef.value.querySelector(".layer-row.current");
  if (currentEl) {
    currentEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

onMounted(() => {
  scrollToCurrentFloor();
});
</script>
