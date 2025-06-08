import { StorageSceneKey, zustandStorage } from '@/libs'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import createSelectors from './selectors'
import { ICategory, IFactory, TAreaTree } from 'types/module'
import { IDataResponse, IRowsResponse } from 'types/http'
import { EResponseCode, request } from '@/api'

interface State {
  factoryList: ReadonlyArray<IFactory>
  currentLocation: number[]
  searchValue: string
  categories: ReadonlyArray<ICategory>
  currentCategory: ICategory['id']
  areaData: ReadonlyArray<TAreaTree>
}

interface Action {
  setLocation: (location: number[]) => void
  setFactoryList: (list: ReadonlyArray<IFactory>) => void
  setSearchValue: (value: string) => void
  setCurrentCategory: (category: ICategory['id']) => void
  fetchCategoryList: () => Promise<void>
  fetchAreaData: () => Promise<void>
}

const initialState: State = {
  factoryList: [],
  categories: [],
  currentLocation: [-1],
  searchValue: '',
  currentCategory: NaN,
  areaData: [],
}

const store = create<State & Action>()(
  persist(
    (set, get) => ({
      factoryList: [],
      currentLocation: [-1],
      searchValue: '',
      categories: [],
      currentCategory: NaN,
      setLocation: (location) => set({ currentLocation: location }),
      setFactoryList: (list) => set({ factoryList: list }),
      setSearchValue: (value) => set({ searchValue: value }),
      setCurrentCategory: (category) => set({ currentCategory: category }),
      areaData: [],
      fetchAreaData: async () => {
        // const res = await getCategories()
        const data = await request<IDataResponse<Array<TAreaTree>>>('/city/tree', {
          timeout: 2000,
        })
        if (EResponseCode.SUCCESS === data.code) {
          set({ areaData: data.data })
        }
      },
      fetchCategoryList: async () => {
        const data = await request<IRowsResponse<ICategory>>('/app/tenant/category/list', {
          method: 'GET',
        })
        if (EResponseCode.SUCCESS === data.code) {
          set({ categories: data.rows })
          if (data.rows.length) set({ currentCategory: data.rows[0].id })
        }
      },
    }),
    {
      // ! 注意这里的name是当前这个Zustand模块进行缓存时的唯一key, 每个需要缓存的Zustand模块都必须分配一个唯一key
      name: StorageSceneKey.USER,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)

export const useFactoryStore = createSelectors(store)
export function useFactoryReset() {
  store.setState(initialState)
}
