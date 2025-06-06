import { request } from '@/api'
import { useAuthStore, useUserStore } from '@/models'
import { Button } from '@nutui/nutui-react-taro'
import { Input, View } from '@tarojs/components'
import Taro from '@tarojs/taro'

const Login = () => {
  const setToken = useUserStore.use.setToken()
  const redirect = useAuthStore.use.redirect()

  const login = async () => {
    // const res = await request<any>('/api/login', {
    //   method: 'POST',
    // })
    console.log('resresres')

    setToken('dfasdfasdfasdfsda ')
    if (redirect && redirect.url) {
      // Taro.switchTab({url:auth.redirect.url})
    } else {
    }
    Taro.switchTab({ url: '/pages/index/index' })
  }

  return (
    <View className="login" onClick={login}>
      <View className="login-title">登录</View>
      <View className="login-input">
        <Input placeholder="请输入手机号" />
      </View>
      <View className="login-input">
        <Input placeholder="请输入验证码" />
      </View>
      <View className="login-btn">
        <Button type="primary" onClick={login}>
          登录
        </Button>
      </View>
    </View>
  )
}

export default Login
