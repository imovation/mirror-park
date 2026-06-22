import { memo, useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

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

function LineChart({ xData, series, height = 160, smooth = false, area = false, markLine, yAxisMin, yAxisMax }: LineChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const isCompact = height < 100
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
      data: series.map((s) => s.name),
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
      min: yAxisMin,
      max: yAxisMax,
      splitLine: { lineStyle: { color: t.splitLine } },
      axisLabel: { color: t.axisLabel, fontSize: f.axisFontSize },
    },
    series: series.map((s, i) => ({
      type: 'line',
      name: s.name,
      data: s.data,
      smooth,
      symbol: isCompact ? 'none' : 'circle',
      symbolSize: isCompact ? 0 : 6,
      lineStyle: { color: s.color || t.colors[i % t.colors.length], width: isCompact ? 1.5 : 2, type: s.dashed ? 'dashed' : 'solid' },
      areaStyle: area
        ? (() => {
            const base = s.color || t.colors[i % t.colors.length] || '#22d3ee'
            if (base.startsWith('var(')) return { color: base, opacity: 0.15 }
            return { color: base + '30' }
          })()
        : undefined,
      itemStyle: { color: s.color || t.colors[i % t.colors.length] },
      markLine: markLine ? {
        silent: true,
        symbol: 'none',
        lineStyle: { color: 'var(--color-warning)', type: 'dashed', width: 1, opacity: 0.6 },
        data: [{ yAxis: markLine, label: { show: false } }],
      } : undefined,
    })),
  }), [area, height, isCompact, markLine, series, smooth, xData, yAxisMax, yAxisMin, t, f])

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}

export default memo(LineChart)
