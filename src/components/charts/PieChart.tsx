import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme } from '@/config/chartTheme'

interface PieChartProps {
  data: { name: string; value: number }[]
  height?: number
  colors?: string[]
}

const DEFAULT_COLORS = ['#4a9eff', '#00c853', '#ff6d00', '#aa00ff', '#ffc107', '#00bcd4']

export default function PieChart({ data, height = 200, colors = DEFAULT_COLORS }: PieChartProps) {
  const t = useChartTheme()
  const option: EChartsOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    color: colors,
    legend: {
      orient: 'vertical',
      right: 5,
      top: 'center',
      textStyle: { color: t.legendText, fontSize: 11 },
      itemWidth: 8,
      itemHeight: 8,
    },
    series: [
      {
        type: 'pie',
        radius: ['0', '55%'],
        center: ['35%', '50%'],
        data,
        label: {
          show: false,
        },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: t.shadowColor },
        },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
