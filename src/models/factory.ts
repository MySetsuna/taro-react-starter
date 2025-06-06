import { StorageSceneKey, zustandStorage } from '@/libs'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import createSelectors from './selectors'
import { ICategory, IFactory } from 'types/module'

interface State {
  factoryList: ReadonlyArray<IFactory>
  currentLocation: string[]
  searchValue: string
  categories: ReadonlyArray<ICategory>
  currentCategory: ICategory['id']
}

interface Action {
  setLocation: (location: string[]) => void
  setFactoryList: (list: ReadonlyArray<IFactory>) => void
  setSearchValue: (value: string) => void
  setCategories: (categories: ReadonlyArray<ICategory>) => void
  setCurrentCategory: (category: ICategory['id']) => void
}

const initialState: State = {
  factoryList: [],
  categories: [],
  currentLocation: ['86'], // 86 全国 //长沙 ["430000", "430100"]
  searchValue: '',
  currentCategory: NaN,
}

const store = create<State & Action>()(
  persist(
    (set, get) => ({
      factoryList: [],
      currentLocation: ['86'],
      searchValue: '',
      categories: [],
      currentCategory: NaN,
      setLocation: (location) => set({ currentLocation: location }),
      setFactoryList: (list) => set({ factoryList: list }),
      setSearchValue: (value) => set({ searchValue: value }),
      setCategories: (categories) => set({ categories }),
      setCurrentCategory: (category) => set({ currentCategory: category }),
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
