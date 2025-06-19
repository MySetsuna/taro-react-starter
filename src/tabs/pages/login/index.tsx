import { EResponseCode, request, requestInstance } from '@/api'
import { useAuthStore, useRefeshTokenTimer, useUserStore } from '@/models'
import { Avatar, Button, Divider, Loading, Overlay } from '@nutui/nutui-react-taro'
import { Input, View } from '@tarojs/components'
import { useNavigate } from 'react-router'
import { default as IconLM } from '@/icons'
import { useNavStyle } from '@/hooks'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { ILoginInfo, ISMSLoginOptions, IWechatLoginOptions } from 'types/login'
import { IDataResponse } from 'types/http'
import { log } from 'console'

const Login = () => {
  const setToken = useUserStore.use.setToken()
  const userInfo = useUserStore.use.userInfo()
  const setUserInfo = useUserStore.use.setUserInfo()
  const setLoginInfo = useUserStore.use.setLoginInfo()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isUserUpdated, setIsUserUpdated] = useState<boolean>(false)

  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)

  const navigate = useNavigate()

  const login = async () => {
    const res = await request<IDataResponse<ILoginInfo>, ISMSLoginOptions>('/auth/login', {
      method: 'POST',
      data: {
        userType: 'app_user',
        clientId: process.env.TARO_APP_CLIENT_ID,
        grantType: 'sms',
        tenantId: '000000',
        code: '',
        uuid: '',
        appid: process.env.TARO_APP_ID,
        phonenumber: '18775167632',
        smsCode: '6799',
      },
    })
    console.log(res, 'resresres')

    setToken('dfasdfasdfasdfsda ')
    navigate('/factory')
  }

  // 获取验证码
  const handleGetCode = async () => {
    if (!/^1\d{10}$/.test(phone)) {
      Taro.showToast({ title: '请输入正确手机号', icon: 'none' })
      return
    }
    // await request<any>('/api/send-code', { method: 'POST', data: { phone } })
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // 手机号+验证码登录
  const handlePhoneLogin = async () => {
    if (!/^1\d{10}$/.test(phone) || !code) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    const result = await request<IDataResponse<ILoginInfo>, ISMSLoginOptions>('/auth/login', {
      method: 'POST',
      data: {
        clientId: process.env.TARO_APP_CLIENT_ID,
        grantType: 'sms',
        tenantId: '000000',
        code: '',
        uuid: '',
        appid: process.env.TARO_APP_ID,
        phonenumber: phone,
        smsCode: code,
        userType: 'app_user',
      },
    })
    setToken(result.data.access_token)
    navigate('/factory')
  }

  const wechatLogin = async (phonenumber?: number) => {
    try {
      setIsLoading(true)
      const { code, ...rest } = await Taro.login()
      console.log(code, 'resresresresresresresres', rest)

      const res = await request<IDataResponse<ILoginInfo>, IWechatLoginOptions>('/auth/login', {
        method: 'POST',
        data: {
          clientId: process.env.TARO_APP_CLIENT_ID,
          grantType: 'xcx',
          tenantId: '000000',
          code: '',
          uuid: '',
          appid: process.env.TARO_APP_ID,
          phonenumber: phone,
          xcxCode: code,
          userType: 'app_user',
        },
      })
      console.log(res, 'resresres')
      if (EResponseCode.SUCCESS === res.code) {
        const authorization = `Bearer ${res.data.access_token}`
        requestInstance.setHeaders({
          Authorization: authorization,
          clientId: res.data.client_id,
        })
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

        navigate('/factory')
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
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      Taro.getUserProfile({ desc: '用于完善会员资料' })
        .then((res) => {
          console.log(res, 'res')
          setUserInfo(res.userInfo)
          setIsUserUpdated(true)
        })
        .catch((err) => {
          console.log(err, 'err')
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [])

  return (
    <View className="login flex flex-col justify-center items-center p-2">
      {/* <Button onClick={login}> 测试登录</Button> */}
      <View className="phone-number-login login flex flex-col justify-center items-center flex-auto w-full">
        <View className="login-input phone-number">
          <Input placeholder="请输入手机号" value={phone} onInput={(e) => setPhone(e.detail.value)} />
        </View>
        <View className="login-input code flex items-center">
          <Input placeholder="请输入验证码" value={code} onInput={(e) => setCode(e.detail.value)} />
          <Button size="small" disabled={countdown > 0} onClick={handleGetCode}>
            {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
          </Button>
        </View>
        <View className="login-btn">
          <Button type="primary" onClick={handlePhoneLogin}>
            手机号快捷登录/注册
          </Button>
        </View>
      </View>
      <Divider style={{ borderStyle: 'dashed' }} />
      <View className="wechat-login login flex flex-col justify-center items-center flex-auto w-full">
        {userInfo && <Avatar size={'70px'} src={userInfo.avatarUrl} className=" mt-2" />}
        <View className=" mt-3">
          <Button
            color="#07c160"
            // onClick={wechatLogin}
            openType="getPhoneNumber"
            onGetPhoneNumber={(e) => {
              try {
                console.log(e.detail, 'e.detail')
                wechatLogin()
                // wechatLogin(e.detail.iv)
              } catch (error) {
                console.log(error, 'error')
                wechatLogin()
              }
            }}
          >
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

export default useNavStyle(Login, {
  navigationBarTitle: {
    title: '登录',
  },
  navigationBarColor: {
    backgroundColor: '#ff0f23',
    frontColor: '#ffffff',
  },
})
