<template>
    <div class="train-eff">
        <div class="revise-title">培养方案修订效率</div>
        <div v-loading="loading" class="train-data">
            <div class="train-echarts">
                <echarts
                    id="trainTime"
                    type="pei-doughnut"
                    width="320px"
                    height="300px"
                    :ec-data="trainData"
                ></echarts>
                <div class="echarts-info-box flex-1">
                    <div class="echarts-info p-r-15 d-flex m-b-20">
                        <div class="info-item m-b-10 m-r-15">
                            <div class="name">
                                <span class="bg bg-success"></span>
                                <span>按时发布数量</span>
                            </div>
                            <div class="desc">
                                <span class="num">{{ onTimeSize }}</span>
                                <span class="rate">份</span>
                            </div>
                        </div>
                        <div class="info-item m-b-10 m-r-15">
                            <div class="name">
                                <span class="bg bg-primary"></span>
                                <span>超时发布数量</span>
                            </div>
                            <div class="desc">
                                <span class="num">{{ overtimeSize }}</span>
                                <span class="rate">份</span>
                            </div>
                        </div>
                    </div>
                    <div class="echarts-info p-r-15 d-flex m-b-20">
                        <div class="info-item m-b-10 m-r-15">
                            <div class="name">
                                <span class="bg bg-avg-day"></span>
                                <span>平均修订时长</span>
                            </div>
                            <div class="desc">
                                <span class="num">{{ averageDays }}</span>
                                <span class="rate">天</span>
                            </div>
                        </div>
                        <div class="info-item m-b-10 m-r-15">
                            <div class="name">
                                <span class="bg bg-short-day"></span>
                                <span>修订最短时长</span>
                            </div>
                            <div class="desc">
                                <span class="num">{{ minDays }}</span>
                                <span class="rate">天</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 表格数据 -->
            <div class="train-ranking">
                <div class="ranking-box">
                    <div class="ranking-title">
                        <div class="num">排名</div>
                        <div class="name">专业</div>
                        <div class="day">修订时长</div>
                    </div>
                    <div class="ranking-list">
                        <div v-for="(item, key) in majorRanking" :key="key" class="ranking-item">
                            <div class="num">
                                <span v-if="key < 3" class="bg">{{ key + 1 }}</span>
                                <span v-else>{{ key + 1 }}</span>
                            </div>
                            <div class="name">{{ item.majorName }}</div>
                            <div class="day">{{ item.reviseTime }}天</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Echarts from './TrainEcharts';

export default {
    name: 'TrainEff',
    components: {
        Echarts: Echarts,
    },
    props: {
        year: {
            type: Number,
            default: 2020,
        },
    },
    data() {
        return {
            loading: true,
            onTimeSize: 0, // 按时发布
            averageDays: 0, // 平均修订时长
            overtimeSize: 0, // 超时发布
            onTimeRate: 0, // 按时发布占比
            minDays: 0, // 修订最短时长
            majorRanking: [], // 专业排名
            trainData: [], // echarts图数据
        };
    },

    watch: {
        year: {
            handler() {
                this.loading = true;
                this.getMjrStandardEfficiency();
            },
            deep: true,
        },
    },

    created() {
        // 获取我的课标
        this.getMjrStandardEfficiency();
    },

    methods: {
        // 获取培养方案修订效率
        getMjrStandardEfficiency() {
            this.postRequest('homePage/v1/getMjrStandardEfficiency', { year: this.year }).then(res => {
                this.loading = false;
                if (res.data.status === 200) {
                    this.processList = res.data.result;
                    this.onTimeSize = res.data.result.onTimeSize;
                    this.overtimeSize = res.data.result.overtimeSize;
                    this.averageDays = res.data.result.averageDays;
                    this.minDays = res.data.result.minDays;
                    this.trainData = [
                        { name: '超时发布', value: this.overtimeSize },
                        { name: '按时发布', value: this.onTimeSize },
                    ];
                    this.majorRanking = res.data.result.majorRanking;
                }
            });
        },

    },
};
</script>

<style lang="scss">
// 学院完成情况
.train-eff {
    margin-top: 10px;
    margin-bottom: 15px;
    background: #fff;
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
                margin-bottom: 30px;
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
                            background: #5BD171;
                        }
                        .bg-primary {
                            background: #5c8ef2;
                        }
                        .bg-danger {
                            background: #ff6666;
                        }
                        .bg-avg-day {
                            background: #7D8FB3;
                        }
                        .bg-short-day {
                            background: #BDC8DE;
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
            width: 40%;
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
                height: 300px;
                overflow: hidden;
                overflow-y: auto;
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
