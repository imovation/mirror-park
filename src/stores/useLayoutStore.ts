import { create } from 'zustand'
import { ThemeId } from '@/types/theme'

interface LayoutState {
  activeModule: ThemeId
  setActiveModule: (id: ThemeId) => void
}

export const useLayoutStore = create<LayoutState>((set) => ({
  activeModule: ThemeId.OVERVIEW,
  setActiveModule: (id: ThemeId) => set({ activeModule: id }),
}))
