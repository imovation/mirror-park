import { useUIThemeStore } from '@/stores/useUIThemeStore'
import type { UITheme } from '@/stores/useUIThemeStore'

export interface ChartTheme {
  axisLabel: string
  axisLine: string
  splitLine: string
  label: string
  title: string
  legendText: string
  borderColor: string
  gaugeAxis: string
  shadowColor: string
  colors: string[]
}

const DARK: ChartTheme = {
  axisLabel: 'rgba(255,255,255,0.6)',
  axisLine: 'rgba(34,211,238,0.3)',
  splitLine: 'rgba(34,211,238,0.1)',
  label: 'rgba(255,255,255,0.8)',
  title: 'rgba(34,211,238,0.9)',
  legendText: 'rgba(255,255,255,0.7)',
  borderColor: 'rgba(10,22,40,1)',
  gaugeAxis: '#fff',
  shadowColor: 'rgba(34,211,238,0.4)',
  colors: ['#22d3ee', '#818cf8', '#facc15', '#34d399', '#f472b6'],
}

const LIGHT: ChartTheme = {
  axisLabel: 'rgba(0,0,0,0.5)',
  axisLine: 'rgba(0,0,0,0.1)',
  splitLine: 'rgba(0,0,0,0.06)',
  label: 'rgba(0,0,0,0.6)',
  title: 'rgba(0,0,0,0.5)',
  legendText: 'rgba(0,0,0,0.5)',
  borderColor: 'rgba(0,0,0,0.06)',
  gaugeAxis: '#333',
  shadowColor: 'rgba(0,0,0,0.15)',
  colors: ['#0284c7', '#4f46e5', '#ca8a04', '#059669', '#db2777'],
}

const THEMES: Record<UITheme, ChartTheme> = { dark: DARK, light: LIGHT }

export function useChartTheme(): ChartTheme {
  const uiTheme = useUIThemeStore((s) => s.uiTheme)
  return THEMES[uiTheme]
}
