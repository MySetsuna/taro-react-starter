import { request } from '@/api'
import { useAuthStore, useUserStore } from '@/models'
import { Button } from '@nutui/nutui-react-taro'
import { Input, View } from '@tarojs/components'
import { useNavigate } from 'react-router'

const Login = () => {
  const navigate = useNavigate()
  const setToken = useUserStore.use.setToken()
  const auth = useAuthStore()

  const login = async () => {
    const res = await request('/api/login', {
      method: 'POST',
    })
    setToken(res.data)
    if (auth.redirect?.url) {
      navigate(auth.redirect.url)
    } else {
      navigate('/pages/index/index/factory')
    }
  }

  return (
    <View className="login">
      <View className="login-title">登录</View>
      <View className="login-input">
        <Input placeholder="请输入手机号" />
      </View>
      <View className="login-input">
        <Input placeholder="请输入验证码" />
      </View>
      <View className="login-btn">
        <Button type="primary" onTap={login}>
          登录
        </Button>
      </View>
    </View>
  )
}

export default Login
