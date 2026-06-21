import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface GaugeChartProps {
  value: number
  max?: number
  name?: string
  height?: number
}

const MIN_HEIGHT = 120

export default function GaugeChart({ value, max = 100, name = '', height = 150 }: GaugeChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
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
              [0.3, t.gaugeColors[0]],
              [0.7, t.gaugeColors[1]],
              [1, t.gaugeColors[2]],
            ],
          },
        },
        pointer: { length: '60%', width: 6, itemStyle: { color: 'var(--text-primary)' } },
        axisTick: { distance: -14, length: 6, lineStyle: { color: t.gaugeAxis, width: 1 } },
        splitLine: { distance: -20, length: 16, lineStyle: { color: t.gaugeAxis, width: 2 } },
        axisLabel: { color: t.axisLabel, fontSize: f.axisFontSize, distance: 28 },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: t.label,
          fontSize: f.titleFontSize + 8,
          offsetCenter: [0, '55%'],
        },
        title: {
          offsetCenter: [0, '80%'],
          color: t.title,
          fontSize: f.legendFontSize,
        },
        data: [{ value, name }],
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}
