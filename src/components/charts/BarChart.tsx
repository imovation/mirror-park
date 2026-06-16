import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

interface BarChartProps {
  data: { name: string; value: number }[]
  height?: number
  horizontal?: boolean
  color?: string
}

export default function BarChart({ data, height = 200, horizontal = true, color = '#4a9eff' }: BarChartProps) {
  const option: EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 10, right: 20, top: 5, bottom: 5, containLabel: true },
    [horizontal ? 'yAxis' : 'xAxis']: {
      type: 'category',
      data: data.map((d) => d.name),
      axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    [horizontal ? 'xAxis' : 'yAxis']: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(74,158,255,0.08)' } },
      axisLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
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
