<script setup lang="ts">
defineOptions({
  name: "SchoolData"
});
import { watch } from "vue";
import { useApiRequests } from "../utils/request";
import { useSetState } from "vue-hooks-plus";
import { useRouter } from "vue-router";
const router = useRouter();

const { getAllSchoolDataApi } = useApiRequests();
const props = defineProps({
  year: {
    type: [String, Number],
    default: ""
  }
});
const dataList = [
  {
    icon: "iconzhuanyeliulan bg-[#5c8ef2]",
    title: "专业数量",
    num: "majorAmount",
    router: "/user/proManage"
  },
  {
    icon: "iconzhuanyequn bg-[#5bd171]",
    title: "专业群数量",
    num: "mjrGroupAmount",
    router: "/user/majorsManage"
  },
  {
    icon: "iconzhuanyerencaipeiyangfangan bg-[#fa8c16]",
    title: "培养方案数量",
    num: "mjrStandardAmount",
    router: "/user/proManage"
  },
  {
    icon: "iconwodekechengbiaozhun bg-[#ff6666]",
    title: "课程标准数量",
    num: "courCourseAmount",
    router: "/user/couManage"
  }
];
const [schoolData, setSchoolData] = useSetState<any>({});
const getAllSchoolData = async params => {
  try {
    const { result } = (await getAllSchoolDataApi(params)) || {};
    setSchoolData({ ...result });
  } catch (error) {
    console.error("getAllSchoolData error", error);
  }
};
getAllSchoolData({ year: props.year });
watch(
  () => props.year,
  newVal => {
    getAllSchoolData({ year: newVal });
  }
);
// 页面跳转
const goPage = (path, query = {}) => {
  router.push({ path, query });
};
</script>

<template>
  <div class="schoolData">
    <div class="flex-1">
      <div class="text-[18px] px-5 py-2.5 leading-7 font-bold">
        全校培养方案概览
      </div>
      <div class="info-box flex">
        <div
          v-for="(item, index) in dataList"
          :key="index"
          class="info-box-item"
          @click="goPage(item.router, { flag: 1 })"
        >
          <div :class="`mms-iconfont icon-bg ${item.icon}`" />
          <div class="leading-[24px] ml-2.5">
            <div class="text-[14px]">{{ item.title }}</div>
            <div class="leading-[30px] text-[#999]">
              <span class="text-[24px] text-[#333]">
                {{ schoolData[item.num] ?? 0 }}
              </span>
              个
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-[260px] bg-ban" />
  </div>
</template>

<style lang="scss" scoped>
.schoolData {
  display: flex;
  margin-top: 10px;
  background: #fff;
  background: url("@/assets/image/allSchoolPro.png") no-repeat;
  background-size: 100% 100%;
  color: #333;
  .bg-ban {
    background: url("@/assets/image/allSchoolProBan.png") no-repeat;
    background-size: 95% 90%;
    background-position: right bottom;
  }
  .info-box-item {
    padding: 30px 0;
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    cursor: pointer;
    .icon-bg {
      width: 42px;
      height: 42px;
      text-align: center;
      border-radius: 21px;
      font-size: 20px;
      color: #fff;
      line-height: 42px;
    }
  }
}
</style>
