import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

interface RingChartProps {
  data: { name: string; value: number }[]
  height?: number
  colors?: string[]
  centerLabel?: string
}

const DEFAULT_COLORS = ['#4a9eff', '#ff6d00', '#00c853', '#aa00ff', '#ffc107']

export default function RingChart({ data, height = 200, colors = DEFAULT_COLORS, centerLabel }: RingChartProps) {
  const option: EChartsOption = {
    tooltip: { trigger: 'item' },
    color: colors,
    series: [
      {
        type: 'pie',
        radius: ['50%', '75%'],
        center: ['50%', '50%'],
        data,
        label: { show: false },
        emphasis: { scale: false },
      },
    ],
    graphic: centerLabel
      ? [
          {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: centerLabel,
              textAlign: 'center',
              fill: '#4a9eff',
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
        ]
      : [],
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
