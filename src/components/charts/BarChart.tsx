import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

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
}

const MIN_HEIGHT = 120

export default function BarChart({ data, height = 160, horizontal = true, color, colors, barWidth, gridLeft, gridBottom, gridTop, tooltip = true, showLabel = false, labelFormat = 'value' }: BarChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const seriesColor = color || colors?.[0] || t.colors[0]
  const total = data.reduce((a, b) => a + b.value, 0)
  const tooltipOption: EChartsOption['tooltip'] =
    tooltip === false
      ? { show: false }
      : tooltip === true
        ? { trigger: 'axis' }
        : (tooltip as EChartsOption['tooltip'])
  const option: EChartsOption = {
    tooltip: tooltipOption,
    grid: { left: gridLeft ?? 10, right: 20, top: gridTop ?? 5, bottom: gridBottom ?? 5, containLabel: true },
    [horizontal ? 'yAxis' : 'xAxis']: {
      type: 'category',
      data: data.map((d) => d.name),
      axisLabel: { color: t.axisLabel, fontSize: f.axisFontSize, verticalAlign: 'middle' },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    [horizontal ? 'xAxis' : 'yAxis']: {
      type: 'value',
      splitLine: { lineStyle: { color: t.splitLine } },
      axisLabel: { color: t.axisLabel, fontSize: f.axisFontSize },
    },
    series: [
      {
        type: 'bar',
        data: data.map((d, i) => ({
          value: d.value,
          itemStyle: {
            color: colors?.[i] || seriesColor || t.colors[i % t.colors.length],
            borderRadius: horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0],
            opacity: 0.85,
          },
        })),
        barWidth: barWidth || '50%',
        label: showLabel
          ? {
              show: true,
              position: horizontal ? 'right' : 'top',
              color: t.axisLabel,
              fontSize: f.axisFontSize,
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
  }

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}
