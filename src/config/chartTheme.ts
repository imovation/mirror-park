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
}

const DARK: ChartTheme = {
  axisLabel: 'rgba(255,255,255,0.4)',
  axisLine: 'rgba(74,158,255,0.15)',
  splitLine: 'rgba(74,158,255,0.08)',
  label: 'rgba(255,255,255,0.6)',
  title: 'rgba(255,255,255,0.5)',
  legendText: 'rgba(255,255,255,0.5)',
  borderColor: 'rgba(10,22,40,1)',
  gaugeAxis: '#fff',
  shadowColor: 'rgba(0,0,0,0.5)',
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
}

const THEMES: Record<UITheme, ChartTheme> = { dark: DARK, light: LIGHT }

export function useChartTheme(): ChartTheme {
  const uiTheme = useUIThemeStore((s) => s.uiTheme)
  return THEMES[uiTheme]
}
