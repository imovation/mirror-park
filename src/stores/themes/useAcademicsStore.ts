import { create } from 'zustand'

interface AcademicsState {
  _initialized: boolean
}

export const useAcademicsStore = create<AcademicsState>(() => ({
  _initialized: false,
}))
