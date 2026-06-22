import { memo, useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface RingChartProps {
  data: { name: string; value: number }[]
  height?: number
  colors?: string[]
  centerLabel?: string
  centerLabelSize?: number
  centerLabelColor?: string
  legendPosition?: 'bottom' | 'right'
}

const MIN_HEIGHT = 120

function RingChart({ data, height = 160, colors, centerLabel,   centerLabelSize = 20, centerLabelColor, legendPosition }: RingChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const ringColors = colors || t.colors.slice(0, data.length)
  const labelColor = centerLabelColor || ringColors[0] || t.colors[0]
  const autoLabelSize = centerLabel && centerLabel.length > 5 ? Math.floor(centerLabelSize * 0.7) : centerLabelSize
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
    color: ringColors,
    legend: legendPosition
      ? legendPosition === 'right'
        ? {
            orient: 'vertical',
            right: 0,
            top: 'center',
            textStyle: { color: t.legendText, fontSize: f.legendFontSize },
            itemWidth: 8,
            itemHeight: 8,
          }
        : {
            orient: 'horizontal',
            bottom: 0,
            left: 'center',
            textStyle: { color: t.legendText, fontSize: f.legendFontSize },
            itemWidth: 8,
            itemHeight: 8,
            itemGap: 8,
          }
      : undefined,
    series: [
      {
        type: 'pie',
        radius: legendPosition === 'right' ? ['40%', '62%'] : ['38%', '62%'],
        center: legendPosition === 'right' ? ['35%', '50%'] : ['50%', '50%'],
        data,
        label: { show: false },
        emphasis: { scale: false },
      },
    ],
    graphic: centerLabel
      ? [
          {
            type: 'text',
            left: legendPosition === 'right' ? '35%' : 'center',
            top: 'center',
            style: {
              text: centerLabel,
              align: 'center',
              fill: labelColor,
              fontSize: autoLabelSize,
              fontWeight: 'bold',
            },
          },
        ]
      : [],
  }), [autoLabelSize, centerLabel, data, height, labelColor, legendPosition, ringColors, t, f])

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}

export default memo(RingChart)
