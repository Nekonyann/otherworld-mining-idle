<style lang="scss" scoped>
.log-container {
  position: relative;
  width: 100%;
  height: 100%;

  .log-scrollbar {
    height: 100%;
    overflow-y: auto;

    .log-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      font-size: 14px;
    }
  }
}
</style>

<template>
  <div class="log-container">
    <n-scrollbar
      ref="logScroll"
      class="log-scrollbar"
      :style="{ height: '100%' }"
    >
      <div
        v-for="(log, index) in logs"
        :key="index"
        class="log-item"
        :class="log.type"
      >
        <span class="log-time">{{ log.time }}</span>
        <span class="log-message">{{ log.message }}</span>
      </div></n-scrollbar
    >
  </div>
</template>

<script setup lang="ts">
interface LogEntry {
  type: "user" | "system";
  time: string;
  message: string;
}

const logs = ref<LogEntry[]>([]);

const addLog = (log: LogEntry) => {
  logs.value.push(log);
};

const log: LogEntry = {
  time: new Date().toLocaleTimeString(),
  message: "游戏日志",
  type: "user",
};
addLog(log);
</script>
