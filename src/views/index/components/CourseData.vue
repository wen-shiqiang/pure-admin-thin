<template>
    <div v-if="courseList.length" class="course-data">
        <div class="revise-title">
            <div class="name">
                我的课标<span class="num">{{ courseAmount }}</span>
            </div>
        </div>
        <div v-loading="loading" class="course-list">
            <div
                v-for="(item, key) in courseList"
                :key="key"
                class="course-item"
            >
                <div class="item-info">
                    <div class="info-img">
                        <div class="course-icon">
                            <i class="mms-iconfont iconwodekechengbiaozhun"></i>
                        </div>
                        <el-tag
                            v-if="item.courseProperty === 0"
                            size="small"
                            class="tag"
                        >专业课</el-tag>
                        <el-tag
                            v-else-if="item.courseProperty === 1"
                            size="small"
                            class="tag"
                            type="success"
                        >校级公共课</el-tag>
                    </div>
                    <div class="info-desc">
                        <div style="width:90%" class="name ">
                            {{ item.name }}
                        </div>
                        <div class="name-extend" :title="item.majorName">{{ item.majorName }}</div>
                        <div v-if="item.roleType === 0" class="person">
                            课程负责人
                        </div>
                        <div v-else-if="item.roleType === 1" class="person">
                            课程参与人
                        </div>
                        <!-- 未发布 -->
                        <div
                            v-if="item.status === 0 || item.status === 1"
                            class="btn"
                        >
                            <el-button
                                v-if="item.roleType === 0"
                                size="mini"
                                type="primary"
                                @click="goUserCourseInfo(item)"
                            >去完成</el-button>
                            <el-button
                                v-if="item.roleType === 1"
                                size="mini"
                                type="primary"
                                @click="goUserCourseInfo(item)"
                            >查看详情</el-button>
                        </div>
                        <!-- 审核通过 -->
                        <div v-else-if="item.status === 2" class="btn">
                            <el-button
                                size="mini"
                                type="primary"
                                @click="goUserCourseInfo(item)"
                            >查看详情</el-button>
                        </div>
                        <!-- 审核驳回 -->
                        <div v-else-if="item.status === 3" class="btn">
                            <el-button
                                size="mini"
                                type="primary"
                                @click="goUserCourseInfo(item)"
                            >查看详情</el-button>
                        </div>
                    </div>
                    <!-- 审核状态 -->
                    <div v-if="item.status === 0" class="status bg-warning">
                        未修订
                    </div>
                    <div
                        v-else-if="item.status === 1"
                        class="status bg-primary"
                    >
                        修订中
                    </div>
                    <div
                        v-else-if="item.status === 2"
                        class="status bg-success"
                    >
                        发布中
                    </div>
                    <div v-else-if="item.status === 3" class="status bg-danger">
                        已发布
                    </div>
                </div>
            </div>
            <div v-if="courseList.length === 0" class="empty-tip">
                暂无数据
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CourseData',
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
            courseAmount: 0,
            courseList: [],
        };
    },

    watch: {
        year: {
            handler() {
                this.loading = true;
                this.getCourCoursesByCond();
            },
            deep: true,
        },
    },

    created() {
        // 获取我的课标
        this.getCourCoursesByCond();
    },

    methods: {
        goUserCourseInfo(item) {
            const path = item.roleType ? '/programManage/courseInfo/userPreview' : '/programManage/courseInfo/edit';
            this.$router.push({
                path: path,
                query: {
                    id: item.id,
                    courseNumber: item.number,
                    stsid: item.stsId,
                    year: item.year,
                },
            });
        },
        // 页面跳转
        goPage(path, query = {}) {
            this.$router.push({ path: path, query: query });
        },
        // 获取我的课标
        getCourCoursesByCond() {
            this.postBodyRequest('homePage/v1/getCourCoursesByCond', {
                year: this.year,
            }).then(res => {
                this.loading = false;
                if (res.data.status === 200) {
                    this.courseAmount = res.data.result.courseAmount;
                    this.courseList = res.data.result.courseList;
                }
            });
        },

        /* 处理选择下拉操作项
         * @param code: 操作代码
         * @param id: 培养方案id
         */
        handleCommand(e) {
            this.id = e.id;
            switch (e.code) {
                case 1: // 校外共享
                    break;
                case 2: // 编辑
                    break;
                case 3: // 删除
                    break;
                case 4: // 撤销
                    break;
                case 5: // 查看详情
                    break;
                default:
                    break;
            }
        },
    },
};
</script>

<style lang="scss">
// 我的课标
.course-data {
    margin-top: 10px;
    background: #fff;
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
