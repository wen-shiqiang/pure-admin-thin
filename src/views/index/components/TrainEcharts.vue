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
                '#6699FF',
                '#52CCA3',
                '#CDF3E4',
                '#CDDDFD',
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
            var xdata = ['按时发布', '超时发布'];
            const myChart = echarts.init(document.getElementById(this.id));
            myChart.setOption({
                backgroundColor: 'rgba(255,255,255,1)',
                color: this.color,
                legend: {
                    orient: 'horizontal',
                    left: '22%',
                    bottom: '0%',
                    data: xdata,
                    itemGap: 16,
                    formatter: function(name) {
                        return `${name}`;
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function(parms) {
                        return `${parms.marker}${parms.data.name}</br>数量：${parms.data.value}</br>占比：${parms.percent}%`;
                    },
                },
                series: [{
                    type: 'pie',
                    clockwise: false, // 饼图的扇区是否是顺时针排布
                    minAngle: 2, // 最小的扇区角度（0 ~ 360）
                    radius: ['40%', '65%'],
                    center: ['50%', '50%'],
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
                            position: 'center',
                            formatter: '{text|{d}%}\n{b}',
                            rich: {
                                text: {
                                    color: '#666',
                                    fontSize: 32,
                                    align: 'center',
                                    verticalAlign: 'middle',
                                    padding: 8,
                                },
                                value: {
                                    color: '#8693F3',
                                    fontSize: 14,
                                    align: 'center',
                                    verticalAlign: 'middle',
                                },
                            },
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: 14,
                            },
                        },
                    },
                    data: this.ecData,
                }],
            });
        },

    },

};
</script>
