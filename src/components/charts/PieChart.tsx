import { memo, useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface PieChartProps {
  data: { name: string; value: number }[]
  height?: number
  colors?: string[]
  radius?: [string, string]
  legendPosition?: 'right' | 'bottom' | 'none'
  centerLabel?: string
  centerLabelSize?: number
}

const MIN_HEIGHT = 120

function PieChart({ data, height = 160, colors, radius, legendPosition = 'right' }: PieChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const r = radius || ['0', '55%']
  const pieColors = colors || t.colors.slice(0, data.length)
  const showLegend = legendPosition !== 'none'

  const legendConfig = showLegend
    ? legendPosition === 'bottom'
      ? {
          orient: 'horizontal' as const,
          bottom: 0,
          left: 'center',
          textStyle: { color: t.legendText, fontSize: f.legendFontSize },
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 6,
        }
      : {
          orient: 'vertical' as const,
          right: 5,
          top: 'center',
          textStyle: { color: t.legendText, fontSize: f.legendFontSize },
          itemWidth: 8,
          itemHeight: 8,
        }
    : undefined

  const option = useMemo<EChartsOption>(() => ({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 22, 40, 0.92)',
      borderColor: 'rgba(74,158,255,0.12)',
      borderWidth: 1,
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: (params: any) => {
        const p = params || {}
        const color = p.color || '#22d3ee'
        const name = p.name || ''
        const value = p.value ?? ''
        const pct = p.percent ?? 0
        return `<div style="display:flex;align-items:center;gap:6px;padding:2px 0">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color}"></span>
          <span style="font-weight:600">${name}</span>
          <span style="margin-left:auto;font-weight:700;font-family:monospace">${value} (${pct}%)</span>
        </div>`
      },
    },
    color: pieColors,
    legend: legendConfig,
    series: [
      {
        type: 'pie',
        radius: r,
        center: legendPosition === 'right' ? ['35%', '50%'] : ['50%', '50%'],
        data,
        avoidLabelOverlap: true,
        label: { show: false },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: t.shadowColor } },
      },
    ],
  }), [data, height, legendConfig, legendPosition, pieColors, r, t])

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}

export default memo(PieChart)
