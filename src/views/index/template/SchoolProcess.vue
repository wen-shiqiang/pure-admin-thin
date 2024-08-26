<script setup lang="ts">
import { watch, ref, onMounted } from "vue";
import { useApiRequests } from "../utils/request";
import { useSetState } from "vue-hooks-plus";
import { useECharts } from "@pureadmin/utils";
import { wxdMajor, xdzMajor, fbzMajor, yfbMajor } from "../utils/static";

defineOptions({
  name: "SchoolProcess"
});
const [schoolReviseRate, setSchoolReviseRate] = useSetState<any>({});
const { getSchoolReviseRateApi } = useApiRequests();
const ofShow = ref("未修订");
const chartRef = ref();
const { setOptions } = useECharts(chartRef);
const color = [
  "#F6BD16",
  "#52CCA3",
  "#6699FF",
  "#5D7092",
  "#5D7092",
  "#CED4DE",
  "#F6BD16",
  "#FCEBB9",
  "#E86452",
  "#F8D0CB",
  "#6DC8EC",
  "#D3EEF9",
  "#945FB9",
  "#DECFEA"
];
const props = defineProps({
  year: {
    type: [String, Number],
    default: ""
  }
});
watch(
  () => props.year,
  () => {
    getSchoolReviseRate({ year: props.year });
  }
);
const getSchoolReviseRate = async (params: any) => {
  try {
    const { result }: any = await getSchoolReviseRateApi(params);
    result.trainData = [
      {
        name: "未修订",
        value: result.unRevise,
        img: wxdMajor,
        data: result.unReviseMajor,
        class: "text-[#f6bd16]",
        status: 0
      },
      {
        name: "修订中",
        value: result.revising,
        img: xdzMajor,
        data: result.revisingMajor,
        class: "text-[#52cca3]",
        status: 1
      },
      {
        name: "发布中",
        value: result.publishing,
        img: fbzMajor,
        data: result.publishingMajor,
        class: "text-[#6699ff]",
        status: 2
      },
      {
        name: "已发布",
        value: result.published,
        img: yfbMajor,
        data: result.publishedMajor,
        class: "text-[#5d7092]",
        status: 3
      }
    ];
    setSchoolReviseRate(result, true);
    renderEcharts(schoolReviseRate.value);
  } catch (error) {
    console.error("getSchoolReviseRate error", error);
  }
};
onMounted(() => {
  getSchoolReviseRate({ year: props.year });
});

const renderEcharts = list => {
  setOptions(
    {
      title: [
        {
          subtext: "全部专业",
          text: list.allSchoolMajor,
          textStyle: {
            fontSize: 32,
            color: "#000"
          },
          subtextStyle: {
            fontSize: 14,
            color: "#909090"
          },
          textAlign: "center",
          x: "48.5%",
          y: "27%"
        }
      ],
      tooltip: {
        trigger: "item",
        formatter: function (parms) {
          return `${parms.marker}${parms.data.name}</br>数量：${parms.data.value}</br>占比：${parms.percent}%`;
        }
      },
      legend: {
        orient: "horizontal",
        left: "3%",
        bottom: "10%",
        align: "left",
        textStyle: {
          color: "#8C8C8C"
        },
        height: 250
      },
      color: color,
      series: [
        {
          name: "标题",
          type: "pie",
          center: ["50%", "35%"],
          radius: ["40%", "65%"],
          clockwise: false, // 饼图的扇区是否是顺时针排布
          avoidLabelOverlap: false,
          itemStyle: {
            // 图形样式
            borderColor: "#ffffff",
            borderWidth: 2
          },
          label: {
            show: false,
            position: "outter",
            formatter: function (parms) {
              return parms.data.legendname;
            }
          },
          data: list.trainData
        }
      ]
    } as any,
    {
      name: "click",
      callback: ({ name }) => {
        ofShow.value = name;
      }
    },
    {
      name: "legendselectchanged",
      callback: ({ name }) => {
        ofShow.value = name;
      }
    }
  );
};
</script>

