import { useUserStore } from '@/models'
import { TabBar } from '@/tab-bar'
import { Loading } from '@nutui/icons-react-taro'
import { View } from '@tarojs/components'
import Taro, { useLaunch, useLoad } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

const ROUTE_WITHTABBAR = ['/factory', '/message', '/moments', '/magazine', '/mine']
const permissionRoutes = [
  '/paycar', //购物车
  '/payorder', //订单
  '/pay', //支付
  ...ROUTE_WITHTABBAR,
]

const AuthRoute = () => {
  const navigate = useNavigate()
  const token = useUserStore.use.token()
  const lastTab = useUserStore.use.lastTab()
  const isLogged = useUserStore.use.isLogged()
  const [isLoaded, setLoaded] = useState<boolean>(false)

  const location = useLocation()

  console.log(token, 'token')
  console.log(isLogged, 'isLogged')
  console.log(lastTab, 'lastTab')
  console.log(location.pathname, 'pathname')

  useLoad(() => {
    console.log('2222222222222222222222222')

    if (token == '' || !isLogged) {
      if (permissionRoutes.some((item) => item === lastTab)) {
        navigate('login')
      } else {
        navigate(lastTab || 'factory')
      }
    } else {
      navigate(lastTab || 'factory')
    }
    setLoaded(true)
  })

  useEffect(() => {
    if (isLoaded && (token == '' || !isLogged)) {
      if (permissionRoutes.some((item) => item === location.pathname)) {
        navigate('login')
      }
    }
  }, [location.pathname])

  return !isLoaded ? (
    <View className="flex items-center justify-center h-full">
      <Loading size={20} color="#1890ff" />
    </View>
  ) : (
    <>
      <Outlet />
      {ROUTE_WITHTABBAR.includes(location.pathname) && <TabBar />}
    </>
  )
}
export default AuthRoute
