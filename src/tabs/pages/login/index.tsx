import { EResponseCode, request } from '@/api'
import { useAuthStore, useRefeshTokenTimer, useUserStore } from '@/models'
import { Avatar, Button, Divider, Loading, Overlay } from '@nutui/nutui-react-taro'
import { Input, View } from '@tarojs/components'
import { useNavigate } from 'react-router'
import { default as IconLM } from '@/icons'
import { useNavTitle } from '@/hooks'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { ILoginInfo, IWechatLoginOptions } from 'types/login'
import { IDataResponse } from 'types/http'

const Login = () => {
  const setToken = useUserStore.use.setToken()
  const lastTab = useUserStore.use.lastTab()
  const userInfo = useUserStore.use.userInfo()
  const setUserInfo = useUserStore.use.setUserInfo()
  const setLoginInfo = useUserStore.use.setLoginInfo()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [isUserUpdated, setIsUserUpdated] = useState<boolean>(false)

  const navigate = useNavigate()
  const login = async () => {
    // const res = await request<any>('/api/login', {
    //   method: 'POST',
    // })
    console.log('resresres')

    setToken('dfasdfasdfasdfsda ')
    navigate(lastTab === '/mine' ? '/factory' : lastTab)
  }

  const wechatLogin = async () => {
    try {
      setIsLoading(true)
      const { code, ...rest } = await Taro.login()
      console.log(code, 'resresresresresresresres', rest)

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
      console.log(res, 'resresres')
      if (EResponseCode.SUCCESS === res.code) {
        setToken(res.data.access_token)
        setLoginInfo(res.data)
        useRefeshTokenTimer(res.data.expire_in)
        if (!isUserUpdated) {
          const { userInfo } = await Taro.getUserInfo().catch(async () => {
            return await Taro.getUserProfile({ desc: '用于完善会员资料' })
          })
          console.log(userInfo, 'userInfo')
          setUserInfo(userInfo)
        }
        navigate(lastTab === '/mine' ? '/factory' : lastTab)
      } else {
        Taro.showToast({
          title: res.msg,
          icon: 'none',
        })
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    Taro.getUserInfo().then((res) => {
      setUserInfo(res.userInfo)
      setIsUserUpdated(true)
    })
  }, [])

  return (
    <View className="login flex flex-col justify-center items-center p-2">
      <View className="phone-number-login login flex flex-col justify-center items-center flex-auto w-full">
        <View className="login-input">
          <Input placeholder="请输入手机号" />
        </View>
        <View className="login-input">
          <Input placeholder="请输入验证码" />
        </View>
        <View className="login-btn">
          <Button type="primary" onClick={login}>
            登录/注册
          </Button>
        </View>
      </View>
      <Divider style={{ borderStyle: 'dashed' }} />
      <View className="wechat-login login flex flex-col justify-center items-center flex-auto w-full">
        {userInfo && <Avatar size={'70px'} src={userInfo.avatarUrl} className=" mt-2" />}
        <View className=" mt-3">
          <Button color="#07c160" onClick={wechatLogin}>
            <View className=" flex items-center justify-center w-full gap-1">
              <IconLM name="icon" color="white" size={35} />
              <View>微信登录</View>
            </View>
          </Button>
        </View>
      </View>
      <Overlay visible={isLoading}>
        <View className="wrapper flex h-full items-center justify-center">
          <Loading direction="vertical">登录中</Loading>
        </View>
      </Overlay>
    </View>
  )
}

export default useNavTitle(Login, '登录')