<template>
  <div class="school-process">
    <div class="revise-title">全校修订进度</div>
    <div v-if="schoolReviseRate.closingDate > 0" class="process-tip">
      <i class="mms-iconfont icontishitongzhi" />
      <span>据评审截止还剩{{ schoolReviseRate.closingDate }}天</span>
    </div>
    <div class="train-data">
      <div class="train-echarts">
        <div ref="chartRef" class="w-[320px] h-[320px]" />
        <div class="echarts-info-box">
          <div class="echarts-info flex-col">
            <div class="grid grid-cols-2 gap-y-5 gap-x-4">
              <div
                v-for="(item, index) in schoolReviseRate.trainData"
                :key="index"
                class="info-item c-p"
                @click="ofShow = item.name"
              >
                <img class="ml-3" :src="item.img" alt="" />
                <div class="name">
                  <div>{{ item.name }}专业数量</div>
                  <div class="num text-[24px] mt-1.5">
                    {{ item.value }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="train-ranking w-[40%] 2xl:w-[35%] xl:w-[30%] lg:w-[30%]">
        <div class="ranking-box">
          <div class="ranking-title">
            <div class="num">排名</div>
            <div class="name">专业</div>
            <div class="day">状态</div>
          </div>
          <div
            v-for="(item, key) in schoolReviseRate.trainData"
            v-show="ofShow === item.name"
            :key="key"
            class="ranking-list"
          >
            <el-scrollbar height="300px">
              <div
                v-for="(item1, key1) in item?.data"
                :key="key1"
                class="ranking-item"
              >
                <div class="num">
                  <span>{{ key1 + 1 }}</span>
                </div>
                <div class="name">{{ item1.majorName }}</div>
                <div v-if="item1.status === item.status" class="day">
                  <i :class="`mms-iconfont ${item.class}`">&#xe62b;</i>
                  {{ item.name }}
                </div>
                <div v-else class="day">--</div>
              </div>
              <div v-if="!item?.data?.length">
                <div class="text-[#999] text-center text-[14px] py-5">
                  暂无数据
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 全校修订进度
.school-process {
  margin-top: 10px;
  margin-bottom: 15px;
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
  .train-data {
    display: flex;
    padding: 0px 15px 15px;
    .echarts-info-box {
      flex: 1;
    }
    .train-echarts {
      display: flex;
      flex: 1;
      align-items: center;
      .echarts-info {
        display: flex;
        align-items: center;
        justify-content: center;
        .info-item {
          width: 180px;
          height: 60px;
          background: #f7faff;
          display: flex;
          align-items: center;
          .name {
            font-size: 14px;
            color: #333;
            padding-left: 15px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .bg {
              display: inline-block;
              margin-right: 5px;
              width: 6px;
              height: 6px;
              border-radius: 3px;
            }
            .bg-success {
              background: #5bd171;
            }
            .bg-primary {
              background: #5c8ef2;
            }
            .bg-danger {
              background: #ff6666;
            }
            .bg-avg-day {
              background: #7d8fb3;
            }
            .bg-short-day {
              background: #bdc8de;
            }
          }
          .desc {
            margin-left: 14px;
            .num {
              color: #333;
              font-size: 18px;
            }
            .rate {
              color: #999;
              font-size: 12px;
            }
          }
        }
      }
    }
    .train-ranking {
      border-left: 1px solid #f5f5f5;
      .ranking-title {
        display: flex;
        padding: 15px;
        background: #f5f5f5;
        font-size: 14px;
        color: #333;
        .name {
          flex: 1;
        }
        .num {
          width: 100px;
        }
        .day {
          width: 100px;
          text-align: right;
        }
      }
      .ranking-list {
        .ranking-item {
          display: flex;
          padding: 10px 15px;
          font-size: 14px;
          color: #666;
          line-height: 20px;
          .name {
            flex: 1;
          }
          .num {
            width: 100px;
            span {
              display: flex;
              justify-content: center;
              width: 20px;
              height: 20px;
              border-radius: 10px;
              font-size: 12px;
              color: #fff;
              background: #ccc;
            }
            .bg {
              color: #fff;
              background: #314659;
            }
          }
          .day {
            width: 100px;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
