import { useUserStore } from '@/models'
import Taro from '@tarojs/taro'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

const AuthRoute = () => {
  const navigate = useNavigate()
  const token = useUserStore.use.token()
  const lastTab = useUserStore.use.lastTab()
  const isLogged = useUserStore.use.isLogged()

  console.log(token, 'token')
  console.log(isLogged, 'isLogged')
  console.log(lastTab, 'lastTab')

  useEffect(() => {
    if (token == '' || !isLogged) {
      // message.error("token 过期，请重新登录!");
      Taro.redirectTo({ url: '/pages/login/index/' })
    } else {
      // 获取上次登录tab
      if (lastTab) {
        navigate(lastTab)
      }
    }
  }, [token, isLogged])

  return <Outlet />
}
export default AuthRoute
