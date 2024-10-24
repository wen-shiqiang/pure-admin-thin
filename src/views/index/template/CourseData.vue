<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useApiRequests } from "../utils/request";
import { useImmer } from "@vue-hooks-plus/use-immer";
import { useRouter } from "vue-router";
const router = useRouter();
defineOptions({
  name: "CourseData"
});
const { getCourCoursesByCondApi } = useApiRequests();
const props = defineProps({
  year: {
    type: [String, Number],
    default: ""
  }
});
const courseAmount = ref(0);
const [courseList, updateCourseList] = useImmer<any>([]);
const statusMap = {
  0: { tag: "bg-warning", text: "未修订" },
  1: { tag: "bg-primary", text: "修订中" },
  2: { tag: "bg-success", text: "发布中" },
  3: { tag: "bg-danger", text: "已发布" }
};
watch(
  () => props.year,
  newVal => {
    getCourCoursesByCond({ year: props.year });
  }
);
const getCourCoursesByCond = async (params: any) => {
  try {
    const { result }: any = (await getCourCoursesByCondApi(params)) || {};
    courseAmount.value = result?.courseAmount ?? 0;
    updateCourseList(result?.courseList || []);
  } catch (error) {
    console.error("getDeptInfoByCondition error", error);
  }
};
getCourCoursesByCond({ year: props.year });

const goUserCourseInfo = item => {
  const path = item.roleType
    ? "/programManage/courseInfo/userPreview"
    : "/programManage/courseInfo/edit";
  goPage(path, {
    id: item.id,
    courseNumber: item.number,
    stsid: item.stsId,
    year: item.year
  });
};
// 页面跳转
const goPage = (path, query = {}) => {
  router.push({ path: path, query: query });
};
</script>

<template>
  <div v-if="courseList.length" class="course-data">
    <div class="revise-title">
      <div class="name">
        <el-badge type="info" :value="courseAmount" :offset="[13, 14]">
          我的课标
        </el-badge>
      </div>
    </div>
    <div class="course-list">
      <div v-for="(item, key) in courseList" :key="key" class="course-item">
        <div class="item-info">
          <div class="info-img">
            <div class="course-icon">
              <i class="mms-iconfont iconwodekechengbiaozhun" />
            </div>
            <el-tag
              size="small"
              class="tag"
              :type="item.courseProperty === 1 ? 'success' : 'primary'"
            >
              {{ item.courseProperty === 1 ? "校级公共课" : "专业课" }}
            </el-tag>
          </div>
          <div class="info-desc">
            <div style="width: 90%" class="name">
              {{ item.name }}
            </div>
            <div class="name-extend" :title="item.majorName">
              {{ item.majorName }}
            </div>
            <div class="person">
              {{ item.roleType === 0 ? "课程负责人" : "课程参与人" }}
            </div>
            <div class="btn">
              <el-button
                v-if="
                  (item.status === 0 || item.status === 1) &&
                  item.roleType === 0
                "
                class="!h-7 !py-0"
                type="primary"
                @click="goUserCourseInfo(item)"
              >
                去完成
              </el-button>
              <el-button
                v-else
                type="primary"
                class="!h-7 !py-0"
                @click="goUserCourseInfo(item)"
              >
                查看详情
              </el-button>
            </div>
          </div>
          <div :class="`status ${statusMap[item.status].tag}`">
            {{ statusMap[item.status].text }}
          </div>
        </div>
      </div>
      <div v-if="courseList.length === 0" class="empty-tip">暂无数据</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 我的课标
.course-data {
  margin-top: 10px;
  background: #fff;
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
  }
  .course-list {
    display: flex;
    flex-wrap: wrap;
    padding: 15px 10px;
    min-height: 50px;
    .empty-tip {
      color: #999;
      width: 100%;
      text-align: center;
    }
    .course-item {
      width: 33.33%;
      .item-info {
        position: relative;
        display: flex;
        align-items: center;
        margin: 0px 8px 10px 8px;
        padding: 20px;
        height: 150px;
        overflow: hidden;
        background: #fff;
        border: 1px solid #f5f5f5;
        transition: all 0.3s;
        &:hover {
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }
        .info-img {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-right: 15px;
          width: 80px;
          .course-icon {
            width: 40px;
            height: 40px;
            font-size: 20px;
            line-height: 40px;
            text-align: center;
            color: #fff;
            border-radius: 20px;
            background: #5c8ef2;
            margin-bottom: 10px;
            i {
              font-size: 20px;
              line-height: 40px;
            }
          }
          .tag {
            height: auto;
            white-space: normal;
            display: block;
            text-align: center;
          }
        }
        .info-desc {
          flex: 1;
          min-width: 0;
          .name {
            font-size: 14px;
            color: #333;
          }
          .name-extend {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 14px;
            color: #ccc;
          }
          .person {
            line-height: 30px;
            font-size: 14px;
            color: #999;
          }
          .btn {
            margin-top: 10px;
            .item-btn-info .el-button--mini {
              line-height: 14px !important;
            }
          }
        }
        .bg-success {
          background: #5bd171;
        }
        .bg-warning {
          background: #fa8c16;
        }
        .bg-primary {
          background: #5c8ef2;
        }
        .bg-danger {
          background: #ff6666;
        }
        .status {
          position: absolute;
          top: -24px;
          right: -55px;
          display: block;
          overflow: hidden;
          transform-origin: left top;
          transform: rotate(45deg);
          -webkit-transform: rotate(45deg);
          -moz-transform: rotate(45deg);
          width: 110px;
          line-height: 24px;
          color: #fff;
          font-size: 12px;
          text-align: center;
        }
      }
    }
  }
}
</style>
