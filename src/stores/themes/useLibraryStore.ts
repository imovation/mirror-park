import { create } from 'zustand'

interface LibraryState {
  _initialized: boolean
}

export const useLibraryStore = create<LibraryState>(() => ({
  _initialized: false,
}))
