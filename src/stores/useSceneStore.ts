import { create } from 'zustand'

interface SceneState {
  cameraTarget: [number, number, number]
  selectedObjectId: string | null
  isSceneLoaded: boolean
  setCameraTarget: (target: [number, number, number]) => void
  selectObject: (id: string | null) => void
  setSceneLoaded: (loaded: boolean) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  cameraTarget: [0, 0, 0],
  selectedObjectId: null,
  isSceneLoaded: false,
  setCameraTarget: (target) => set({ cameraTarget: target }),
  selectObject: (id) => set({ selectedObjectId: id }),
  setSceneLoaded: (loaded) => set({ isSceneLoaded: loaded }),
}))
