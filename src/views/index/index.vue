<script setup lang="ts">
defineOptions({
  name: "MyIndex"
});
import { ref, onMounted } from "vue";
import schoolData from "./template/SchoolData.vue";
import deptData from "./template/DeptData.vue";
import MajorData from "./template/MajorData.vue";
// import CourseData from "./components/CourseData.vue";
// import SchoolProcess from "./components/SchoolProcess.vue";
// import DeptProcess from "./components/DeptProcess.vue";
// import TrainEff from "./components/TrainEff.vue";
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
          <div class="flex items-center">
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
    <schoolData :year="year" />

    <!-- 院系数据分析 -->
    <deptData :year="year" />

    <!-- 我的专业 -->
    <major-data :year="year" />

    <!-- 我的课标 -->
    <!-- <course-data :year="year" /> -->
    <!-- 学院发布情况 -->
    <!-- <dept-process :year="year" /> -->
    <!-- 全校修订进度 -->
    <!-- <school-process :year="year" /> -->
    <!-- 培养方案修订效率 -->
    <!-- <train-eff :year="year" /> -->
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
    color: #333;
    background: #fff;
    .revise-time-select {
      color: #999;
      font-size: 14px;
      cursor: pointer;
    }
    .revise-time-select i {
      margin-left: 0px;
      color: #999;
      font-size: 14px;
    }
    .el-dropdown {
      color: #999 !important;
    }
  }
}
</style>
