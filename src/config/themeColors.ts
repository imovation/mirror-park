import { ThemeId } from '@/types/theme'

export interface ThemeColor {
  primary: string
  primaryRgb: string
  secondary: string
  glow: string
  gradient: string
}

export const THEME_COLORS: Record<ThemeId, ThemeColor> = {
  [ThemeId.OVERVIEW]: {
    primary: '#22d3ee',
    primaryRgb: '34, 211, 238',
    secondary: '#06b6d4',
    glow: 'rgba(34, 211, 238, 0.6)',
    gradient: 'linear-gradient(90deg, rgba(34, 211, 238, 0.18), rgba(34, 211, 238, 0) 70%)',
  },
  [ThemeId.TEACHING_RESEARCH]: {
    primary: '#a78bfa',
    primaryRgb: '167, 139, 250',
    secondary: '#8b5cf6',
    glow: 'rgba(167, 139, 250, 0.6)',
    gradient: 'linear-gradient(90deg, rgba(167, 139, 250, 0.18), rgba(167, 139, 250, 0) 70%)',
  },
  [ThemeId.ADMIN]: {
    primary: '#818cf8',
    primaryRgb: '129, 140, 248',
    secondary: '#6366f1',
    glow: 'rgba(129, 140, 248, 0.6)',
    gradient: 'linear-gradient(90deg, rgba(129, 140, 248, 0.18), rgba(129, 140, 248, 0) 70%)',
  },
  [ThemeId.LIBRARY]: {
    primary: '#facc15',
    primaryRgb: '250, 204, 21',
    secondary: '#eab308',
    glow: 'rgba(250, 204, 21, 0.6)',
    gradient: 'linear-gradient(90deg, rgba(250, 204, 21, 0.18), rgba(250, 204, 21, 0) 70%)',
  },
  [ThemeId.ACADEMICS]: {
    primary: '#2dd4bf',
    primaryRgb: '45, 212, 191',
    secondary: '#14b8a6',
    glow: 'rgba(45, 212, 191, 0.6)',
    gradient: 'linear-gradient(90deg, rgba(45, 212, 191, 0.18), rgba(45, 212, 191, 0) 70%)',
  },
  [ThemeId.SECURITY]: {
    primary: '#fb923c',
    primaryRgb: '251, 146, 60',
    secondary: '#f97316',
    glow: 'rgba(251, 146, 60, 0.6)',
    gradient: 'linear-gradient(90deg, rgba(251, 146, 60, 0.18), rgba(251, 146, 60, 0) 70%)',
  },
  [ThemeId.LOGISTICS]: {
    primary: '#34d399',
    primaryRgb: '52, 211, 153',
    secondary: '#10b981',
    glow: 'rgba(52, 211, 153, 0.6)',
    gradient: 'linear-gradient(90deg, rgba(52, 211, 153, 0.18), rgba(52, 211, 153, 0) 70%)',
  },
}

export function applyThemeColor(themeId: ThemeId) {
  const color = THEME_COLORS[themeId]
  if (!color) return
  const root = document.documentElement
  root.style.setProperty('--theme-primary', color.primary)
  root.style.setProperty('--theme-primary-rgb', color.primaryRgb)
  root.style.setProperty('--theme-secondary', color.secondary)
  root.style.setProperty('--theme-glow', color.glow)
  root.style.setProperty('--theme-gradient', color.gradient)
}
