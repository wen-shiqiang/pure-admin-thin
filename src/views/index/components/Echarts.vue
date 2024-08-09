<template>
    <div>
        <div :id="id" :style="{width: width, height: height}"></div>
    </div>
</template>

<script>
export default {
    name: 'Echarts',
    props: {
        id: {
            type: String,
            default: '',
        },
        colorNumber: {
            type: Number,
            default: 0,
        },
        allSchoolMajor: {
            type: Number,
            default: 0,
        },
        type: {
            type: String,
            default: '',
        },
        width: {
            type: String,
            default: '',
        },
        height: {
            type: String,
            default: '',
        },
        toolPos: {
            type: Object,
            default: () => {},
        },
        // 必传项 参数 name:名称-required,value:值-required,rate:百分比,umit:单位
        ecData: {
            type: Array,
            default: () => {},
        },
    },

    data() {
        return {
            color: [
                '#F6BD16',
                '#52CCA3',
                '#6699FF',
                '#5D7092',
                '#5D7092',
                '#CED4DE',
                '#F6BD16',
                '#FCEBB9',
                '#E86452',
                '#F8D0CB',
                '#6DC8EC',
                '#D3EEF9',
                '#945FB9',
                '#DECFEA',
            ],
        };
    },

    watch: {
        ecData: {
            handler() {
                if (this.type == 'pei-doughnut') { this.drawPieDoughnut() }
            },
            deep: true,
        },
    },

    mounted() {
        if (this.type == 'pei-doughnut') { this.drawPieDoughnut() }
    },

    methods: {
        // 画饼状图单环-不带配置
        drawPieDoughnut() {
            const myChart = echarts.init(document.getElementById(this.id));
            let flag = 1;
            myChart.on('legendselectchanged', (params) => {
                if (flag === 1) {
                    this.$emit('statusChange', params.name);
                }
                setTimeout(() => {
                    flag = 1;
                }, 1000);
            });
            myChart.on('click', (param) => {
                if (flag === 1) {
                    this.$emit('statusChange', param.name);
                }
                setTimeout(() => {
                    flag = 1;
                }, 1000);
            });
            myChart.setOption({

                title: [
                    {

                        subtext: '全部专业',
                        text: this.allSchoolMajor,
                        textStyle: {
                            fontSize: 32,
                            color: '#000',
                        },
                        subtextStyle: {
                            fontSize: 14,
                            color: '#909090',
                        },
                        textAlign: 'center',
                        x: '48.5%',
                        y: '27%',
                    }],
                tooltip: {
                    trigger: 'item',
                    formatter: function(parms) {
                        return `${parms.marker}${parms.data.name}</br>数量：${parms.data.value}</br>占比：${parms.percent}%`;
                    },
                },
                legend: {
                    orient: 'horizontal',
                    left: '3%',
                    bottom: '10%',
                    align: 'left',
                    textStyle: {
                        color: '#8C8C8C',
                    },
                    height: 250,
                },
                color: this.color,
                series: [
                    {
                        name: '标题',
                        type: 'pie',
                        center: ['50%', '35%'],
                        radius: ['40%', '65%'],
                        clockwise: false, // 饼图的扇区是否是顺时针排布
                        avoidLabelOverlap: false,
                        itemStyle: { // 图形样式
                            normal: {
                                borderColor: '#ffffff',
                                borderWidth: 2,
                            },
                        },
                        label: {
                            normal: {
                                show: false,
                                position: 'outter',
                                formatter: function(parms) {
                                    return parms.data.legendname;
                                },
                            },
                        },
                        data: this.ecData,
                    },
                ],
            });
        },

    },

};
</script>
