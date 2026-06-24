import { memo, useMemo } from 'react'
import EChartsReactCore from 'echarts-for-react/lib/core'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'
import echarts from '@/config/echartsSetup'

interface BarChartProps {
  data: { name: string; value: number }[]
  height?: number
  horizontal?: boolean
  color?: string
  colors?: (string | undefined)[]
  barWidth?: number | string
  gridLeft?: number | string
  gridBottom?: number | string
  gridTop?: number | string
  tooltip?: boolean | object
  showLabel?: boolean
  labelFormat?: 'value' | 'percent'
  hideAxis?: boolean
  width?: number
}

const MIN_HEIGHT = 80

function BarChart({ data, height = 160, horizontal = true, color, colors, barWidth, gridLeft, gridBottom, gridTop, tooltip = true, showLabel = false, labelFormat = 'value', hideAxis = false, width }: BarChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes(width)
  const seriesColor = color
  const total = data.reduce((a, b) => a + b.value, 0)
  const isCompact = height < 140
  const shouldRotateLabel = !!(width && width < 300 && data.length > 6)
  const adjustedBarWidth = barWidth || (isCompact ? '35%' : (height < 150 && data.length > 6 ? '40%' : '50%'))
  const tooltipOption: EChartsOption['tooltip'] =
    tooltip === false
      ? { show: false }
      : tooltip === true
        ? {
            trigger: 'axis',
            backgroundColor: 'rgba(10, 22, 40, 0.92)',
            borderColor: 'rgba(74,158,255,0.12)',
            borderWidth: 1,
            textStyle: { color: '#fff', fontSize: 12 },
            formatter: (params: any) => {
              const p = Array.isArray(params) ? params[0] : params
              if (!p) return ''
              const color = p.color || '#22d3ee'
              const name = p.name || ''
              const value = p.value ?? ''
              return `<div style="display:flex;align-items:center;gap:6px;padding:2px 0">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color}"></span>
          <span style="font-weight:600">${name}</span>
          <span style="margin-left:auto;font-weight:700;font-family:monospace">${value}</span>
        </div>`
            },
          }
        : (tooltip as EChartsOption['tooltip'])
  const option = useMemo<EChartsOption>(() => ({
    tooltip: tooltipOption,
    grid: { left: gridLeft ?? 10, right: 20, top: gridTop ?? 5, bottom: gridBottom ?? (shouldRotateLabel ? 30 : 5), containLabel: true },
    [horizontal ? 'yAxis' : 'xAxis']: {
      type: 'category',
      data: data.map((d) => d.name),
      axisLabel: { color: t.axisLabel, fontSize: f.axisFontSize, verticalAlign: 'middle', ...(shouldRotateLabel && !horizontal ? { rotate: 45 } : {}) },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    [horizontal ? 'xAxis' : 'yAxis']: {
      type: 'value',
      splitLine: { lineStyle: { color: t.splitLine } },
      axisLabel: hideAxis ? { show: false } : { color: t.axisLabel, fontSize: f.axisFontSize },
    },
    series: [
      {
        type: 'bar',
        data: data.map((d, i) => ({
          value: d.value,
          itemStyle: {
            color: colors?.[i] ?? seriesColor ?? t.colors[i % t.colors.length],
            borderRadius: horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0],
            opacity: 0.85,
          },
        })),
        barWidth: adjustedBarWidth,
        label: showLabel
          ? {
              show: true,
              position: horizontal ? 'right' : 'top',
              color: t.axisLabel,
              fontSize: height < 150 ? Math.min(f.axisFontSize, 10) : f.axisFontSize,
              formatter: (params: { dataIndex: number; value: unknown }) => {
                const v = Number(params.value ?? 0)
                if (labelFormat === 'percent') {
                  const pct = total > 0 ? Math.round((v / total) * 100) : 0
                  return `${pct}%`
                }
                return String(v)
              },
            }
          : undefined,
      },
    ],
  }), [adjustedBarWidth, data, gridBottom, gridLeft, gridTop, height, hideAxis, horizontal, labelFormat, shouldRotateLabel, showLabel, tooltipOption, t, f])

  return <EChartsReactCore echarts={echarts} option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}

export default memo(BarChart)
