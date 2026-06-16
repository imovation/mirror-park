import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

interface LineChartProps {
  xData: string[]
  series: { name: string; data: number[]; color?: string }[]
  height?: number
  smooth?: boolean
  area?: boolean
}

export default function LineChart({ xData, series, height = 200, smooth = true, area = true }: LineChartProps) {
  const option: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: {
      bottom: 0,
      textStyle: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },
    },
    grid: { left: 10, right: 20, top: 5, bottom: 30, containLabel: true },
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
      axisLine: { lineStyle: { color: 'rgba(74,158,255,0.15)' } },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(74,158,255,0.08)' } },
      axisLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
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
