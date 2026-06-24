import { create } from 'zustand'

export interface CameraState {
  position: [number, number, number]
  target: [number, number, number]
}

interface CameraCaptureState {
  current: CameraState
  captured: CameraState | null
  setCurrent: (state: CameraState) => void
  capture: () => CameraState
}

export const useCameraCaptureStore = create<CameraCaptureState>((set, get) => ({
  current: { position: [0, 0, 0], target: [0, 0, 0] },
  captured: null,
  setCurrent: (state) => set({ current: state }),
  capture: () => {
    const state = get().current
    set({ captured: state })
    return state
  },
}))
