<style scoped lang="scss">
.app {
  height: 100%;
  width: 100%;
  .n-card {
    height: 100%;
  }

  .main {
    flex: 7;
  }
  .status {
    flex: 3;
  }
}
</style>

<template>
  <n-flex :size="[5, 0]" class="app">
    <n-card class="main" :content-style="{ padding: '5px' }"
      ><Mine></Mine
    ></n-card>
    <n-card class="status" :content-style="{ padding: '5px' }"
      ><Status></Status
    ></n-card>
  </n-flex>
</template>

<script setup lang="ts">
import Mine from "@/components/Mine/index.vue";
import Status from "@/components/Status/index.vue";
import { useGameStore } from "@/store/modules/gameStore";
const gameStore = useGameStore();

onMounted(() => {
  gameStore.initGame();
});
</script>
