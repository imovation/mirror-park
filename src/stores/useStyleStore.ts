import { create } from 'zustand'

export type VisualStyle = 'classic' | 'tron'

interface StyleState {
  visualStyle: VisualStyle
  toggleStyle: () => void
  setStyle: (style: VisualStyle) => void
}

export const useStyleStore = create<StyleState>((set) => ({
  visualStyle: 'tron',
  toggleStyle: () =>
    set((s) => ({ visualStyle: s.visualStyle === 'classic' ? 'tron' : 'classic' })),
  setStyle: (style) => set({ visualStyle: style }),
}))
