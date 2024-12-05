<script setup lang="ts">
defineOptions({
  name: "MyIndex"
});
import { ref, onMounted } from "vue";
import SchoolData from "./template/SchoolData.vue";
import DeptData from "./template/DeptData.vue";
import MajorData from "./template/MajorData.vue";
import CourseData from "./template/CourseData.vue";
import DeptProcess from "./template/DeptProcess.vue";
import SchoolProcess from "./template/SchoolProcess.vue";
import TrainEff from "./template/TrainEff.vue";
import arrowDown from "@iconify-icons/ep/arrow-down";
import { indexRun, year, changeYear } from "./utils/index";
const { years, revise } = indexRun();
const visible = ref(false);
const getQuery = (path = null) => {
  //   const searchQuery = path || this.getSearchQuery(this.$route.path) || {};
  //   if (!XEUtils.isEmpty(searchQuery)) {
  //     if (!XEUtils.isEmpty(searchQuery?.requestParam)) {
  //       if ((searchQuery?.requestParam.year ?? "") !== "") {
  //         this.year = searchQuery?.requestParam?.year ?? "";
  //       }
  //     }
  //   }
};
const setQuery = () => {
  //   const page = {};
  //   const searchQuery = {
  //     path: this.$route.path,
  //     query: {
  //       ...page,
  //       requestParam: {
  //         year: this.year
  //       }
  //     }
  //   };
  //   searchQueryAsync(searchQuery);
};
</script>

<template>
  <div class="my-index !m-0">
    <div class="revise-time">
      <div class="flex items-center">
        <span class="mr-3">{{ revise.content }}</span>
        <el-tag :type="revise.showTagFun(revise.status)" size="small">
          {{ revise.showTagTextFun(revise.status) }}
        </el-tag>
      </div>
      <div class="revise-time-select">
        <el-dropdown
          trigger="hover"
          @command="changeYear"
          @visible-change="
            () => {
              visible = !visible;
            }
          "
        >
          <div
            class="flex items-center text-[--el-color-info] cursor-pointer text-[14px]"
          >
            <i class="mms-iconfont iconriqi mr-[6px]" />
            {{ year }}
            <IconifyIconOffline
              class="ml-[6px] transition-all duration-300"
              :class="{ 'rotate-180': visible }"
              :icon="arrowDown"
            />
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in years"
                :key="item"
                :command="item"
              >
                {{ item }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 全校培养方案概览 -->
    <SchoolData :year="year" />

    <!-- 院系数据分析 -->
    <DeptData :year="year" />

    <!-- 我的专业 -->
    <MajorData :year="year" />

    <!-- 我的课标 -->
    <CourseData :year="year" />
    <!-- 学院发布情况 -->
    <DeptProcess :year="year" />
    <!-- 全校修订进度 -->
    <SchoolProcess :year="year" />
    <!-- 培养方案修订效率 -->
    <TrainEff :year="year" />
  </div>
</template>
<style lang="scss">
.userMsgNotification {
  border: 1px solid #ffe28d;
  background: #fffaeb;
  box-shadow: 0 0 2px #ffe28d;
  padding: 10px 0;
  min-width: 330px;
  width: auto;
  &.right {
    right: 0;
  }
  .el-notification__group {
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
.my-index {
  .revise-time {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 15px;
    font-size: 16px;
    color: var(--el-text-color-primary);
    background: var(--el-bg-color);
  }
}
</style>
