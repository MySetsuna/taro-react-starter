import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { StorageSceneKey, zustandStorage } from '../libs'
import createSelectors from './selectors'

interface State {
  isSDKReady: boolean
  messageList: any[]
}
interface Action {
  setIsSDKReady: (value: boolean) => void
}

const store = create<State & Action>()(
  persist(
    (set, get) => ({
      messageList: [],
      setMessageList: (list) => set({ messageList: list }),
      isSDKReady: false,
      setIsSDKReady: (value) => set({ isSDKReady: value }),
    }),
    {
      name: StorageSceneKey.IM,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)

export const useImStore = createSelectors(store)
export function useImStoreReset() {
  store.setState({ isSDKReady: false })
}
