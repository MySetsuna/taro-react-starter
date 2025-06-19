import { StorageSceneKey, zustandStorage } from '@/libs'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import createSelectors from './selectors'
import { ICategory, IFactory, TAreaTree } from 'types/module'
import { IDataResponse, IRowsResponse } from 'types/http'
import { EResponseCode, request } from '@/api'
import { CascaderOption } from '@nutui/nutui-react-taro'
import { useMemo } from 'react'

interface State {
  fileDownloadMap: Record<
    string,
    {
      id: string
      url: string
      size: number
      fileName: string
      savedPath: string
    }
  >
}

interface Action {
  setFileDownloadMap: (
    list: Record<
      string,
      {
        id: string
        url: string
        size: number
        fileName: string
        savedPath: string
      }
    >
  ) => void
  addFileDownload: (id: string, url: string, size: number, fileName: string, savedPath: string) => void
  deleteFileDownload: (id: string) => void
}

const initialState: State = {
  fileDownloadMap: {},
}

const store = create<State & Action>()(
  persist(
    (set, get) => ({
      fileDownloadMap: {},
      setFileDownloadMap: (map) => set({ fileDownloadMap: map }),
      addFileDownload: (id, url, size, fileName, savedPath) =>
        set((state) => ({
          fileDownloadMap: {
            ...state.fileDownloadMap,
            [id]: { id, url, size, fileName, savedPath },
          },
        })),
      deleteFileDownload: (id) =>
        set((state) => ({
          fileDownloadMap: Object.fromEntries(Object.entries(state.fileDownloadMap).filter(([key]) => key !== id)),
        })),
    }),
    {
      // ! 注意这里的name是当前这个Zustand模块进行缓存时的唯一key, 每个需要缓存的Zustand模块都必须分配一个唯一key
      name: StorageSceneKey.FACTORY,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)

export const useCacheStore = createSelectors(store)
