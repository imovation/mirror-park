import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme } from '@/config/chartTheme'

interface LineChartProps {
  xData: string[]
  series: { name: string; data: number[]; color?: string }[]
  height?: number
  smooth?: boolean
  area?: boolean
}

export default function LineChart({ xData, series, height = 200, smooth = true, area = true }: LineChartProps) {
  const t = useChartTheme()
  const option: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: {
      bottom: 0,
      textStyle: { color: t.legendText, fontSize: 11 },
      itemWidth: 14,
      itemHeight: 8,
    },
    grid: { left: 10, right: '6%', top: 5, bottom: 32, containLabel: true },
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: { color: t.axisLabel, fontSize: 10, rotate: 30, interval: 'auto' },
      axisLine: { lineStyle: { color: t.axisLine } },
    },
    yAxis: {
      type: 'value',
      scale: true,
      splitLine: { lineStyle: { color: t.splitLine } },
      axisLabel: { color: t.axisLabel, fontSize: 10 },
    },
    series: series.map((s) => ({
      name: s.name,
      type: 'line',
      data: s.data,
      smooth,
      areaStyle: area ? { color: (s.color || '#4a9eff') + '20' } : undefined,
      lineStyle: { color: s.color || '#4a9eff', width: 2 },
      itemStyle: { color: s.color || '#4a9eff' },
    })),
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
