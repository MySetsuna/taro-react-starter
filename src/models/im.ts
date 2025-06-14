import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { StorageSceneKey, zustandStorage } from '../libs'
import createSelectors from './selectors'
import { useCallback, useEffect, useState } from 'react'

interface State {
  isSDKReady: boolean
  messageMap: Record<string, any[] | undefined>
  im: any
  conversationList: any[]
}
interface Action {
  setIsSDKReady: (value: boolean) => void
  setIminstance: (im: any) => void
  setConversationList: (list: any) => void
  setMessageMapById: (id: string, list: any[]) => void
  getMessageMapById: (id: string) => any[]
}

const store = create<State & Action>()(
  persist(
    (set, get) => ({
      im: null,
      messageMap: {},
      conversationList: [],
      isSDKReady: false,
      setIsSDKReady: (value) => set({ isSDKReady: value }),
      setIminstance: (im) => set({ im }),
      setConversationList: (list) => set({ conversationList: list }),
      setMessageMapById: (id, list) => set({ messageMap: { ...get().messageMap, [id]: list } }),
      getMessageMapById: (id) => get().messageMap[id] || [],
    }),
    {
      name: StorageSceneKey.IM,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)

export const useImStore = createSelectors(store)
export function useImStoreReset() {
  store.setState({ im: null })
}

export function getMessageList(conversationId: string) {
  const message = store.getState().getMessageMapById(conversationId)
  return message
}

export function useMessageMapById(conversationId: string) {
  const getMessageMapById = useImStore.use.getMessageMapById()
  const messageList = getMessageMapById(conversationId)
  const setMessageMapById = useImStore.use.setMessageMapById()
  const setMessageList = useCallback(
    (list: any[] | ((messageList: any[]) => any[])) => {
      if (!conversationId) return
      setMessageMapById(conversationId, typeof list === 'function' ? list(messageList) : list)
    },
    [conversationId, messageList]
  )

  return [messageList, setMessageList] as const
}
