import { create } from 'zustand'

interface SecurityState {
  _initialized: boolean
}

export const useSecurityStore = create<SecurityState>(() => ({
  _initialized: false,
}))
