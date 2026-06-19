import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme } from '@/config/chartTheme'

interface GaugeChartProps {
  value: number
  max?: number
  name?: string
  height?: number
}

export default function GaugeChart({ value, max = 100, name = '', height = 180 }: GaugeChartProps) {
  const t = useChartTheme()
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
            width: 16,
            color: [
              [0.3, '#52c41a'],
              [0.7, '#1890ff'],
              [1, '#faad14'],
            ],
          },
        },
        pointer: { length: '60%', width: 6, itemStyle: { color: '#fff' } },
        axisTick: { distance: -14, length: 6, lineStyle: { color: t.gaugeAxis, width: 1 } },
        splitLine: { distance: -20, length: 16, lineStyle: { color: t.gaugeAxis, width: 2 } },
        axisLabel: { color: t.axisLabel, fontSize: 10, distance: 28 },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: '#fff',
          fontSize: 20,
          offsetCenter: [0, '55%'],
        },
        title: {
          offsetCenter: [0, '80%'],
          color: t.title,
          fontSize: 11,
        },
        data: [{ value, name }],
      },
    ],
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
