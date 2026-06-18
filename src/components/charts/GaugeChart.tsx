import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme } from '@/config/chartTheme'

interface GaugeChartProps {
  value: number
  max?: number
  name?: string
  height?: number | string
}

export default function GaugeChart({ value, max = 100, name = '', height = '100%' }: GaugeChartProps) {
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
            width: 12,
            color: [
              [0.3, '#00c853'],
              [0.7, '#4a9eff'],
              [1, 'var(--color-warning)'],
            ],
          },
        },
        pointer: { length: '60%', width: 4, itemStyle: { color: 'var(--accent)' } },
        axisTick: { distance: -12, length: 6, lineStyle: { color: t.gaugeAxis, width: 1 } },
        splitLine: { distance: -18, length: 14, lineStyle: { color: t.gaugeAxis, width: 2 } },
        axisLabel: { color: t.axisLabel, fontSize: 10, distance: 25 },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: 'var(--accent)',
          fontSize: 16,
          offsetCenter: [0, '60%'],
        },
        title: {
          offsetCenter: [0, '85%'],
          color: t.title,
          fontSize: 11,
        },
        data: [{ value, name }],
      },
    ],
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
