import { memo, useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

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

const MIN_HEIGHT = 120

function RadarChart({ indicator, series, height = 220, title }: RadarChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const option = useMemo<EChartsOption>(() => ({
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params
        return `${p.seriesName}: ${p.value ?? ''}`
      },
    },
    radar: {
      indicator,
      radius: Math.min(height * 0.35, 75) + '%',
      splitNumber: 4,
      shape: 'polygon',
      axisName: {
        color: t.label,
        fontSize: f.legendFontSize,
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
          areaStyle: { color: s.color || t.colors[i % t.colors.length], opacity: 0.15 },
          lineStyle: { color: s.color || t.colors[i % t.colors.length], width: 2 },
          itemStyle: { color: s.color || t.colors[i % t.colors.length] },
        })),
        symbol: 'circle',
        symbolSize: 6,
        label: { show: false },
      },
    ],
    ...(title ? {
      title: {
        text: title,
        textStyle: { color: t.title, fontSize: f.titleFontSize, fontWeight: 'normal' as const },
        left: 'center' as const,
        top: -5,
      },
    } : {}),
  }), [indicator, series, height, title, t, f])

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}

export default memo(RadarChart)
