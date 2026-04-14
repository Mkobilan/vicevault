import { create } from 'zustand'

interface AppState {
  countDownDate: Date
  user: any | null
  setUser: (user: any) => void
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export const useStore = create<AppState>((set) => ({
  countDownDate: new Date('2026-11-19T00:00:00'),
  user: null,
  setUser: (user) => set({ user }),
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}))
