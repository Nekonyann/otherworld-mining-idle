<style lang="scss" scoped>
.header {
  height: 50px;
}
.main {
  height: 100%;
  margin: 0 20px;
  .logo {
    font-size: 18px;
    font-weight: 600;
  }
}
</style>

<template>
  <div class="header">
    <!-- 顶部导航栏组件 -->
    <n-space justify="space-between" class="main" align="center">
      <n-space align="center">
        <n-text class="logo"> 异世矿工放置 </n-text>
        <n-button text @click="showVersionLog = true"> </n-button>
        <n-modal
          v-model:show="showVersionLog"
          class="custom-card"
          preset="card"
          style="width: 600px"
          title="更新日志"
          size="huge"
          :bordered="false"
          :segmented="segmented"
        >
          <template #header-extra> </template>
          开发
        </n-modal>
      </n-space>
      <n-space>
        <n-space>
          <!--TODO 0 年 0 天 - 春 -->
        </n-space>
        <!--TODO 天气 -->
      </n-space>
      <n-space align="center">
        <n-space> 保存 </n-space>
        <n-divider vertical />
        图鉴 设置 数据
        <!--TODO 主题切换 -->
        <!-- <n-button circle tertiary @click="changeTheme(!isDarkTheme)">
        </n-button> -->
      </n-space>
    </n-space>
  </div>
</template>

<script setup>
const showVersionLog = ref(false);
</script>
