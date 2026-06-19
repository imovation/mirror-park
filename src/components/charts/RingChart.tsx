import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme } from '@/config/chartTheme'

interface RingChartProps {
  data: { name: string; value: number }[]
  height?: number
  colors?: string[]
  centerLabel?: string
  centerLabelSize?: number
  centerLabelColor?: string
  legendPosition?: 'bottom' | 'right'
}

const DEFAULT_COLORS = ['#4a9eff', '#ff6d00', '#00c853', '#aa00ff', '#ffc107']

export default function RingChart({ data, height = 200, colors = DEFAULT_COLORS, centerLabel, centerLabelSize = 14, centerLabelColor = '#4a9eff', legendPosition }: RingChartProps) {
  const t = useChartTheme()
  const option: EChartsOption = {
    tooltip: { trigger: 'item' },
    color: colors,
    legend: legendPosition
      ? {
          [legendPosition === 'right' ? 'orient' : 'bottom']: legendPosition === 'right' ? 'vertical' : undefined,
          [legendPosition === 'right' ? 'right' : 'bottom']: 0,
          textStyle: { color: t.legendText, fontSize: 10 },
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

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
