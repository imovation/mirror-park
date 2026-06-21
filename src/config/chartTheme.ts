import { useUIThemeStore } from '@/stores/useUIThemeStore'
import type { UITheme } from '@/stores/useUIThemeStore'
import { useThemeStore } from '@/stores/useThemeStore'
import { THEME_COLORS, type ThemeColor } from './themeColors'

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
  primary: string
  primaryRgb: string
  glow: string
}

function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace('#', '')
  const full = cleaned.length === 3 ? cleaned.split('').map(c => c + c).join('') : cleaned
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')
}

function shiftHue([r, g, b]: [number, number, number], hueShift: number): [number, number, number] {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2 / 255
  const s = max === min ? 0 : (max - min) / 255 / (1 - Math.abs(2 * l - 1) || 1)
  if (s === 0) return [r, g, b]
  const h = (() => {
    const d = max - min
    let hh = 0
    if (max === r) hh = ((g - b) / d) % 6
    else if (max === g) hh = (b - r) / d + 2
    else hh = (r - g) / d + 4
    hh = hh * 60
    if (hh < 0) hh += 360
    return hh
  })()
  const newHue = (h + hueShift + 360) % 360
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((newHue / 60) % 2) - 1))
  const m = l - c / 2
  const [rr, gg, bb] = (() => {
    if (newHue < 60) return [c, x, 0]
    if (newHue < 120) return [x, c, 0]
    if (newHue < 180) return [0, c, x]
    if (newHue < 240) return [0, x, c]
    if (newHue < 300) return [x, 0, c]
    return [c, 0, x]
  })()
  return [(rr + m) * 255, (gg + m) * 255, (bb + m) * 255]
}

function derivePalette(primary: string, count: number): string[] {
  const [r, g, b] = hexToRgb(primary)
  const base: [number, number, number] = [r, g, b]
  const shifts = [0, 35, 70, -45, 110, -80, 150, 200]
  return shifts.slice(0, count).map(s => rgbToHex(shiftHue(base, s)))
}

function deriveSequential(primary: string, count: number): string[] {
  const [r, g, b] = hexToRgb(primary)
  const result: string[] = []
  for (let i = 0; i < count; i++) {
    const factor = 0.45 + (0.55 * (i / Math.max(count - 1, 1)))
    result.push(rgbToHex([r * factor, g * factor, b * factor]))
  }
  return result
}

const BASE_DARK: Omit<ChartTheme, 'colors' | 'gaugeColors' | 'heatmapGradient' | 'primary' | 'primaryRgb' | 'glow'> = {
  axisLabel: 'rgba(255,255,255,0.6)',
  axisLine: 'rgba(34,211,238,0.3)',
  splitLine: 'rgba(255,255,255,0.08)',
  label: 'rgba(255,255,255,0.8)',
  title: 'rgba(255,255,255,0.9)',
  legendText: 'rgba(255,255,255,0.7)',
  borderColor: 'rgba(10,22,40,1)',
  gaugeAxis: '#fff',
  shadowColor: 'rgba(0, 0, 0, 0.5)',
}

const BASE_LIGHT: Omit<ChartTheme, 'colors' | 'gaugeColors' | 'heatmapGradient' | 'primary' | 'primaryRgb' | 'glow'> = {
  axisLabel: 'rgba(0,0,0,0.5)',
  axisLine: 'rgba(0,0,0,0.2)',
  splitLine: 'rgba(0,0,0,0.06)',
  label: 'rgba(0,0,0,0.6)',
  title: 'rgba(0,0,0,0.85)',
  legendText: 'rgba(0,0,0,0.6)',
  borderColor: 'rgba(255,255,255,1)',
  gaugeAxis: '#333',
  shadowColor: 'rgba(0,0,0,0.15)',
}

const HEATMAP_DARK = ['#0a1628', '#1a3a5c', '#2a6090', '#22d3ee', '#67e8f9']
const HEATMAP_LIGHT = ['#eef1f5', '#bae6fd', '#7dd3fc', '#0284c7', '#0369a1']

const GAUGE_DARK = ['#34d399', '#22d3ee', '#facc15', '#fb923c', '#f472b6']
const GAUGE_LIGHT = ['#059669', '#0284c7', '#ca8a04', '#ea580c', '#db2777']

const FALLBACK_COLOR: ThemeColor = THEME_COLORS['overview' as keyof typeof THEME_COLORS]

export function useChartTheme(): ChartTheme {
  const uiTheme = useUIThemeStore((s) => s.uiTheme)
  const themeId = useThemeStore((s) => s.currentTheme)
  const themeColor = THEME_COLORS[themeId] ?? FALLBACK_COLOR
  const base = uiTheme === 'dark' ? BASE_DARK : BASE_LIGHT
  const colors = derivePalette(themeColor.primary, 8)
  const heatmap = uiTheme === 'dark' ? HEATMAP_DARK : HEATMAP_LIGHT
  const gauge = uiTheme === 'dark' ? GAUGE_DARK : GAUGE_LIGHT
  return {
    ...base,
    colors,
    gaugeColors: gauge,
    heatmapGradient: heatmap,
    primary: themeColor.primary,
    primaryRgb: themeColor.primaryRgb,
    glow: themeColor.glow,
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

export { derivePalette, deriveSequential }
