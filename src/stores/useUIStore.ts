import { create } from 'zustand'

interface Alert {
  id: string
  type: 'warning' | 'error' | 'info'
  message: string
  timestamp: Date
}

interface UIState {
  modalStack: string[]
  alertQueue: Alert[]
  pushModal: (id: string) => void
  popModal: () => void
  clearModals: () => void
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void
  dismissAlert: (id: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  modalStack: [],
  alertQueue: [],
  pushModal: (id) => set((s) => ({ modalStack: [...s.modalStack, id] })),
  popModal: () => set((s) => ({ modalStack: s.modalStack.slice(0, -1) })),
  clearModals: () => set({ modalStack: [] }),
  addAlert: (alert) =>
    set((s) => ({
      alertQueue: [
        ...s.alertQueue,
        { ...alert, id: crypto.randomUUID(), timestamp: new Date() },
      ],
    })),
  dismissAlert: (id) =>
    set((s) => ({ alertQueue: s.alertQueue.filter((a) => a.id !== id) })),
}))
