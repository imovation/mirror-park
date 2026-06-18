import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme } from '@/config/chartTheme'

interface HeatmapChartProps {
  xLabels: string[]
  yLabels: string[]
  data: [number, number, number][]
  height?: number | string
}

export default function HeatmapChart({ xLabels, yLabels, data, height = '100%' }: HeatmapChartProps) {
  const t = useChartTheme()
  const option: EChartsOption = {
    tooltip: { position: 'top' },
    grid: { left: 60, right: 20, top: 5, bottom: 30 },
    xAxis: {
      type: 'category',
      data: xLabels,
      axisLabel: { color: t.axisLabel, fontSize: 10 },
      splitArea: { show: true },
    },
    yAxis: {
      type: 'category',
      data: yLabels,
      axisLabel: { color: t.axisLabel, fontSize: 10 },
      splitArea: { show: true },
    },
    visualMap: {
      min: 0,
      max: Math.max(...data.map((d) => d[2]), 10),
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: { color: ['#0a1628', '#1a3a5c', '#2a6090', '#4a9eff', '#7cb9ff'] },
    },
    series: [
      {
        type: 'heatmap',
        data,
        label: { show: false },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
