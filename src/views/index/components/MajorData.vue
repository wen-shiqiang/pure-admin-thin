<template>
    <div class="major">
        <div class="revise-title">
            <div class="name">
                我的专业<span class="num">{{ majorAmount }}</span>
            </div>
            <div class="name">
                <el-button size="small" type="text" @click="goPage('/admin/manageTrainingProgram')">我的培养方案</el-button>
            </div>
        </div>
        <div v-loading="loading" class="major-list">
            <div v-for="(item, key) in majorList" :key="key" class="major-item">
                <div v-if="!item.roleType" class="name">
                    <span class="c-333">{{ item.name }}</span><el-button size="small" @click="goPage(item.standardSimpList.length ? '/admin/trainingProgram/edit' : '/admin/manageTrainingProgram',{id:item.id,year:year})">开始修订</el-button>
                </div>
                <div v-if="item.roleType" class="name">
                    <span class="c-333">{{ item.name }}</span><el-button size="small" @click="goPage(item.standardSimpList.length ? '/admin/trainingProgram/edit' : '/admin/manageTrainingProgram',{id:item.id,year:year})">查看详情</el-button>
                </div>
                <div v-if="item.standardSimpList.length > 0" class="item-list">
                    <!-- 审核通过 -->
                    <div
                        v-for="(v, k) in item.standardSimpList"
                        :key="k"
                        class="item-list-item l-h-48"
                    >
                        <div class="item-name">
                            <span>{{ v.standardName }}</span>
                            <el-tag
                                v-if="v.isDefault"
                                class="m-l-6"
                                size="small"
                            >默认</el-tag>
                        </div>
                        <!-- 状态 -->
                        <div class="item-status">
                            <div v-if="v.status === 0" class="status-info">
                                <span class="status-tip warning"></span> 未修订
                            </div>
                            <div v-else-if="v.status === 1" class="status-info">
                                <span class="status-tip primary"></span> 修订中
                            </div>
                            <div v-else-if="v.status === 2" class="status-info">
                                <span class="status-tip success"></span>
                                发布中
                            </div>
                            <div v-else-if="v.status === 3" class="status-info">
                                <span class="status-tip danger"></span> 已发布
                            </div>
                        </div>
                        <!-- 角色 -->
                        <div v-if="v.roleType === 0" class="item-person">
                            <i class="el-icon-user"></i> 专业负责人
                        </div>
                        <div v-else-if="v.roleType === 1" class="item-person">
                            <i class="el-icon-user"></i> 专业参与人
                        </div>
                    </div>
                </div>
                <div v-else class="item-list">
                    <div class="empty-tip">该专业下暂无当前年份的培养方案</div>
                </div>
            </div>
            <div v-if="majorList.length === 0" class="major-empty-tip">
                暂无数据
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MajorData',
    props: {
        year: {
            type: Number,
            default: 2020,
        },
    },
    data() {
        return {
            agreeChecked: false,
            loading: true,
            majorAmount: 0,
            majorList: [],
            MajorsByTeacherList: [],
            temYearList: [],
            choseTemplate: [],
            id: 0, // 培养方案id
        };
    },

    watch: {
        year: {
            handler() {
                this.loading = true;
                this.getMjrStandardByCond();
            },
            deep: true,
        },
    },

    created() {
        // 获取我的专业
        this.getMjrStandardByCond();
    },

    methods: {

        // 获取我的专业
        getMjrStandardByCond() {
            this.postBodyRequest('homePage/v1/getMjrStandardByCond', {
                year: this.year,
            }).then((res) => {
                this.loading = false;
                if (res.data.status === 200) {
                    this.majorAmount = res.data.result.majorAmount;
                    this.majorList = res.data.result.majorList;
                }
            });
        },
        // 页面跳转
        goPage(path, query = {}) {
            this.$router.push({ path: path, query: query });
        },
    },
};
</script>
<style lang="less">
.dropdown-btn-info {
    width: 112px;
    text-align: center;
    .el-dropdown-menu__item {
        font-size: 14px;
    }
}
// 我的专业
.major {
    margin-top: 10px;
    background: #fff;
    .major-list {
        min-height: 50px;
        .major-empty-tip {
            color: #999;
            width: 100%;
            padding: 15px 0px 5px;
            text-align: center;
        }
        .major-item {
            margin-bottom: 10px;
            .name {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                font-size: 14px;
                color: #999;
                background: fade(#5c8ef2, 10%);
            }
            .item-list {
                padding: 10px 20px 0px 42px;
                .empty-tip {
                    font-size: 14px;
                    color: #333;
                    padding-bottom: 10px;
                }
                .item-list-item {
                    display: flex;
                    align-items: center;
                    .item-name {
                        flex: 1;
                        font-size: 14px;
                        color: #333;
                    }
                    .item-status {
                        width: 120px;
                        font-size: 14px;
                        color: #999;
                        .status-info {
                            .status-tip {
                                width: 6px;
                                height: 6px;
                                border-radius: 3px;
                                display: inline-block;
                            }
                            .success {
                                background: #5BD171;
                            }
                            .warning {
                                background: #FA8C16;
                            }
                            .primary {
                                background: #5c8ef2;
                            }
                            .danger {
                                background: #ff6666;
                            }
                        }
                    }
                    .item-person {
                        width: 120px;
                        font-size: 14px;
                        color: #999;
                    }
                    .item-btn {
                        width: 120px;
                        text-align: right;
                        .item-btn-info .el-button--mini {
                            line-height: 14px !important;
                        }
                    }
                }
            }
        }
    }
    .share-title {
        font-size: 16px;
        color: #333;
        padding-bottom: 10px;
    }
    .share-content {
        height: 360px;
        overflow: hidden;
        overflow-y: auto;
        line-height: 24px;
        color: #666;
    }
    .share-checked {
        padding: 15px 0px;
    }
    .share-btn {
        text-align: right;
        .pd-30 {
            padding-left: 30px;
            padding-right: 30px;
        }
    }
}
</style>
