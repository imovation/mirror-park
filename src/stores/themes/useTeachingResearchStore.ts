import { create } from 'zustand'

interface TeachingResearchState {
  _initialized: boolean
}

export const useTeachingResearchStore = create<TeachingResearchState>(() => ({
  _initialized: false,
}))
