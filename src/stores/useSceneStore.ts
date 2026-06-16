import { create } from 'zustand'

interface FlyToRequest {
  position: [number, number, number]
  lookAt: [number, number, number]
  requestId: number
}

interface SceneState {
  cameraTarget: [number, number, number]
  selectedObjectId: string | null
  isSceneLoaded: boolean
  flyToRequest: FlyToRequest | null
  setCameraTarget: (target: [number, number, number]) => void
  selectObject: (id: string | null) => void
  setSceneLoaded: (loaded: boolean) => void
  requestFlyTo: (position: [number, number, number], lookAt: [number, number, number]) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  cameraTarget: [0, 0, 0],
  selectedObjectId: null,
  isSceneLoaded: false,
  flyToRequest: null,
  setCameraTarget: (target) => set({ cameraTarget: target }),
  selectObject: (id) => set({ selectedObjectId: id }),
  setSceneLoaded: (loaded) => set({ isSceneLoaded: loaded }),
  requestFlyTo: (position, lookAt) =>
    set({ flyToRequest: { position, lookAt, requestId: Date.now() } }),
}))
