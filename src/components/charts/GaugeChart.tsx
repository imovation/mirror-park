import { memo, useMemo } from 'react'
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

function GaugeChart({ value, max = 100, name = '', height = 150 }: GaugeChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const option = useMemo<EChartsOption>(() => ({
    series: [
      {
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        center: ['50%', '58%'],
        radius: Math.min(height * 0.6, 95) + '%',
        min: 0,
        max,
        axisLine: {
          lineStyle: {
            width: 14,
            color: [
              [0.3, t.gaugeColors[0]],
              [0.7, t.gaugeColors[1]],
              [1, t.gaugeColors[2]],
            ],
          },
        },
        pointer: { length: '55%', width: 5, itemStyle: { color: 'var(--text-primary)' } },
        axisTick: { distance: -12, length: 5, lineStyle: { color: t.gaugeAxis, width: 1 } },
        splitLine: { distance: -18, length: 14, lineStyle: { color: t.gaugeAxis, width: 2 } },
        axisLabel: { color: t.axisLabel, fontSize: f.axisFontSize, distance: 22 },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: t.label,
          fontSize: f.titleFontSize + 4,
          offsetCenter: [0, '40%'],
          fontWeight: 'bold',
        },
        title: {
          offsetCenter: [0, '75%'],
          color: t.title,
          fontSize: f.legendFontSize,
        },
        data: [{ value, name }],
      },
    ],
  }), [value, max, name, height, t, f])

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}

export default memo(GaugeChart)
