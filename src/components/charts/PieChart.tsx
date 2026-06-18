import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme } from '@/config/chartTheme'

interface PieChartProps {
  data: { name: string; value: number }[]
  height?: number | string
  colors?: string[]
}

const DEFAULT_COLORS = ['#4a9eff', '#00c853', '#ff6d00', '#aa00ff', '#ffc107', '#00bcd4']

export default function PieChart({ data, height = '100%', colors = DEFAULT_COLORS }: PieChartProps) {
  const t = useChartTheme()
  const option: EChartsOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    color: colors,
    series: [
      {
        type: 'pie',
        radius: ['0', '65%'],
        center: ['50%', '50%'],
        data,
        label: {
          color: t.label,
          fontSize: 10,
        },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: t.shadowColor },
        },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
