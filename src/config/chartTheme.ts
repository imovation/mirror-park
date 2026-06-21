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
  gaugeColors: string[]
  heatmapGradient: string[]
}

const DARK_PALETTE = [
  '#22d3ee',
  '#f472b6',
  '#34d399',
  '#a78bfa',
  '#fbbf24',
  '#60a5fa',
  '#fb923c',
  '#f87171',
  '#2dd4bf',
  '#c084fc',
  '#fde047',
  '#a3e635',
]

const LIGHT_PALETTE = [
  '#0891b2',
  '#db2777',
  '#059669',
  '#7c3aed',
  '#d97706',
  '#2563eb',
  '#ea580c',
  '#dc2626',
  '#0d9488',
  '#9333ea',
  '#ca8a04',
  '#65a30d',
]

const HEATMAP_DARK = ['#0a1628', '#1a3a5c', '#2a6090', '#22d3ee', '#67e8f9']
const HEATMAP_LIGHT = ['#eef1f5', '#bae6fd', '#7dd3fc', '#0284c7', '#0369a1']

const GAUGE_DARK = ['#34d399', '#22d3ee', '#facc15', '#fb923c', '#f472b6']
const GAUGE_LIGHT = ['#059669', '#0284c7', '#ca8a04', '#ea580c', '#db2777']

const SEMANTIC = {
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
  pending: '#fbbf24',
  info: '#22d3ee',
  male: '#60a5fa',
  female: '#f472b6',
  primary: '#22d3ee',
  secondary: '#a78bfa',
}

const BASE_DARK = {
  axisLabel: 'rgba(255,255,255,0.6)',
  axisLine: 'rgba(34,211,238,0.3)',
  splitLine: 'rgba(255,255,255,0.08)',
  label: 'rgba(255,255,255,0.85)',
  title: 'rgba(255,255,255,0.9)',
  legendText: 'rgba(255,255,255,0.7)',
  borderColor: 'rgba(10,22,40,1)',
  gaugeAxis: '#fff',
  shadowColor: 'rgba(0, 0, 0, 0.5)',
}

const BASE_LIGHT = {
  axisLabel: 'rgba(0,0,0,0.5)',
  axisLine: 'rgba(0,0,0,0.2)',
  splitLine: 'rgba(0,0,0,0.06)',
  label: 'rgba(0,0,0,0.7)',
  title: 'rgba(0,0,0,0.85)',
  legendText: 'rgba(0,0,0,0.6)',
  borderColor: 'rgba(255,255,255,1)',
  gaugeAxis: '#333',
  shadowColor: 'rgba(0,0,0,0.15)',
}

export function useChartTheme(): ChartTheme {
  const uiTheme = useUIThemeStore((s) => s.uiTheme)
  const colors = uiTheme === 'dark' ? DARK_PALETTE : LIGHT_PALETTE
  const heatmap = uiTheme === 'dark' ? HEATMAP_DARK : HEATMAP_LIGHT
  const gauge = uiTheme === 'dark' ? GAUGE_DARK : GAUGE_LIGHT
  const base = uiTheme === 'dark' ? BASE_DARK : BASE_LIGHT
  return {
    ...base,
    colors,
    gaugeColors: gauge,
    heatmapGradient: heatmap,
  }
}

export function getChartFontSizes() {
  const rootStyle = getComputedStyle(document.documentElement)
  return {
    axisFontSize: parseInt(rootStyle.getPropertyValue('--font-size-xs').trim()) || 10,
    legendFontSize: parseInt(rootStyle.getPropertyValue('--font-size-sm').trim()) || 11,
    titleFontSize: parseInt(rootStyle.getPropertyValue('--font-size-md').trim()) || 12,
  }
}

export const CHART_PALETTE = {
  dark: DARK_PALETTE,
  light: LIGHT_PALETTE,
  semantic: SEMANTIC,
}

// 色相轮转: 相邻图表用不同色相增强区分
// 设计: 60° 间隔的高对比色对, 避免视觉混淆
export const HUE_ROTATION = {
  // 4 色: 青/紫/橙/绿 (60° 间隔)
  r4: ['#22d3ee', '#a78bfa', '#fb923c', '#34d399'],
  // 3 色: 青/橙/紫 (120° 间隔, 三角形色相)
  r3: ['#22d3ee', '#fb923c', '#a78bfa'],
  // 2 色: 青/橙 (180° 间隔, 补色)
  r2: ['#22d3ee', '#fb923c'],
}

export type UIThemeType = UITheme
