import { useUserStore } from '@/models'
import { Route, Routes } from 'react-router'
import Taro, { useLaunch } from '@tarojs/taro'
import Factory from '@/tabs/factory'
import Message from '@/tabs/message'
import Moments from '@/tabs/moments'
import Magazine from '@/tabs/magazine'
import Mine from '@/tabs/mine'
import AuthRoute from '@/router/auth-route'
import { ConfigProvider } from '@nutui/nutui-react-taro'
import { View } from '@tarojs/components'
import { BrowserRouter } from 'react-router-dom'

import './index.scss'
import Login from '../../tabs/pages/login'
import { requestInstance } from '@/api'
import { useEffect } from 'react'
import { useImStore, useImStoreReset } from '@/models/im'
import { utils } from '@/libs'

export default function Index() {
  const setIsSDKReady = useImStore.use.setIsSDKReady()
  const token = useUserStore.use.token()
  useEffect(() => {
    // setRedirect({ url: '/pages/login/index' })
    console.log(Taro.SubPackage, 'Taro.SubPackage')

    if (token) {
      requestInstance.setHeaders({
        Authorization: `Bearer ${token}`,
      })
    }
  }, [token])

  useEffect(() => {
    useImStoreReset()
    __non_webpack_require__.async('../../im-sdk/pages/blank/index')
    utils.onIMSDKReady(() => {
      console.log('onIMSDKReady')
      setIsSDKReady(true)
    })
  }, [])

  return (
    <ConfigProvider
      id="page-index"
      theme={{
        nutuiSearchbarBackground: 'transparent',
        nutuiSearchbarContentBackground: '#eee',
        nutuiSearchbarInputTextAlign: 'left',
        nutuiSearchbarPadding: '0',
      }}
    >
      <View style={{ color: 'transparent' }}></View>
      <BrowserRouter basename="/pages/index/index">
        <Routes>
          <Route path="*" element={<AuthRoute />}>
            <Route path="factory" element={<Factory />}></Route>
            <Route path="message" element={<Message />}></Route>
            <Route path="moments" element={<Moments />}></Route>
            <Route path="magazine" element={<Magazine />}></Route>
            <Route path="mine" element={<Mine />}></Route>
            <Route path="login" element={<Login />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}
