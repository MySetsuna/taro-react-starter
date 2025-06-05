import { useAuthStore, useUserStore } from '@/models'
import './index.scss'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router'
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

export default function Index() {
  const auth = useAuthStore()

  useLaunch(() => {
    auth.setRedirect({ url: '/pages/login/index/' })
  })

  return (
    <ConfigProvider
      theme={{
        nutuiSearchbarBackground: "transparent",
        nutuiSearchbarContentBackground: '#eee',
        nutuiSearchbarInputTextAlign: 'left',
        nutuiSearchbarPadding: '0',
      }}
    >
      <View style={{color:'transparent'}}></View>
      <BrowserRouter basename="/pages/index/index">
        <Routes>
          <Route path="*" element={<AuthRoute />}>
            <Route path="factory" element={<Factory />}></Route>
            <Route path="message" element={<Message />}></Route>
            <Route path="moments" element={<Moments />}></Route>
            <Route path="magazine" element={<Magazine />}></Route>
            <Route path="mine" element={<Mine />}></Route>
          </Route>
        </Routes>
        <TabBar />
      </BrowserRouter>
    </ConfigProvider>
  )
}
