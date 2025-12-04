<template>
  <div class="area-grid">
    <div
      v-for="area in areas"
      :key="area.id"
      :class="{
        'area-item': true,
        active: area.id === currentAreaId,
      }"
      @click="changeArea(area.id)"
    >
      <n-text>{{ area.name }}</n-text>
      <n-tag
        :type="
          area.unlocked || area.unlocked === undefined ? 'success' : 'error'
        "
        size="small"
      >
        {{ area.unlocked || area.unlocked === undefined ? "已解锁" : "未解锁" }}
      </n-tag>
      <div class="scene-description">
        {{ area.description }}
      </div>

      <div class="scene-requirements">
        <div class="requirement">
          <span>需要等级:</span>
          <span :class="{ 'requirement-met': level >= area.level }">
            {{ area.level }}
          </span>
        </div>
      </div>
      <div class="scene-minerals">
        <div class="minerals-label">主要资源:</div>
        <div class="minerals-list">
          <div
            v-for="mineral in area.minerals"
            :key="mineral.id"
            class="mineral-tag"
          >
            <div
              class="mineral-color"
              :style="{ backgroundColor: mineral.color }"
            ></div>
            <span>{{ mineral.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from "@/store/modules/gameStore";

const gameStore = useGameStore();

const areas = computed(() => gameStore.areas);
const currentAreaId = computed(() => gameStore.currentAreaId);
const changeArea = (id: number) => {
  const area = areas.value.find((area) => area.id === id);
  if (area && (area.unlocked || area.unlocked === undefined)) {
    gameStore.changeArea(id);
  }
};
</script>
