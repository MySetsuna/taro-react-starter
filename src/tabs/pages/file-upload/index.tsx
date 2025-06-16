import { useUserStore } from '@/models'
import { ArrowLeft } from '@nutui/icons-react-taro'
import { NavBar } from '@nutui/nutui-react-taro'
import { View, WebView } from '@tarojs/components'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'

export default function FileUpload() {
  const token = useUserStore.use.token()
  const loginInfo = useUserStore.use.loginInfo()
  const baseUrl = process.env.TARO_APP_API
  const [searchParams] = useSearchParams()
  const backUrl = searchParams.get('backUrl')
  const navigate = useNavigate()

  console.log(baseUrl, 'baseUrl', loginInfo, token, 'loginInfo', backUrl, 'backUrl')
  return (
    <WebView
      src={`http://192.168.0.149:10086/#/pages/index/index?clientId=${loginInfo.client_id}&token=${token}&baseUrl=${baseUrl}&backUrl=${backUrl}`}
      onMessage={(event) => {
        console.log(event, 'event')
        navigate(backUrl)
        // location.href = location.origin + backUrl
      }}
    />
  )
}
