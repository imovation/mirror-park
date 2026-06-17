import { create } from 'zustand'
import type { TimeMode } from '@/config/dayNightTheme'

interface TimeModeState {
  timeMode: TimeMode
  toggleMode: () => void
  setMode: (mode: TimeMode) => void
}

export const useTimeModeStore = create<TimeModeState>((set) => ({
  timeMode: 'day',
  toggleMode: () =>
    set((s) => ({ timeMode: s.timeMode === 'day' ? 'night' : 'day' })),
  setMode: (mode) => set({ timeMode: mode }),
}))
