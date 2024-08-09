<template>
    <div class="dept-process">
        <div class="revise-title">学院发布情况</div>
        <div v-loading="loading" class="dept-list">
            <div ref="processList" class="dept-box">
                <div
                    v-for="(item, key) in processList"
                    :key="key"
                    class="dept-item"
                    :style="'transform:translateX(' + transX + 'px);'"
                >
                    <el-progress
                        type="circle"
                        :width="60"
                        :stroke-width="8"
                        :percentage="item.completeRate"
                        :show-text="false"
                        color="#5c8ef2"
                        stroke-linecap="square"
                    ></el-progress>
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

<script>

export default {
    name: 'DeptProcess',
    components: {

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
            transX: 0, // 滑动距离
            sliderIndex: 0, // 当前索引
            sliderLength: 0, // 可以滑动的滑块数目 = 滑块总数 - 当前滑块显示数目
            processList: [],
        };
    },

    watch: {
        year: {
            handler() {
                this.loading = true;
                this.getDeptCompleteRate();
            },
            deep: true,
        },
    },

    created() {
        // 获取学院完成情况
        this.getDeptCompleteRate();
    },

    methods: {
        // 获取学院完成情况
        getDeptCompleteRate() {
            this.postRequest('homePage/v1/getDeptCompleteRate', { year: this.year }).then(res => {
                this.loading = false;
                if (res.data.status === 200) {
                    this.processList = res.data.result;
                    this.$nextTick(() => {
                        if (this.processList.length * 220 > this.$refs.processList.offsetWidth) {
                            const showNum = parseInt(this.$refs.processList.offsetWidth / 220);
                            const leftNum = this.processList.length - showNum;
                            this.sliderLength = leftNum;
                        }
                    });
                }
            });
        },

        // 滑动前进后退操作
        sliderPrev() {
            if (this.sliderIndex === 0) {
                return;
            } else {
                --this.sliderIndex;
                this.transX += 220;
            }
        },
        sliderNext() {
            if (this.sliderIndex === this.sliderLength) {
                return;
            } else {
                ++this.sliderIndex;
                this.transX -= 220;
            }
        },
    },
};
</script>

<style lang="scss">
// 学院完成情况
.dept-process {
    margin-top: 10px;
    background: #fff;
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
        .slider-perv:hover i{
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
