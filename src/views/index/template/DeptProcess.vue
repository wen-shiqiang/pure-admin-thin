<script setup lang="ts">
import { watch } from "vue";
import { useApiRequests } from "../utils/request";
import { useImmer } from "@vue-hooks-plus/use-immer";
defineOptions({
  name: "DeptProcess"
});
const { getDeptCompleteRateApi } = useApiRequests();
const props = defineProps({
  year: {
    type: [String, Number],
    default: ""
  }
});
watch(
  () => props.year,
  () => {
    getDeptCompleteRate({ year: props.year });
  }
);
const [processList, updateProcessList] = useImmer<any>([]);
const getDeptCompleteRate = async (params: any) => {
  try {
    const { result }: any = await getDeptCompleteRateApi(params);
    updateProcessList(result || []);
  } catch (error) {
    console.error("getDeptCompleteRate error", error);
  }
};
getDeptCompleteRate({ year: props.year });
</script>

<template>
  <div class="dept-process">
    <div class="revise-title">学院发布情况</div>
    <div class="dept-list">
      <div class="dept-box">
        <div v-for="item in processList" :key="item.id" class="dept-item">
          <el-progress
            type="circle"
            :width="60"
            :stroke-width="8"
            :percentage="item.completeRate"
            :show-text="false"
            color="#5c8ef2"
            stroke-linecap="square"
          />
          <div class="desc">
            <div class="name">{{ item.deptName }}</div>
            <div class="tip">完成率</div>
            <div class="rate">{{ item.completeRate }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 学院完成情况
.dept-process {
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
    align-items: center;
    z-index: 9;
    padding: 15px 0px;
    .dept-box {
      flex: 1;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .dept-item {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        margin: 10px 0px 10px 20px;
        width: calc(20% - 20px);
        transition-duration: 0.5s;
        .desc {
          flex: 1;
          line-height: 24px;
          color: #333;
          margin-left: 15px;
          .name {
            font-size: 14px;
          }
          .tip {
            font-size: 14px;
            color: #999;
          }
          .rate {
            font-size: 20px;
          }
        }
      }
    }
    .slider-perv {
      display: flex;
      align-items: center;
      z-index: 999;
      padding: 15px 5px 15px 15px;
      height: 80px;
      border-right: 1px solid #e5e5e5;
      font-size: 16px;
      color: #999;
      cursor: pointer;
    }
    .slider-perv:hover i {
      color: #333;
    }
    .slider-next {
      display: flex;
      align-items: center;
      z-index: 999;
      padding: 15px 15px 15px 5px;
      height: 80px;
      border-left: 1px solid #e5e5e5;
      font-size: 16px;
      color: #999;
      cursor: pointer;
    }
    .slider-next:hover i {
      color: #333;
    }
  }
}
</style>
