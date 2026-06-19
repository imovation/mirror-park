import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface PieChartProps {
  data: { name: string; value: number }[]
  height?: number
  colors?: string[]
  radius?: [string, string]
}

const MIN_HEIGHT = 120

export default function PieChart({ data, height = 160, colors, radius }: PieChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const r = radius || ['0', '55%']
  const pieColors = colors || t.colors.slice(0, data.length)
  const option: EChartsOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    color: pieColors,
    legend: {
      orient: 'vertical',
      right: 5,
      top: 'center',
      textStyle: { color: t.legendText, fontSize: f.legendFontSize },
      itemWidth: 8,
      itemHeight: 8,
    },
    series: [
      {
        type: 'pie',
        radius: r,
        center: ['50%', '50%'],
        data,
        avoidLabelOverlap: true,
        label: { show: false },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: t.shadowColor } },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}
