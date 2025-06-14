import { useUserStore } from '@/models'
import { TabBar } from '@/tab-bar'
import Taro from '@tarojs/taro'
import { useEffect } from 'react'
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
  const isLogged = useUserStore.use.isLogged()

  const location = useLocation()
  const isLogin = token && isLogged

  useEffect(() => {
    if (!isLogin) {
      if (permissionRoutes.some((item) => item === location.pathname)) {
        console.log('444444444444444')
        navigate('login')
      }
    }
    if (ROUTE_WITHTABBAR.includes(location.pathname) && location.pathname !== '/mine') {
      Taro.setStorage({
        key: 'lastTab',
        data: location.pathname,
      })
    }
  }, [location.pathname, isLogin])

  return (
    <>
      <Outlet />
      {ROUTE_WITHTABBAR.includes(location.pathname) && <TabBar />}
    </>
  )
}
export default AuthRoute
