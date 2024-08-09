<script setup lang="ts">
defineOptions({
  name: "MyIndex"
});
import { ref, reactive, onMounted, onBeforeUnmount, toRaw } from "vue";
// import SchoolData from "./components/SchoolData.vue";
// import DeptData from "./components/DeptData.vue";
// import MajorData from "./components/MajorData.vue";
// import CourseData from "./components/CourseData.vue";
// import SchoolProcess from "./components/SchoolProcess.vue";
// import DeptProcess from "./components/DeptProcess.vue";
// import TrainEff from "./components/TrainEff.vue";
import { NoticeInfoType } from "./utils/types";
import dayjs from "dayjs";
// import GetQueryYearMixin from "@/utils/search/GetQueryYearMixin.js";
// import SetMxin from "@/utils/search/SetMxin.js";
const years = ref([]);
const isNotice = ref(false);
let noticeInfo = reactive<NoticeInfoType>({
  id: null,
  title: ""
});
const reviseContent = ref("");
const reviseStatus = ref(0);
const loading = ref(true);
const mmsUnifyLoading = ref(~~sessionStorage.getItem("mmsUnifyLoading"));
const year = ref(dayjs().year());
const isDropname = ref(0);
//   mixins: [GetQueryYearMixin, SetMxin],

//   computed: {
//     ...mapState({
//       isDropname: state => state.menu.isDropname
//     })
//   },
//   created() {
//     this.getUserMsg(); // 获取用户未读通知
//     this.getYear(); // 获取版本年份
//     this.getReviseNoticeByYear(); // 获取当前年份培养方案修订
//   },

//     ...mapMutations({
//       setCommonYear: "setCommonYear"
//     }),
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
// 获取用户未读通知
const getUserMsg = () => {
  //   this.getRequest("homePage/v1/getUserMsg", { year: this.year }).then(res => {
  //     if (res.data.status === 200 && res.data.result !== null) {
  //       isNotice.value = true;
  //       noticeInfo = res.data.result;
  //     }
  //   });
};

// 获取版本年份
const getYear = () => {
  //   this.getRequest("majorManage/v1/getMjrStandYear", {}).then(res => {
  //     if (res.data.status === 200) {
  //       years.value = res.data.result;
  //     }
  //   });
};

// 获取当前年份培养方案修订
const getReviseNoticeByYear = () => {
  //   this.postRequest("homePage/v1/getReviseNoticeByYear", {
  //     year: year.value
  //   }).then(res => {
  //     loading.value = false;
  //     if (res.data.status === 200) {
  //       reviseContent.value = res.data.result.content;
  //       reviseStatus.value = ~~res.data.result.status;
  //     }
  //   });
};

// 年份改变
const changeYear = year => {
  //   loading.value = true;
  //   year.value = year;
  //   getReviseNoticeByYear();
  //   setQuery();
};

// 接收通知
const receiveNotice = () => {
  //   this.$router.push({
  //     path: "/admin/notice/detail",
  //     query: {
  //       id: noticeInfo.id
  //     }
  //   });
};
</script>

<template>
  <div class="my-index !m-0">
    <!-- 获取修订通知 -->
    <div
      v-if="isNotice"
      :class="[
        mmsUnifyLoading !== 1 ? 'notice-tip' : 'notice-tip1',
        isDropname ? 'w--calc--64' : 'w--calc--210'
      ]"
    >
      <div class="notice">
        <div class="notice-title">
          <i class="mms-iconfont iconwodexiaoxi" />
          <span>{{ noticeInfo.title }}</span>
        </div>
        <el-button type="text" @click="receiveNotice">接收通知</el-button>
      </div>
    </div>

    <!-- <el-breadcrumb separator="/" class="nav-title">
      <el-breadcrumb-item>培养方案管理</el-breadcrumb-item>
      <el-breadcrumb-item>主页</el-breadcrumb-item>
    </el-breadcrumb> -->

    <!-- 修订期限 -->
    <div class="revise-time">
      <div class="revise-time-title">
        <span class="m-r-12">{{ reviseContent }}</span>
        <el-tag v-if="reviseStatus === 1" size="small">进行中</el-tag>
        <el-tag v-else-if="reviseStatus === 2" type="info" size="small"
          >已结束</el-tag
        >
        <el-tag v-else type="warning" size="small">未开始</el-tag>
      </div>
      <div class="revise-time-select">
        <i class="mms-iconfont iconriqi m-r-6" />
        <el-dropdown @command="changeYear">
          <span class="el-dropdown-link">
            {{ year }}
            <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <template v-slot:dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, key) in years"
                :key="key"
                :command="item"
                >{{ item }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 全校培养方案概览 -->
    <!-- <school-data :year="year" /> -->

    <!-- 院系数据分析 -->
    <!-- <dept-data :year="year" /> -->

    <!-- 我的专业 -->
    <!-- <major-data :year="year" /> -->

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
.my-index {
  position: relative;
  // 通知信息
  .notice-tip {
    position: fixed;
    top: 54px;
    right: 0px;
    z-index: 999;
  }
  .notice-tip1 {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 999;
  }
  .w--calc--210 {
    width: calc(100% - 210px);
  }
  .w--calc--64 {
    width: calc(100% - 64px);
  }
  .notice {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    border: 1px solid #ffe28d;
    background: #fffaeb;
    box-shadow: 0 0 2px #ffe28d;
    .notice-title {
      font-size: 14px;
      color: #999;
      i {
        color: #fa8c16;
      }
      span {
        color: #666;
      }
    }
  }
  // 修订期限
  .revise-time {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 15px;
    font-size: 16px;
    color: #333;
    background: #fff;
    .time {
      font-size: 14px;
    }
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
  // 通用标题
  .revise-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    font-size: 14px;
    line-height: 28px;
    color: #333;
    font-weight: bold;
    border-bottom: 1px solid #f5f5f5;
    .name {
      .num {
        display: inline-block;
        margin-left: 5px;
        width: 16px;
        height: 16px;
        border-radius: 8px;
        font-size: 12px;
        line-height: 16px;
        text-align: center;
        color: #999;
        background: #e5e5e5;
      }
    }
  }
  .el-dropdown-link {
    cursor: pointer;
  }
}
</style>
