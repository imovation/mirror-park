import { create } from 'zustand'

interface AdminState {
  _initialized: boolean
}

export const useAdminStore = create<AdminState>(() => ({
  _initialized: false,
}))
