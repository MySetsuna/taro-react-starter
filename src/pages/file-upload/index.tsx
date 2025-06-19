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
  const { conversationID, messageToImId } = searchParams
  console.log(
    loginInfo,
    token,
    'loginInfo',
    'backUrl',
    process.env.TARO_APP_FILE_UPLOAD,
    'conversationID',
    conversationID,
    'messageToImId',
    messageToImId
  )
  return (
    <WebView
      src={`${process.env.TARO_APP_FILE_UPLOAD}/#/pages/index/index?clientId=${loginInfo.client_id}&token=${token}&baseUrl=${baseUrl}`}
      onMessage={(event: any) => {
        console.log(event, 'event')
        const messages = event.mpEvent.detail.data
        const successMsg = messages.find((item: any) => item.type === 'UPLOAD_COMPLETE')
        if (successMsg) {
          Taro.eventCenter.trigger('UPLOAD_COMPLETE', { conversationID, messageToImId, ...successMsg.data })
        }
      }}
    />
  )
}
