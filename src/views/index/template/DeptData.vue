<script setup lang="ts">
defineOptions({
  name: "DeptData"
});
import { ref, watch } from "vue";
import { useApiRequests } from "../utils/request";
import { useRouter } from "vue-router";
import { useImmer } from "@vue-hooks-plus/use-immer";
const router = useRouter();
const { getDeptInfoByConditionApi } = useApiRequests();
const props = defineProps({
  year: {
    type: [String, Number],
    default: ""
  }
});
watch(
  () => props.year,
  newVal => {
    showLoadIngMore.value = false;
    param.pageNum = 1;
    param.year = newVal;
    updateDeptList([]);
    getDeptInfoByCondition(param);
  }
);

const showLoadIngMore = ref(false);
const param = {
  year: props.year,
  pageNum: 1,
  pageSize: 8
};
const [deptList, updateDeptList] = useImmer<any>([]);
const getDeptInfoByCondition = async params => {
  try {
    const { result }: any = (await getDeptInfoByConditionApi(params)) || {};
    showLoadIngMore.value = result.endRow < result.total;
    updateDeptList(deptList => [...deptList, ...result.list]);
  } catch (error) {
    console.error("getDeptInfoByCondition error", error);
  }
};
getDeptInfoByCondition(param);

// 加载更多
const loadMoreList = () => {
  ++param.pageNum;
  getDeptInfoByCondition(param);
};
</script>

<template>
  <div class="dept-data">
    <div class="revise-title">院系数据分析</div>
    <div>
      <div class="dept-list">
        <div v-for="(item, key) in deptList" :key="key" class="dept-item">
          <div
            class="item-info"
            @click="
              router.push({
                path: '/admin/dept',
                query: {
                  id: item.id,
                  major: item.majorAmount,
                  mjrGroup: item.mjrGroupAmount,
                  mjrStandard: item.mjrStandardAmount,
                  courCourse: item.courCourseAmount,
                  deptName: item.deptName,
                  year: props.year
                }
              })
            "
          >
            <div class="dept-name">
              <i class="mms-iconfont iconjisuanjixueyuan icon" />
              <span>{{ item.deptName }}</span>
            </div>
            <div class="dept-desc">
              <div class="desc-info">
                专业数量：<span>{{ item.majorAmount }}</span>
              </div>
              <div class="desc-info">
                专业群：<span>{{ item.mjrGroupAmount }}</span>
              </div>
            </div>
            <div class="dept-desc">
              <div class="desc-info">
                培养方案：<span>{{ item.mjrStandardAmount }}</span>
              </div>
              <div class="desc-info">
                课程标准：<span>{{ item.courCourseAmount }}</span>
              </div>
            </div>
          </div>
          <div class="item-bg" />
        </div>
      </div>
      <div v-if="showLoadIngMore" class="loading-more" @click="loadMoreList()">
        加载更多...
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 院系数据分析
.dept-data {
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
  .dept-list {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    min-height: 100px;
    .dept-item {
      width: 25%;
      .item-info {
        padding: 20px;
        margin: 8px 8px 0px;
        cursor: pointer;
        background: #f9f9f9;
        .dept-name {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #333;
          margin-bottom: 20px;
          span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .icon {
            margin-right: 6px;
            color: #5c8ef2;
            font-size: 14px;
          }
        }
        .dept-desc {
          display: flex;
          align-items: center;
          margin-top: 10px;
          font-size: 14px;
          color: #999;
          .desc-info {
            flex: 1;
            span {
              font-size: 16px;
              color: #333;
            }
          }
        }
      }
      .item-bg {
        padding: 0px 20px;
        margin: 0px 6px 6px;
        height: 4px;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
        background: linear-gradient(
          90deg,
          rgba(112, 182, 255, 0.65) 0%,
          rgba(61, 127, 255, 0.85) 100%
        );
      }
    }
  }
  .loading-more {
    padding-bottom: 15px;
    text-align: center;
    cursor: pointer;
    color: #999;
    font-size: 14px;
    .trans-90 {
      transform: rotate(90deg);
    }
  }
}
</style>
