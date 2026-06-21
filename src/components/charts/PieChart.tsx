import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface PieChartProps {
  data: { name: string; value: number }[]
  height?: number
  colors?: string[]
  radius?: [string, string]
  legendPosition?: 'right' | 'bottom' | 'none'
  centerLabel?: string
  centerLabelSize?: number
}

const MIN_HEIGHT = 120

export default function PieChart({ data, height = 160, colors, radius, legendPosition = 'right' }: PieChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const r = radius || ['0', '55%']
  const pieColors = colors || t.colors.slice(0, data.length)
  const showLegend = legendPosition !== 'none'

  const legendConfig = showLegend
    ? legendPosition === 'bottom'
      ? {
          orient: 'horizontal' as const,
          bottom: 0,
          left: 'center',
          textStyle: { color: t.legendText, fontSize: f.legendFontSize },
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 6,
        }
      : {
          orient: 'vertical' as const,
          right: 5,
          top: 'center',
          textStyle: { color: t.legendText, fontSize: f.legendFontSize },
          itemWidth: 8,
          itemHeight: 8,
        }
    : undefined

  const option: EChartsOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    color: pieColors,
    legend: legendConfig,
    series: [
      {
        type: 'pie',
        radius: r,
        center: legendPosition === 'right' ? ['35%', '50%'] : ['50%', '50%'],
        data,
        avoidLabelOverlap: true,
        label: { show: false },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: t.shadowColor } },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}
