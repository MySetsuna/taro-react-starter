import { useAuthStore, useUserStore } from '@/models'
import { Route, Routes, useNavigate } from 'react-router'
import Taro, { useLaunch } from '@tarojs/taro'
import Factory from '@/tabs/factory'
import Message from '@/tabs/message'
import Moments from '@/tabs/moments'
import Magazine from '@/tabs/magazine'
import Mine from '@/tabs/mine'
import { TabBar } from '@/tab-bar'
import AuthRoute from '@/router/auth-route'
import { ConfigProvider } from '@nutui/nutui-react-taro'
import { View } from '@tarojs/components'
import { BrowserRouter } from 'react-router-dom'

import './index.scss'
import Login from '../../tabs/pages/login'

export default function Index() {
  const setRedirect = useAuthStore.use.setRedirect()
  const isLogged = useUserStore.use.isLogged()
  const lastTab = useUserStore.use.lastTab()
  useLaunch(() => {
    setRedirect({ url: '/pages/login/index' })
  })

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
