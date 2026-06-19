import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme } from '@/config/chartTheme'

interface BarChartProps {
  data: { name: string; value: number }[]
  height?: number
  horizontal?: boolean
  color?: string
  colors?: (string | undefined)[]
  barWidth?: number | string
  gridLeft?: number | string
}

export default function BarChart({ data, height = 200, horizontal = true, color = '#4a9eff', colors, barWidth, gridLeft }: BarChartProps) {
  const t = useChartTheme()
  const option: EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: gridLeft ?? 10, right: 20, top: 5, bottom: 5, containLabel: true },
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
        data: data.map((d, i) => ({
          value: d.value,
          itemStyle: {
            color: colors?.[i] || color,
            borderRadius: horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0],
            opacity: 0.85,
          },
        })),
        barWidth: barWidth || '50%',
      },
    ],
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
