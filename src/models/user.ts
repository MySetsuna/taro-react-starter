import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { StorageSceneKey, zustandStorage } from '../libs'
import createSelectors from './selectors'
import { IDataResponse, IResponse } from 'types/http'
import { EResponseCode, request } from '@/api'
import { ILoginInfo, IWechatLoginOptions } from 'types/login'
import Taro from '@tarojs/taro'
import { IIMUserInfo } from 'types/im'

interface State {
  token: string
  isLogged: boolean
  userInfo: Taro.UserInfo | null
  loginInfo: ILoginInfo | null
  IMUserInfo: IIMUserInfo | null
}
interface Action {
  setToken: (token: string) => void
  removeToken: () => void
  setUserInfo: (userInfo: Taro.UserInfo) => void
  setLoginInfo: (userInfo: ILoginInfo) => void
  setIMUserInfo: (userInfo: IIMUserInfo) => void
}

const initialState: State = {
  token: '',
  isLogged: false,
  userInfo: null,
  loginInfo: null,
  IMUserInfo: null,
}
const store = create<State & Action>()(
  persist(
    (set, get) => ({
      token: '',
      isLogged: false,
      userInfo: null,
      loginInfo: null,
      IMUserInfo: null,
      setToken: (token) => set({ token, isLogged: true }),
      removeToken: async () => {
        await request<IResponse>('/auth/logout', {
          method: 'POST',
        })
        set({ token: '', isLogged: false })
      },
      setUserInfo: (userInfo) => set({ userInfo }),
      setLoginInfo: (loginInfo) => set({ loginInfo }),
      setIMUserInfo: (IMUserInfo) => set({ IMUserInfo }),
    }),
    {
      // ! 注意这里的name是当前这个Zustand模块进行缓存时的唯一key, 每个需要缓存的Zustand模块都必须分配一个唯一key
      name: StorageSceneKey.USER,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)

export const useUserStore = createSelectors(store)
export function useUserReset() {
  store.setState(initialState)
}

let refreshTokenTimer = null

export function useRefeshTokenTimer(expireIn: number) {
  if (refreshTokenTimer) {
    clearTimeout(refreshTokenTimer)
  }
  refreshTokenTimer = setTimeout(
    async () => {
      const { code } = await Taro.login()
      const res = await request<IDataResponse<ILoginInfo>, IWechatLoginOptions>('/auth/login', {
        method: 'POST',
        data: {
          clientId: 'be7052a7e4f802c20df10a8d131adb12',
          grantType: 'xcx',
          tenantId: '000000',
          code: '',
          uuid: '',
          appid: 'wxda63215f19af7717',
          xcxCode: code,
          userType: 'app_user',
        },
      })
      if (res.code === EResponseCode.SUCCESS) {
        store.setState({ token: res.data.access_token })
        store.setState({ loginInfo: res.data })
      }
    },
    Math.max(expireIn - 30000, 0)
  )
}
