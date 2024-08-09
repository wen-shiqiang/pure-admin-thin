<template>
    <div class="school-process">
        <div class="revise-title">全校修订进度</div>
        <div v-if="closingDate > 0" class="process-tip">
            <i class="mms-iconfont icontishitongzhi"></i>
            <span>据评审截止还剩{{ closingDate }}天</span>
        </div>
        <div v-loading="loading" class="train-data">
            <div class="train-echarts">
                <echarts
                    id="trainTimes"
                    type="pei-doughnut"
                    width="320px"
                    height="300px"
                    :ec-data="trainData"
                    :all-school-major="allSchoolMajor"
                    @statusChange="statusChange"
                ></echarts>
                <div class="echarts-info-box">
                    <div class="echarts-info flex-column p-r-15">
                        <div class="d-flex m-b-20">
                            <div class="info-item m-b-10 m-r-15 c-p" @click="ofShow = '未修订'">
                                <img class="m-l-12" src="@/assets/wxdMajor.png" alt="" />
                                <div class="name">
                                    <div>未修订专业数量</div>
                                    <div class="num fz-24 m-t-5">{{ unRevise }}</div>
                                </div>
                            </div>
                            <div class="info-item m-b-10 c-p" @click="ofShow = '修订中'">
                                <img class="m-l-15" src="@/assets/xdzMajor.png" alt="" />
                                <div class="name">
                                    <div>修订中专业数量</div>
                                    <div class="num fz-24 m-t-5">{{ revising }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex">
                            <div class="info-item m-b-10 m-r-15 c-p" @click="ofShow = '发布中'">
                                <img class="m-l-15" src="@/assets/fbzMajor.png" alt="" />
                                <div class="name">
                                    <div>发布中专业数量</div>
                                    <div class="num fz-24 m-t-5">{{ publishing }}</div>
                                </div>
                            </div>
                            <div class="info-item c-p" @click="ofShow = '已发布'">
                                <img class="m-l-15" src="@/assets/yfbMajor.png" alt="" />
                                <div class="name">
                                    <div>已发布专业数量</div>
                                    <div class="num fz-24 m-t-5">{{ published }}</div>
                                </div>
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
                        <div class="day">状态</div>
                    </div>
                    <div
                        v-if="(!unReviseMajor.length && ofShow === '未修订') ||
                            (!revisingMajor.length && ofShow === '修订中') ||
                            (!publishingMajor.length && ofShow === '发布中') ||
                            (!publishedMajor.length && ofShow === '已发布')"
                        class="h-300"
                    >
                        <div class="c-999 text-center p-y-20">暂无数据</div>
                    </div>
                    <div v-show="ofShow === '未修订' && unReviseMajor.length" class="ranking-list">
                        <div
                            v-for="(item, key) in unReviseMajor"
                            :key="key"
                            class="ranking-item"
                        >
                            <div class="num">
                                <span>{{ key + 1 }}</span>
                            </div>
                            <div class="name">{{ item.majorName }}</div>
                            <div v-if="item.status === 0" class="day"><i class="mms-iconfont" style="color:#F6BD16">&#xe62b;</i> 未修订</div>
                            <div v-else class="day">--</div>
                        </div>
                    </div>
                    <div v-show="ofShow === '修订中' && revisingMajor.length" class="ranking-list">
                        <div
                            v-for="(item, key) in revisingMajor"
                            :key="key"
                            class="ranking-item"
                        >
                            <div class="num">
                                <span>{{ key + 1 }}</span>
                            </div>
                            <div class="name">{{ item.majorName }}</div>
                            <div v-if="item.status === 1" class="day"><i class="mms-iconfont" style="color:#52CCA3">&#xe62b;</i> 修订中</div>
                            <div v-else class="day">--</div>
                        </div>
                    </div>
                    <div v-show="ofShow === '发布中' && publishingMajor.length" class="ranking-list">
                        <div
                            v-for="(item, key) in publishingMajor"
                            :key="key"
                            class="ranking-item"
                        >
                            <div class="num">
                                <span>{{ key + 1 }}</span>
                            </div>
                            <div class="name">{{ item.majorName }}</div>
                            <div v-if="item.status === 2" class="day"><i class="mms-iconfont" style="color:#6699FF">&#xe62b;</i>发布中</div>
                            <div v-else class="day">--</div>
                        </div>
                    </div>
                    <div v-show="ofShow === '已发布' && publishedMajor.length" class="ranking-list">
                        <div
                            v-for="(item, key) in publishedMajor"
                            :key="key"
                            class="ranking-item"
                        >
                            <div class="num">
                                <span>{{ key + 1 }}</span>
                            </div>
                            <div class="name">{{ item.majorName }}</div>
                            <div v-if="item.status === 3" class="day"><i class="mms-iconfont" style="color:#5D7092">&#xe62b;</i>已发布</div>
                            <div v-else class="day">--</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Echarts from './Echarts';
export default {
    name: 'SchoolProcess',
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
            ofShow: '未修订',
            allSchoolMajor: 0,
            auditedMajor: 0,
            onTimeRate: 30,
            closingDate: 0, // 评审截止剩余时间
            overtimeMajor: 0, // 超时专业数量
            unPublishMajor: 0, // 未发布专业数量
            unRevise: 0, // 未发布专业数量
            revising: 0, // 未发布专业数量
            publishing: 0, // 未发布专业数量
            published: 0, // 未发布专业数量
            publishedList: [],
            unPublishedList: [],
            unReviseMajor: [],
            revisingMajor: [],
            publishingMajor: [],
            publishedMajor: [],
            trainData: [],
        };
    },

    watch: {
        year: {
            handler() {
                this.loading = true;
                this.getSchoolReviseRate();
            },
            deep: true,
        },
    },

    created() {
        // 获取全校修订进度
        this.getSchoolReviseRate();
    },
    methods: {
        statusChange(status) {
            this.ofShow = status;
        },
        // 获取我的课标
        getSchoolReviseRate() {
            this.postRequest('homePage/v1/getSchoolReviseRate', {
                year: this.year,
            }).then((res) => {
                this.loading = false;
                if (res.data.status === 200) {
                    this.allSchoolMajor = res.data.result.allSchoolMajor;
                    this.closingDate = res.data.result.closingDate;
                    this.unRevise = res.data.result.unRevise;
                    this.revising = res.data.result.revising;
                    this.publishing = res.data.result.publishing;
                    this.published = res.data.result.published;
                    this.unReviseMajor = res.data.result.unReviseMajor;
                    this.revisingMajor = res.data.result.revisingMajor;
                    this.publishingMajor = res.data.result.publishingMajor;
                    this.publishedMajor = res.data.result.publishedMajor;
                    this.trainData = [
                        { name: '未修订', value: this.unRevise },
                        { name: '修订中', value: this.revising },
                        { name: '发布中', value: this.publishing },
                        { name: '已发布', value: this.published },
                    ];
                }
            });
        },
    },
};
</script>

<style lang="scss">
// 全校修订进度
.school-process {
    margin-top: 10px;
    margin-bottom: 15px;
    background: #fff;
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
                            background: #5BD171;
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
