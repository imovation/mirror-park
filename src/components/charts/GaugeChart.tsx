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

const MIN_HEIGHT = 150

function GaugeChart({ value, max = 100, name = '', height = 150 }: GaugeChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const renderHeight = Math.max(height, MIN_HEIGHT)
  const option = useMemo<EChartsOption>(() => ({
    series: [
      {
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        center: ['50%', '50%'],
        radius: '75%',
        min: 0,
        max,
        axisLine: {
          lineStyle: {
            width: 12,
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
        axisLabel: {
          color: t.axisLabel,
          fontSize: f.axisFontSize,
          distance: 18,
          interval: 0,
          formatter: (v: number) => (v % 20 === 0 ? String(v) : ''),
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: t.label,
          fontSize: f.titleFontSize + 2,
          offsetCenter: [0, '25%'],
          fontWeight: 'bold',
        },
        title: {
          offsetCenter: [0, '70%'],
          color: t.title,
          fontSize: f.legendFontSize,
        },
        data: [{ value, name }],
      },
    ],
  }), [value, max, name, t, f])

  return <ReactECharts option={option} style={{ height: renderHeight, width: '100%' }} notMerge />
}

export default memo(GaugeChart)
