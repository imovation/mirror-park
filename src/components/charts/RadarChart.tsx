import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme } from '@/config/chartTheme'

interface RadarIndicator {
  name: string
  max: number
}

interface RadarSeries {
  name: string
  value: number[]
  color?: string
}

interface RadarChartProps {
  indicator: RadarIndicator[]
  series: RadarSeries[]
  height?: number
  title?: string
}

const SERIES_COLORS = ['#4a9eff', '#00c853', '#ff6d00', '#aa00ff', '#ffd600']

export default function RadarChart({ indicator, series, height = 260, title }: RadarChartProps) {
  const t = useChartTheme()
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params
        return `${p.seriesName}: ${p.value ?? ''}`
      },
    },
    radar: {
      indicator,
      radius: '65%',
      splitNumber: 4,
      shape: 'polygon',
      axisName: {
        color: t.label,
        fontSize: 11,
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(74,158,255,0.02)', 'rgba(74,158,255,0.05)', 'rgba(74,158,255,0.02)', 'rgba(74,158,255,0.05)'],
        },
      },
      splitLine: {
        lineStyle: { color: t.axisLine },
      },
      axisLine: {
        lineStyle: { color: t.axisLine },
      },
    },
    series: [
      {
        type: 'radar',
        data: series.map((s, i) => ({
          value: s.value,
          name: s.name,
          areaStyle: { color: s.color || SERIES_COLORS[i % SERIES_COLORS.length], opacity: 0.15 },
          lineStyle: { color: s.color || SERIES_COLORS[i % SERIES_COLORS.length], width: 2 },
          itemStyle: { color: s.color || SERIES_COLORS[i % SERIES_COLORS.length] },
        })),
        symbol: 'circle',
        symbolSize: 6,
        label: { show: false },
      },
    ],
  }

  if (title) {
    option.title = {
      text: title,
      textStyle: { color: t.title, fontSize: 12, fontWeight: 'normal' },
      left: 'center',
      top: -5,
    }
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
