import { create } from 'zustand'

export type UITheme = 'dark' | 'light'

interface UIThemeState {
  uiTheme: UITheme
  toggleUITheme: () => void
  setUITheme: (theme: UITheme) => void
}

export const useUIThemeStore = create<UIThemeState>((set) => ({
  uiTheme: 'dark',
  toggleUITheme: () =>
    set((s) => ({ uiTheme: s.uiTheme === 'dark' ? 'light' : 'dark' })),
  setUITheme: (theme) => set({ uiTheme: theme }),
}))
