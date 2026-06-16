import { create } from 'zustand'

interface OverviewState {
  selectedBuildingId: string | null
  setSelectedBuilding: (id: string | null) => void
}

export const useOverviewStore = create<OverviewState>((set) => ({
  selectedBuildingId: null,
  setSelectedBuilding: (id) => set({ selectedBuildingId: id }),
}))
