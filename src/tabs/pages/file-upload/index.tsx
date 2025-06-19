import { useUserStore } from '@/models'
import { ArrowLeft } from '@nutui/icons-react-taro'
import { NavBar } from '@nutui/nutui-react-taro'
import { View, WebView } from '@tarojs/components'
import Taro from '@tarojs/taro'

export default function FileUpload() {
  const token = useUserStore.use.token()
  const loginInfo = useUserStore.use.loginInfo()
  const baseUrl = process.env.TARO_APP_API
  const searchParams = Taro.getCurrentInstance().router?.params
  const backUrl = searchParams?.backUrl
  const navigate = () => {
    if (backUrl) {
      Taro.navigateTo({ url: backUrl })
    }
  }

  console.log(baseUrl, 'baseUrl', loginInfo, token, 'loginInfo', backUrl, 'backUrl')
  return (
    <WebView
      src={`http://192.168.0.149:10086/#/pages/index/index?clientId=${loginInfo.client_id}&token=${token}&baseUrl=${baseUrl}&backUrl=${backUrl}`}
      onMessage={(event) => {
        console.log(event, 'event')
        navigate()
      }}
    />
  )
}
