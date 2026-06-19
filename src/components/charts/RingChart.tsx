import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface RingChartProps {
  data: { name: string; value: number }[]
  height?: number
  colors?: string[]
  centerLabel?: string
  centerLabelSize?: number
  centerLabelColor?: string
  legendPosition?: 'bottom' | 'right'
}

const MIN_HEIGHT = 120

export default function RingChart({ data, height = 160, colors, centerLabel, centerLabelSize = 14, centerLabelColor = '#4a9eff', legendPosition }: RingChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const ringColors = colors || t.colors.slice(0, data.length)
  const option: EChartsOption = {
    tooltip: { trigger: 'item' },
    color: ringColors,
    legend: legendPosition
      ? legendPosition === 'right'
        ? {
            orient: 'vertical',
            right: 0,
            top: 'center',
            textStyle: { color: t.legendText, fontSize: f.legendFontSize },
            itemWidth: 8,
            itemHeight: 8,
          }
        : {
            orient: 'horizontal',
            bottom: 0,
            left: 'center',
            textStyle: { color: t.legendText, fontSize: f.legendFontSize },
            itemWidth: 8,
            itemHeight: 8,
            itemGap: 8,
          }
      : undefined,
    series: [
      {
        type: 'pie',
        radius: legendPosition === 'right' ? ['40%', '62%'] : ['50%', '75%'],
        center: legendPosition === 'right' ? ['35%', '50%'] : ['50%', '50%'],
        data,
        label: { show: false },
        emphasis: { scale: false },
      },
    ],
    graphic: centerLabel
      ? [
          {
            type: 'text',
            left: legendPosition === 'right' ? '35%' : 'center',
            top: 'center',
            style: {
              text: centerLabel,
              align: 'center',
              fill: centerLabelColor,
              fontSize: centerLabelSize,
              fontWeight: 'bold',
            },
          },
        ]
      : [],
  }

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}
