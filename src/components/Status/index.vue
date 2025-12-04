<style scoped lang="scss">
.app {
  height: 100%;

  .style-tabs {
    :deep(.n-tabs-wrapper) {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    :deep(.n-tabs-tab) {
      padding: 5px 5px;
      cursor: pointer;
      &:hover {
        background-color: #373636;
      }
    }

    :deep(.n-tabs-tab-pad) {
      width: 0;
    }
  }
}
</style>

<template>
  <div class="app">
    <div class="level">
      等级 {{ userStatus.level }}
      <p>
        {{ expPercentage }} {{ userStatus.experience }} /
        {{ userStatus.experienceMax }}
      </p>
      <n-progress
        type="line"
        :show-indicator="false"
        :percentage="expPercentage"
      />
    </div>
    <div class="magic">
      MP
      <p>100 % 1 / 1</p>
      <n-progress
        type="line"
        :show-indicator="false"
        :percentage="expPercentage"
      />
    </div>

    <!-- 快捷菜单 -->
    <n-card content-style="padding: 0;">
      <n-tabs
        type="line"
        size="small"
        :tabs-padding="10"
        pane-style="padding: 10px;"
        class="style-tabs"
      >
        <n-tab-pane name="委托"> 委托菜单 </n-tab-pane>
        <n-tab-pane name="传送"> 传送菜单 </n-tab-pane>
        <n-tab-pane name="???????"> ??????? </n-tab-pane>
        <n-tab-pane name="????????"> ??????? </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { useGameStore } from "@/store/modules/gameStore";

const gameStore = useGameStore();

const userStatus = gameStore.userStatus;
let expPercentage = gameStore.expPercentage;
</script>
