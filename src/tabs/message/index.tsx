import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { Image } from '@nutui/nutui-react-taro'
import { TabBar } from '@/tab-bar'
import { useImStore, useUserStore } from '@/models'
import { useCallback, useEffect } from 'react'
import { IDataResponse, IGetOptionsWithoutParams, IGetOptions, IPostOptions, IResponse } from 'types/http'
import { IIMUserInfo } from 'types/im'
import { request } from '@/api'
import { utils } from '@/libs'

function Message() {
  const token = useUserStore.use.token()
  const setIMUserInfo = useUserStore.use.setIMUserInfo()
  const IMUserInfo = useUserStore.use.IMUserInfo()
  const isSDKReady = useImStore.use.isSDKReady()

  const getImUserInfo = useCallback(async () => {
    const res = await request<IDataResponse<IIMUserInfo>, IGetOptionsWithoutParams>('/im/userSig', {
      method: 'GET',
    })
    console.log(res, 'getImUserInfo')
    setIMUserInfo(res.data)
  }, [token])
  useEffect(() => {
    getImUserInfo()
  }, [getImUserInfo])

  useEffect(() => {
    console.log(isSDKReady, 'isSDKReady  Taro.SubPackageTaro.SubPackageTaro.SubPackage')

    if (IMUserInfo && isSDKReady) {
      console.log(utils.imSdk, 'utils.imSdk')
      utils.imSdk?.(
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
          onMessage: (msg: any, msgList: any) => {
            console.log(msg, 'msg', msgList)
          },
          onMessageReaded: (msg: any, msgList: any) => {
            console.log(msg, 'msg', msgList)
          },
          onUpdateRoomNum: (num: number) => {
            console.log(num, 'num')
          },
          onConversationList: (list: any) => {
            console.log(list, 'list')
          },
        }
      )
    }
  }, [IMUserInfo, isSDKReady])

  return (
    <>
      <View className="message">
        <View className="message-list">
          <View className="message-item">
            <Image className="avatar" src="default-avatar.png" />
            <View className="content">
              <View className="title">智忠标牌厂</View>
              <View className="preview">您好,请问有什么可以帮您?</View>
            </View>
            <View className="time">12:30</View>
          </View>
        </View>
      </View>
      <TabBar />
    </>
  )
}

export default Message
