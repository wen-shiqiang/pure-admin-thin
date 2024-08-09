<template>
    <div class="revise-info SchoolData">
        <div class="revise">
            <div class="revise-title">全校培养方案概览</div>
            <div v-loading="loading" class="info-box">
                <div
                    class="info-box-item"
                    @click="getFlag('/user/proManage', { flag: 1 })"
                >
                    <div class="mms-iconfont iconzhuanyeliulan icon-bg bg-primary"></div>
                    <div class="item-desc">
                        <div class="item-desc-title">专业数量</div>
                        <div class="item-desc-num">
                            <span class="num">{{ majorAmount }}</span>个
                        </div>
                    </div>
                </div>
                <div
                    class="info-box-item"
                    @click="getFlag('/user/majorsManage', { flag: 1 })"
                >
                    <div class="mms-iconfont iconzhuanyequn icon-bg bg-success"></div>
                    <div class="item-desc">
                        <div class="item-desc-title">专业群数量</div>
                        <div class="item-desc-num">
                            <span class="num">{{ mjrGroupAmount }}</span>个
                        </div>
                    </div>
                </div>
                <div
                    class="info-box-item"
                    @click="getFlag('/user/proManage', { flag: 1 })"
                >
                    <div class="mms-iconfont iconzhuanyerencaipeiyangfangan icon-bg bg-warning"></div>
                    <div class="item-desc">
                        <div class="item-desc-title">培养方案数量</div>
                        <div class="item-desc-num">
                            <span class="num">{{ mjrStandardAmount }}</span>个
                        </div>
                    </div>
                </div>
                <div
                    class="info-box-item"
                    @click="getFlag('/user/couManage', { flag: 1 })"
                >
                    <div class="mms-iconfont iconwodekechengbiaozhun icon-bg bg-danger"></div>
                    <div class="item-desc">
                        <div class="item-desc-title">课程标准数量</div>
                        <div class="item-desc-num">
                            <span class="num">{{ courCourseAmount }}</span>个
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-260 bg-ban"></div>
    </div>
</template>

<script>
export default {
    name: 'SchoolData',
    components: {},
    props: {
        year: {
            type: Number,
            default: 2020,
        },
    },
    data() {
        return {
            loading: true,
            mjrGroupAmount: 0, // 专业群数目
            majorAmount: 0, // 专业数量
            courCourseAmount: 0, // 课程标准数量
            mjrStandardAmount: 0, // 培养方案数量
        };
    },

    watch: {
        year: {
            handler() {
                this.loading = true;
                this.getAllSchoolData();
            },
            deep: true,
        },
    },

    created() {
        this.getAllSchoolData();
    },

    methods: {
        // 获取专业群数目
        getAllSchoolData() {
            this.postRequest('homePage/v1/getAllSchoolData', {
                year: this.year,
            }).then(res => {
                this.loading = false;
                if (res.data.status === 200) {
                    this.mjrGroupAmount = res.data.result.mjrGroupAmount;
                    this.majorAmount = res.data.result.majorAmount;
                    this.courCourseAmount = res.data.result.courCourseAmount;
                    this.mjrStandardAmount = res.data.result.mjrStandardAmount;
                }
            });
        },
        getFlag(url) {
            let query = {
                flag: 1,
            };
            const breadcrumbStr = this.$mUtils.getseStore('breadcrumbArr');
            for (var i in breadcrumbStr) {
                if (i == url) {
                    query = {};
                }
            }
            this.goPage(url, query);
        },
        // 页面跳转
        goPage(path, query = {}) {
            this.$router.push({ path: path, query: query });
        },
    },
};
</script>

<style lang="scss">
// 全校数据概览
.revise-info {
    display: flex;
    margin-top: 10px;
    background: #fff;
    background: url('../../../assets/images/allSchoolPro.png') no-repeat;
    background-size: 100% 100%;
    .bg-ban {
        background: url('../../../assets/images/allSchoolProBan.png') no-repeat;
        background-size: 95% 90%;
        background-position: right bottom;
    }
    .revise {
        flex: 1;
    }
    &.SchoolData {
        .revise-title {
            font-size: 18px;
            font-weight: 700;
            border-bottom: none;
        }
    }

    .info-box {
        display: flex;
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
            .bg-primary {
                background: #5c8ef2;
            }
            .bg-success {
                background: #5bd171;
            }
            .bg-warning {
                background: #fa8c16;
            }
            .bg-danger {
                background: #ff6666;
            }
            .item-desc {
                margin-left: 10px;
                line-height: 24px;
                .item-desc-title {
                    color: #333;
                }
                .item-desc-num {
                    line-height: 30px;
                    color: #999;
                    .num {
                        font-size: 24px;
                        color: #333;
                    }
                }
            }
        }
    }
}
</style>
