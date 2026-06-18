import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme } from '@/config/chartTheme'

interface BarChartProps {
  data: { name: string; value: number }[]
  height?: number | string
  horizontal?: boolean
  color?: string
}

export default function BarChart({ data, height = '100%', horizontal = true, color = '#4a9eff' }: BarChartProps) {
  const t = useChartTheme()
  const option: EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 10, right: 20, top: 5, bottom: 5, containLabel: true },
    [horizontal ? 'yAxis' : 'xAxis']: {
      type: 'category',
      data: data.map((d) => d.name),
      axisLabel: { color: t.axisLabel, fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    [horizontal ? 'xAxis' : 'yAxis']: {
      type: 'value',
      splitLine: { lineStyle: { color: t.splitLine } },
      axisLabel: { color: t.axisLabel, fontSize: 10 },
    },
    series: [
      {
        type: 'bar',
        data: data.map((d) => d.value),
        itemStyle: {
          color,
          borderRadius: horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0],
          opacity: 0.85,
        },
        barWidth: '50%',
      },
    ],
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
