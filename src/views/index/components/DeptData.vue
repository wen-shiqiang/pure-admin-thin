<template>
    <div class="dept-data">
        <div class="revise-title">院系数据分析</div>
        <div v-loading="loading">
            <div class="dept-list">
                <div
                    v-for="(item, key) in deptList"
                    :key="key"
                    class="dept-item"
                >
                    <div
                        class="item-info"
                        @click="
                            goPage(
                                '/admin/dept?id=' +
                                    item.id +
                                    '&major=' +
                                    item.majorAmount +
                                    '&mjrGroup=' +
                                    item.mjrGroupAmount +
                                    '&mjrStandard=' +
                                    item.mjrStandardAmount +
                                    '&courCourse=' +
                                    item.courCourseAmount +
                                    '&deptName=' +
                                    item.deptName +
                                    '&year=' +
                                    year
                            )
                        "
                    >
                        <div class="dept-name">
                            <i
                                class="mms-iconfont iconjisuanjixueyuan icon"
                            ></i>
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
                                培养方案：<span>{{
                                    item.mjrStandardAmount
                                }}</span>
                            </div>
                            <div class="desc-info">
                                课程标准：<span>{{
                                    item.courCourseAmount
                                }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="item-bg"></div>
                </div>
            </div>
            <div
                v-if="showLoadIngMore"
                v-loading="loadingMore"
                class="loading-more"
                @click="loadMoreList"
            >
                加载更多...
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DeptData',
    props: {
        year: {
            type: Number,
            default: 2020,
        },
    },
    data() {
        return {
            loading: true,
            showLoadIngMore: false,
            loadingMore: false,
            pageNum: 1,
            deptList: [],
        };
    },

    watch: {
        year: {
            handler() {
                this.pageNum = 1;
                this.deptList = [];
                this.loading = true;
                this.getAllSchoolData();
            },
            deep: true,
        },
    },

    created() {
        // 获取院系数据分析
        this.getAllSchoolData();
    },

    methods: {
        // 获取院系数据分析
        getAllSchoolData() {
            const postData = {
                year: this.year,
                pageNum: this.pageNum,
                pageSize: 8,
            };
            this.postBodyRequest('homePage/v1/getDeptInfoByCondition',
                postData).then((res) => {
                this.loading = false;
                if (res.data.status === 200) {
                    this.deptList = this.deptList.concat(res.data.result.list);
                    if (res.data.result.endRow < res.data.result.total) {
                        this.showLoadIngMore = true;
                    } else {
                        this.showLoadIngMore = false;
                    }
                    this.loadingMore = false;
                }
            });
        },

        // 加载更多
        loadMoreList() {
            ++this.pageNum;
            this.loadingMore = true;
            this.getAllSchoolData();
        },

        goPage(path) {
            this.$router.push({ path: path });
        },
    },
};
</script>

<style lang="scss">
// 院系数据分析
.dept-data {
    margin-top: 10px;
    background: #fff;
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
