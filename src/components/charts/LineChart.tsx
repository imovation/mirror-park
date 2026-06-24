import { memo, useMemo } from 'react'
import EChartsReactCore from 'echarts-for-react/lib/core'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'
import echarts from '@/config/echartsSetup'

interface LineChartProps {
  xData: string[]
  series: { name: string; data: number[]; color?: string; dashed?: boolean }[]
  height?: number
  smooth?: boolean
  area?: boolean
  markLine?: number
  yAxisMin?: number
  yAxisMax?: number
}

const MIN_HEIGHT = 80

function resolveColor(color?: string): string | undefined {
  if (!color || !color.startsWith('var(')) return color
  const m = color.match(/var\(--([^)]+)\)/)
  if (!m) return color
  return getComputedStyle(document.documentElement).getPropertyValue(`--${m[1]}`).trim() || color
}

function LineChart({ xData, series, height = 160, smooth = false, area = false, markLine, yAxisMin, yAxisMax }: LineChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const isCompact = height < 100
  const allValues = series.flatMap((s) => s.data).filter((v) => typeof v === 'number')
  const dataMin = allValues.length ? Math.min(...allValues) : 0
  const dataMax = allValues.length ? Math.max(...allValues) : 100
  const dataRange = dataMax - dataMin
  const autoMin = yAxisMin ?? (dataRange > 0 && dataRange < 20 ? Math.max(0, dataMin - 5) : undefined)
  const autoMax = yAxisMax ?? (dataRange > 0 && dataRange < 20 ? Math.min(100, dataMax + 5) : undefined)
  const option = useMemo<EChartsOption>(() => ({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 22, 40, 0.92)',
      borderColor: 'rgba(74,158,255,0.12)',
      borderWidth: 1,
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: (params: any) => {
        if (!Array.isArray(params)) return ''
        return params.map((p: any) => `
          <div style="display:flex;align-items:center;gap:6px;padding:1px 0">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color || '#22d3ee'}"></span>
            <span style="font-weight:600">${p.seriesName}</span>
            <span style="margin-left:auto;font-weight:700;font-family:monospace">${p.value}</span>
          </div>
        `).join('') + `<div style="border-top:1px solid rgba(255,255,255,0.08);margin-top:4px;padding-top:4px;font-size:11px;color:rgba(255,255,255,0.5)">${params[0]?.axisValue || ''}</div>`
      },
    },
    legend: {
      data: series.map((s, i) => ({
        name: s.name,
        itemStyle: { color: resolveColor(s.color) || t.colors[i % t.colors.length] },
      })),
      bottom: 0,
      textStyle: { color: t.legendText, fontSize: f.legendFontSize },
    },
    grid: isCompact
      ? { left: 10, right: 8, top: 18, bottom: 24, containLabel: true }
      : { left: 10, right: '6%', top: 5, bottom: 32, containLabel: true },
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: isCompact
        ? { show: false }
        : { color: t.axisLabel, fontSize: f.axisFontSize, rotate: 30 },
      axisLine: { lineStyle: { color: t.axisLine } },
      axisTick: isCompact ? { show: false } : undefined,
    },
    yAxis: {
      type: 'value',
      min: autoMin,
      max: autoMax,
      splitLine: { lineStyle: { color: t.splitLine } },
      axisLabel: isCompact
        ? { color: t.axisLabel, fontSize: Math.max(8, f.axisFontSize - 2) }
        : { color: t.axisLabel, fontSize: f.axisFontSize },
    },
    series: series.map((s, i) => {
      const c = resolveColor(s.color) || t.colors[i % t.colors.length]
      return {
      type: 'line',
      name: s.name,
      data: s.data,
      smooth,
      symbol: isCompact ? 'none' : 'circle',
      symbolSize: isCompact ? 0 : 6,
      lineStyle: { color: c, width: isCompact ? 1.5 : 2, type: s.dashed ? 'dashed' : 'solid' },
      areaStyle: area
        ? (() => {
            const base = c || t.colors[i % t.colors.length] || '#22d3ee'
            if (base.startsWith('var(')) return { color: base, opacity: 0.15 }
            return { color: base + '30' }
          })()
        : undefined,
      itemStyle: { color: c },
      markLine: markLine ? {
        silent: true,
        symbol: 'none',
        lineStyle: { color: resolveColor('var(--color-warning)') || '#ff6d00', type: 'dashed', width: 1, opacity: 0.6 },
        data: [{ yAxis: markLine, label: { show: false } }],
      } : undefined,
    }}),
  }), [area, autoMax, autoMin, height, isCompact, markLine, series, smooth, xData, t, f])

  return <EChartsReactCore echarts={echarts} option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}

export default memo(LineChart)
