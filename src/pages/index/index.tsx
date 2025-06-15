import { useUserStore } from '@/models'
import { Navigate, Route, Routes } from 'react-router'
import Taro, { useLaunch } from '@tarojs/taro'
import Factory from '@/tabs/factory'
import Message from '@/tabs/message'
import Moments from '@/tabs/moments'
import Magazine from '@/tabs/magazine'
import Mine from '@/tabs/mine'
import AuthRoute from '@/router/auth-route'
import { ConfigProvider } from '@nutui/nutui-react-taro'
import { View } from '@tarojs/components'
import { BrowserRouter } from 'react-router-dom'

import './index.scss'
import Login from '../../tabs/pages/login'
import { request, requestInstance } from '@/api'
import { useCallback, useEffect } from 'react'
import { getMessageList, useImStore, useImStoreReset } from '@/models/im'
import { utils } from '@/libs'
import { IDataResponse, IGetOptionsWithoutParams } from 'types/http'
import { IIMUserInfo } from 'types/im'
import { Chat } from '@/pages/chat'
import FileUpload from '@/tabs/pages/file-upload'

export default function Index() {
  const setIsSDKReady = useImStore.use.setIsSDKReady()
  const im = useImStore.use.im()
  const token = useUserStore.use.token()
  const setIMUserInfo = useUserStore.use.setIMUserInfo()
  const IMUserInfo = useUserStore.use.IMUserInfo()
  const isSDKReady = useImStore.use.isSDKReady()
  const setIminstance = useImStore.use.setIminstance()
  const setConversationList = useImStore.use.setConversationList()
  const conversationList = useImStore.use.conversationList()
  const messageMap = useImStore.use.messageMap()
  const setMessageMapById = useImStore.use.setMessageMapById()

  console.log(location.href, '44444444444444444')

  const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP

  const lastTab = Taro.getStorageSync('lastTab')
  console.log(lastTab, 'lastTablastTablastTablastTablastTab')

  const getImUserInfo = useCallback(async () => {
    const res = await request<IDataResponse<IIMUserInfo>, IGetOptionsWithoutParams>('/im/userSig', {
      method: 'GET',
    })
    console.log(res, 'getImUserInfo')
    setIMUserInfo(res.data)
  }, [token])

  useEffect(() => {
    console.log(isSDKReady, 'isSDKReady  Taro.SubPackageTaro.SubPackageTaro.SubPackage')

    if (IMUserInfo && isSDKReady && utils.imSdk && token) {
      console.log(utils.imSdk, 'utils.imSdk')
      const im = utils.imSdk(
        {
          appId: IMUserInfo.appId,
          userId: IMUserInfo.userId,
          userSig: IMUserInfo.userSig,
        },
        {
          onImLogin: (isImLogin: boolean) => {
            console.log(isImLogin, 'isImLogin')
          },
          onSDKReady: (eventName: string) => {
            console.log(eventName, 'eventName')
          },
          onSDKNotReady: (eventName: string) => {
            console.log(eventName, 'eventName')
          },
          onMessage: (conversationId: string, item: any) => {
            console.log(conversationId, 'msg', item)
            console.log('msgItems', item)
            const msgItems = item[conversationId]

            if (msgItems) {
              const list = getMessageList(conversationId)
              if (list) {
                setMessageMapById(conversationId, [...list, ...msgItems])
              }
            }
          },
          onMessageReaded: (msg: any, msgList: any) => {
            console.log(msg, 'msg', msgList)
          },
          onUpdateRoomNum: (num: number) => {
            console.log(num, 'num')
          },
          onConversationList: (list: any) => {
            console.log(list, 'setConversationList')

            setConversationList(list)
          },
        }
      )
      setIminstance(im)
    }
  }, [IMUserInfo, isSDKReady, token])

  useEffect(() => {
    // setRedirect({ url: '/pages/login/index' })
    console.log(Taro.SubPackage, 'Taro.SubPackage')

    if (token) {
      requestInstance.setHeaders({
        Authorization: `Bearer ${token}`,
      })
      getImUserInfo()
    } else {
      console.log(im, 'im00000000')

      im?.destroy?.()
    }
  }, [token, getImUserInfo])

  useEffect(() => {
    useImStoreReset()
    Taro.getEnv() === Taro.ENV_TYPE.WEAPP
      ? __non_webpack_require__.async('../../im-sdk/pages/blank/index')
      : import('../../im-sdk/pages/blank/index')
    utils.onIMSDKReady(() => {
      console.log('onIMSDKReady')
      setIsSDKReady(true)
    })
    return () => {
      console.log(im, 'im11111111111111')

      im?.destroy?.()
    }
  }, [])

  const basename = isWeapp ? '/pages/index/index' : undefined

  return (
    <ConfigProvider
      id="page-index"
      theme={{
        nutuiSearchbarBackground: 'transparent',
        nutuiSearchbarContentBackground: '#eee',
        nutuiSearchbarInputTextAlign: 'left',
        nutuiSearchbarPadding: '0',
      }}
    >
      <View style={{ color: 'transparent' }}></View>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="*" element={<AuthRoute />}>
            <Route path="factory" element={<Factory />}></Route>
            <Route path="shop/:shopId" element={<View>店铺</View>}></Route>
            <Route path="message" element={<Message />}></Route>
            <Route path="moments" element={<Moments />}></Route>
            <Route path="magazine" element={<Magazine />}></Route>
            <Route path="mine" element={<Mine />}></Route>
            <Route path="login" element={<Login />}></Route>
            <Route index element={<Navigate to={lastTab || '/factory'} />}></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

function NotFound() {
  return <View>404</View>
}
