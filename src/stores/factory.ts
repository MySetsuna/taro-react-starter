import { create } from 'zustand'

interface FactoryState {
  factoryList: any[]
  setFactoryList: (list: any[]) => void
  currentLocation: string
  setLocation: (location: string) => void
}

export const useFactoryStore = create<FactoryState>((set) => ({
  factoryList: [],
  setFactoryList: (list) => set({ factoryList: list }),
  currentLocation: '湖南',
  setLocation: (location) => set({ currentLocation: location })
}))