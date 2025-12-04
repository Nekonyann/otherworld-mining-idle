<style scoped lang="scss">
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .area-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 20px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    background-color: #000;
  }

  .main {
    .floor-control {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      width: 30px;
      button {
        width: 30px;
        height: 30px;
        background-color: #000;
        color: #fff;
        border: none;
        border-radius: 0.2vw;
        cursor: pointer;
      }
      .floor-bar {
        width: 100%;
        height: 100%;
        background-color: #464646;
        margin: 10px 0;
      }
    }

    .rpg {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 105px);
      width: 100%;
      .view-canvas {
        width: 100%;
        background: black;
        min-height: 35%;
        align-self: center;
        border-radius: 0.2vw;
        background-image: url(@/assets/floor/forest_big.png);
        background-size: contain;
        background-repeat: no-repeat;
        display: flex;
        justify-content: center;
        background-position: center;
        gap: 20%;
        box-shadow: 0px 4px 3px 0px rgba(0, 0, 0, 0.4);
        flex-shrink: 0;
        transition: all 0.5s;
        position: relative;

        .map-button {
          height: 6vh;
          position: absolute;
          left: 0.5vw;
          bottom: 3%;
          background: transparent;
          transition: 0.15s;
          z-index: 1;
        }

        .dialog {
          display: flex;
          position: absolute;
          flex-direction: column;
          z-index: 1;
          height: 30%;
          width: 80%;
          bottom: 5px;
          padding: 5px 5px;
          min-height: 36px;
          position: absolute;
          background-color: rgba(0, 0, 0, 0.7);
          color: #fff;
          border-radius: 0.5rem;
        }

        .dialog-control {
          display: flex;
          justify-content: flex-end;
          align-content: flex-end;
        }
      }

      .progress {
        padding: 0 15px;
        width: 100%;
        display: flex;
        align-items: center;
      }

      .controls {
        display: flex;
        height: 100%;
        flex: 1;
        flex-wrap: wrap;
        overflow-y: auto;
        background-color: #0000007e;

        .package {
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          height: 100%;
          .package-control {
            padding-left: 15px;
            font-size: 16px;
          }

          .package-items {
            padding: 0 2px 0 2px;
            align-content: flex-start;
            display: flex;
            overflow-y: auto;
            flex-wrap: wrap;
            transition: all 0.5s;
          }
        }

        .logs {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
        }
      }
    }
  }
  ::-webkit-scrollbar {
    width: 5px;
  }
}
</style>

<template>
  <n-layout class="app">
    <n-layout-header>
      <div class="area-title">
        层级 {{ currentArea.floor }} 海拔 {{ currentArea.height }}m
        <n-text>{{ currentArea.areaInfo?.name }}</n-text>
        <n-tag size="small" type="success" :bordered="false">
          {{ $t("gui.level") }} {{ currentArea.areaInfo?.level }}
        </n-tag>
      </div>
    </n-layout-header>
    <n-layout-content>
      <n-layout has-sider>
        <n-layout-sider :width="35">
          <div class="floor-control">
            <button>上</button>
            <div class="floor-bar"></div>
            <button>下</button>
          </div>
        </n-layout-sider>
        <n-layout-content>
          <div class="rpg">
            <div class="view-canvas">
              <button @click="openMap()" class="map-button">地图</button>
              <n-modal
                v-model:show="showMap"
                class="custom-card"
                preset="card"
                style="width: 600px"
                title="地图"
                size="huge"
                :bordered="false"
              >
                <MapView :area="currentArea"></MapView>
              </n-modal>
              <div class="dialog" v-if="showDialog">
                <DialogView
                  :dialogs="dialogs"
                  :speed="100"
                  @update:showDialog="handleShowDialog"
                />
              </div>
            </div>
            <div class="progress" justify="end" vertical="true">
              <n-text>开发度</n-text>
              <n-progress
                style="flex: 5; padding-left: 15px"
                type="line"
                :percentage="percentage"
              />
              <!-- <n-text>当前资源: </n-text>
              <n-text>剩余: </n-text> -->
              <!-- <n-text>HP</n-text>
              <n-progress
                style="flex: 5; padding-left: 15px"
                type="line"
                :percentage="percentage"
              />
              <n-text>MP</n-text>
              <n-progress
                style="flex: 5; padding-left: 15px"
                type="line"
                :percentage="percentage"
              /> -->
            </div>
            <div class="controls">
              <n-split
                direction="horizontal"
                :max="0.98"
                :min="0.7"
                :default-size="0.7"
                v-model:size="split"
              >
                <template #1>
                  <div class="package">
                    <div class="package-control">
                      <n-text>背包</n-text>
                    </div>
                    <div class="package-items">
                      <PackItem
                        v-for="(item, index) in items"
                        :key="item.id"
                        :id="item.id"
                        :rarity="item.rarity"
                        :name="item.name"
                        :tooltip="item.tooltip"
                        :icon="item.icon"
                        :category="item.category"
                      ></PackItem>
                    </div>
                  </div>
                </template>
                <template #2>
                  <div class="logs">
                    <div class="log-control">
                      <n-text>日志</n-text>
                      <n-tag @click="showLogBox">></n-tag>
                    </div>
                    <GameLogs></GameLogs>
                  </div>
                </template>
              </n-split>
            </div>
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";
import PackItem from "@/components/ui/PackItem.vue";
import DialogView from "@/components/Dialog/index.vue";
import MapView from "@/components/MapView/index.vue";
import { useGameStore } from "@/store/modules/gameStore";
import { MSC1A1A1 } from "@/data/Dialogues";

const gameStore = useGameStore();

const backpack = ref<Backpack>({
  items: [],
  maxItems: 5000,
});

const currentArea = computed(() => gameStore.currentArea);

const percentage = ref(10);
const showMap = ref(false);

const openMap = () => {
  showMap.value = !showMap.value;
};

// 底部分栏信息
const split = ref<number>(0.7);
const showLogBox = () => {
  split.value = split.value === 0.7 ? 0.98 : 0.7;
};

const showDialog = ref(false);
const dialogs = ref();

const handleShowDialog = (value: boolean) => {
  showDialog.value = value;
};

const startDialogue = (storyId: any): Promise<void> => {
  return new Promise((resolve) => {
    dialogs.value = storyId;
    showDialog.value = true;

    const unwatch = watch(showDialog, () => {
      resolve();
      showDialog.value = false;
      unwatch();
    });
  });
};
</script>
