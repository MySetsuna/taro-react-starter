import { useUserStore } from '@/models'
import Taro, { useLaunch } from '@tarojs/taro'
import Factory from '@/tabs/factory'
import Message from '@/tabs/message'
import Moments from '@/tabs/moments'
import Magazine from '@/tabs/magazine'
import Mine from '@/tabs/mine'
import { ConfigProvider } from '@nutui/nutui-react-taro'
import { View } from '@tarojs/components'

import './index.scss'
import { request, requestInstance } from '@/api'
import { useCallback, useEffect, useState } from 'react'
import { getMessageList, useImStore, useImStoreReset } from '@/models/im'
import { utils } from '@/libs'
import { IDataResponse, IGetOptionsWithoutParams } from 'types/http'
import { IIMUserInfo } from 'types/im'

export default function Index() {
  const setIsSDKReady = useImStore.use.setIsSDKReady()
  const im = useImStore.use.im()
  const token = useUserStore.use.token()
  const setIMUserInfo = useUserStore.use.setIMUserInfo()
  const IMUserInfo = useUserStore.use.IMUserInfo()
  const isSDKReady = useImStore.use.isSDKReady()
  const setIminstance = useImStore.use.setIminstance()
  const setConversationList = useImStore.use.setConversationList()
  const setIsImLogin = useImStore.use.setIsImLogin()
  const setMessageMapById = useImStore.use.setMessageMapById()
  const setIsImConnectReady = useImStore.use.setIsImConnectReady()

  const [currentTab, setCurrentTab] = useState('factory')

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
            setIsImLogin(isImLogin)
          },
          onSDKReady: (eventName: string) => {
            console.log(eventName, 'eventName')
            setIsImConnectReady(true)
          },
          onSDKNotReady: (eventName: string) => {
            console.log(eventName, 'eventName')
            setIsImConnectReady(false)
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
          onMessageReaded: (conversationID: any) => {
            console.log(conversationID, 'conversationID', 'onMessageReaded')
            // im.setMessageRead({
            //   conversationID,
            // })
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

  // 渲染当前选中的页面
  const renderCurrentPage = () => {
    switch (currentTab) {
      case 'factory':
        return <Factory />
      case 'message':
        return <Message />
      case 'moments':
        return <Moments />
      case 'magazine':
        return <Magazine />
      case 'mine':
        return <Mine />
      default:
        return <Factory />
    }
  }

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
      {renderCurrentPage()}
    </ConfigProvider>
  )
}
