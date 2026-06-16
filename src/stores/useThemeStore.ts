import { create } from 'zustand'
import { ThemeId, THEMES } from '@/types/theme'

interface ThemeState {
  currentTheme: ThemeId
  isTransitioning: boolean
  allThemes: typeof THEMES
  switchTheme: (theme: ThemeId) => void
  finishTransition: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: ThemeId.OVERVIEW,
  isTransitioning: false,
  allThemes: THEMES,
  switchTheme: (theme: ThemeId) => {
    set({ currentTheme: theme, isTransitioning: true })
  },
  finishTransition: () => {
    set({ isTransitioning: false })
  },
}))
