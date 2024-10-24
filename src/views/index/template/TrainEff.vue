<script setup lang="ts">
import { watch, ref, onMounted } from "vue";
import { useApiRequests } from "../utils/request";
import { useSetState } from "vue-hooks-plus";
import { useECharts } from "@pureadmin/utils";
const color = ["#6699FF", "#52CCA3"];
defineOptions({
  name: "TrainEff"
});
const [mjrStandardEfficiency, setMjrStandardEfficiency] = useSetState<any>({});
const props = defineProps({
  year: {
    type: [String, Number],
    default: ""
  }
});
const trainEffChartRef = ref();
const { setOptions } = useECharts(trainEffChartRef);
watch(
  () => props.year,
  () => {
    getMjrStandardEfficiency({ year: props.year });
  }
);
const { getMjrStandardEfficiencyApi } = useApiRequests();
const getMjrStandardEfficiency = async (params: any) => {
  try {
    const { result }: any = await getMjrStandardEfficiencyApi(params);
    result.echartsData = [
      { name: "超时发布", value: result.overtimeSize },
      { name: "按时发布", value: result.onTimeSize }
    ];
    result.trainData = [
      {
        name: "按时发布数量",
        value: result.onTimeSize,
        class: "bg-success",
        rate: "份"
      },
      {
        name: "超时发布数量",
        value: result.overtimeSize,
        class: "bg-primary",
        rate: "份"
      },
      {
        name: "平均修订时长",
        value: result.averageDays,
        class: "bg-avg-day",
        rate: "天"
      },
      {
        name: "修订最短时长",
        value: result.minDays,
        class: "bg-short-day",
        rate: "天"
      }
    ];
    setMjrStandardEfficiency(result, true);
    renderEcharts(mjrStandardEfficiency.value.echartsData);
  } catch (error) {
    console.error("getSchoolReviseRate error", error);
  }
};
onMounted(() => {
  getMjrStandardEfficiency({ year: props.year });
});
const renderEcharts = data => {
  const xdata = data.map(item => item.name);
  setOptions({
    backgroundColor: "rgba(255,255,255,1)",
    color: color,
    legend: {
      orient: "horizontal",
      left: "22%",
      bottom: "0%",
      data: xdata,
      itemGap: 16,
      formatter: function (name) {
        return `${name}`;
      }
    },
    tooltip: {
      trigger: "item",
      formatter: function (parms) {
        return `${parms.marker}${parms.data.name}</br>数量：${parms.data.value}</br>占比：${parms.percent}%`;
      }
    },
    series: [
      {
        type: "pie",
        clockwise: false, // 饼图的扇区是否是顺时针排布
        minAngle: 2, // 最小的扇区角度（0 ~ 360）
        radius: ["40%", "65%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: "#ffffff",
          borderWidth: 2
        },
        label: {
          show: false,
          position: "center",
          formatter: "{text|{d}%}\n{b|{b}}",
          rich: {
            text: {
              color: "#666",
              fontSize: 32,
              align: "center",
              verticalAlign: "middle",
              padding: 8
            },
            b: {
              fontSize: 14,
              color: "inherit"
            }
          }
        },
        emphasis: {
          label: {
            show: true
          }
        },
        data: data
      }
    ]
  } as any);
};
</script>

<template>
  <div class="train-eff">
    <div class="revise-title">培养方案修订效率</div>
    <div class="train-data">
      <div class="train-echarts">
        <div ref="trainEffChartRef" class="w-[320px] h-[320px]" />
        <div class="echarts-info-box flex-1">
          <div class="echarts-info">
            <div class="grid grid-cols-2 gap-y-5 gap-x-4">
              <div
                v-for="(item, key) in mjrStandardEfficiency.trainData"
                :key="key"
                class="info-item"
              >
                <div class="name">
                  <span :class="`bg ${item.class}`" />
                  <span>{{ item.name }}</span>
                </div>
                <div class="desc">
                  <span class="num">{{ item.value }}</span>
                  <span class="rate">{{ item.rate }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 表格数据 -->
      <div class="train-ranking w-[40%] 2xl:w-[35%] xl:w-[30%] lg:w-[30%]">
        <div class="ranking-box">
          <div class="ranking-title">
            <div class="num">排名</div>
            <div class="name">专业</div>
            <div class="day">修订时长</div>
          </div>
          <div class="ranking-list">
            <el-scrollbar height="300px">
              <div
                v-for="(item, key) in mjrStandardEfficiency.majorRanking"
                :key="key"
                class="ranking-item"
              >
                <div class="num">
                  <span v-if="key < 3" class="bg">{{ key + 1 }}</span>
                  <span v-else>{{ key + 1 }}</span>
                </div>
                <div class="name">{{ item.majorName }}</div>
                <div class="day">{{ item.reviseTime }}天</div>
              </div>
              <div v-if="!mjrStandardEfficiency?.majorRanking?.length">
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
// 学院完成情况
.train-eff {
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
    .train-echarts {
      display: flex;
      flex: 1;
      align-items: center;
      .echarts-info {
        display: flex;
        align-items: center;
        justify-content: center;
        .info-item {
          line-height: 24px;
          width: 180px;
          .name {
            font-size: 14px;
            color: #333;
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
