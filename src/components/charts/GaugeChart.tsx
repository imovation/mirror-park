import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

interface GaugeChartProps {
  value: number
  max?: number
  name?: string
  height?: number
}

export default function GaugeChart({ value, max = 100, name = '', height = 180 }: GaugeChartProps) {
  const option: EChartsOption = {
    series: [
      {
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        center: ['50%', '55%'],
        radius: '90%',
        min: 0,
        max,
        axisLine: {
          lineStyle: {
            width: 12,
            color: [
              [0.3, '#00c853'],
              [0.7, '#4a9eff'],
              [1, '#ff6d00'],
            ],
          },
        },
        pointer: { length: '60%', width: 4, itemStyle: { color: '#4a9eff' } },
        axisTick: { distance: -12, length: 6, lineStyle: { color: '#fff', width: 1 } },
        splitLine: { distance: -18, length: 14, lineStyle: { color: '#fff', width: 2 } },
        axisLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, distance: 25 },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: '#4a9eff',
          fontSize: 16,
          offsetCenter: [0, '60%'],
        },
        title: {
          offsetCenter: [0, '85%'],
          color: 'rgba(255,255,255,0.5)',
          fontSize: 11,
        },
        data: [{ value, name }],
      },
    ],
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
