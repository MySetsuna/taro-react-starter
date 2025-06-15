import { TABBAR_HEIGHT } from '@/config'
import { utils } from '@/libs'
import { useImStore, useMessageMapById, useUserStore } from '@/models'
import { Add, ArrowLeft, Dongdong, Phone, Plus, Top, VolumeMax } from '@nutui/icons-react-taro'
import {
  Avatar,
  Badge,
  Button,
  Empty,
  Image,
  InfiniteLoading,
  Input,
  Loading,
  NavBar,
  Overlay,
  TextArea,
  VirtualList,
} from '@nutui/nutui-react-taro'
import { View, Text, ScrollView, WebView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useRef, useEffect, CSSProperties, useLayoutEffect } from 'react'
import { emojis } from '../../tabs/message/emoji/data'
import './index.scss'
import { useNavTitle } from '@/hooks'
import { request } from '@/api'
import { IDataResponse, IRequestOptionsWithType } from 'types/http'

const Chat: React.FC = () => {
  const params = Taro.getCurrentInstance().router?.params
  const sendId = params?.sendId
  const companyName = params?.companyName
  const type = params?.type
  const avatar = params?.avatar
  const cID = params?.conversationID

  const tim = useImStore.use.im()
  const timUser = useUserStore.use.IMUserInfo()
  const [conversationID, setConversationID] = useState(cID)
  const [messageToImId, setMessageToImId] = useState(sendId)

  const fullHeight = Taro.getWindowInfo().windowHeight

  const [showMore, setShowMore] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [isOnInput, setIsOnInput] = useState(false)

  const [scrollTop, setScrollTop] = useState(99999)
  console.log(scrollTop, 'scrollTopscrollTopscrollTop')

  // 发送信息
  const [sendMsg, setSendMsg] = useState('' as any)
  // im实时聊天数据
  const [toView, setToView] = useState('' as any)
  // 用于续拉，分页续拉时需传入该字段。
  const [nextReqMessageID, setNextReqMessageID] = useState('' as any)
  // 表示是否已经拉完所有消息。
  const [isCompleted, setIsCompleted] = useState('' as any)

  // 消息列表
  const [myMessages, setMyMessages] = useMessageMapById(conversationID)
  const [more_text, setmore_text] = useState('')
  const [is_lock, setis_lock] = useState(true)

  // 语音操作
  const [title, settitle] = useState('正在录音')
  const [isRecording, setisRecording] = useState(false)

  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollIntoView, setScrollIntoView] = useState('')

  const [openFileUpload, setOpenFileUpload] = useState(false)
  const token = useUserStore.use.token()
  const loginInfo = useUserStore.use.loginInfo()
  const baseUrl = process.env.TARO_APP_API
  const backUrl = `chat${location.search}`

  console.log(myMessages, 'myMessages')

  const scrollToBottom = (num?: number) => {
    setScrollTop((prev) => prev + (num || 1))
  }

  const sendMessageFun = (message, type) => {
    const promise = tim.sendMessage(message)
    promise.then((imResponse) => {
      // 发送成功
      setMessageRead()
      setMyMessages((prev) => [...prev, imResponse.data.message])
      setSendMsg('')
      setShowEmoji(false)
      scrollToBottom()
    })
  }

  const setMessageRead = async () => {
    const res = await tim.setMessageRead({
      conversationID,
    })
    console.log(res, 'setMessageRead imResponse')
  }

  // 拉取会话列表
  const getMsgList = async (nextReqMessageID?: string) => {
    const param = {
      //sendId 为对方id
      conversationID,
      count: 15,
      nextReqMessageID,
    }
    const promise = tim.getMessageList(param)

    promise
      .then((imResponse) => {
        const messageList = imResponse.data.messageList // 消息列表。
        // 处理自定义的消息
        messageList.forEach((event) => {
          if (event.type === 'TIMCustomElem') {
            if (typeof event.payload.data === 'string' && event.payload.data) {
              const new_data = JSON.parse(event.payload.data)
              event.payload.data = new_data
            }
          }
        })
        const newNextReqMessageID = imResponse.data.nextReqMessageID // 用于续拉，分页续拉时需传入该字段。
        const newIsCompleted = imResponse.data.isCompleted // 表示是否已经拉完所有消息。
        // 将某会话下所有未读消息已读上报
        setMessageRead()
        console.log(messageList, 'messageListmessageListmessageList')

        setMyMessages((prev) => (nextReqMessageID ? [...messageList, ...prev] : messageList))
        if (nextReqMessageID) {
          // setScrollTop(0)
          // setScrollTop(scrollHeight)
          if (messageList[0]) {
            const scrollId = `scroll-${messageList[messageList.length - 1].ID}`
            setScrollIntoView(scrollId)
          }
        } else {
          console.log('scrollToBottom ', nextReqMessageID, 'nextReqMessageID')

          scrollToBottom()
        }
        setIsCompleted(newIsCompleted)
        setNextReqMessageID(newNextReqMessageID)
        setmore_text(newIsCompleted ? '没有更多了' : '下拉查看更多历史信息')
      })
      .catch((imError) => {
        console.warn('getConversationList error:', imError) // 获取会话列表失败的相关信息
      })
      .finally(() => {
        setIsLoaded(true)
      })
  }

  // 发送消息
  const handleSend = (msg?: string) => {
    if (is_lock) {
      setis_lock(false)
      if ((msg ?? sendMsg).length === 0) {
        Taro.showToast({
          title: '消息不能为空!',
          icon: 'none',
        })
        setis_lock(true)
        return
      }

      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 200,
      })

      const content = {
        text: msg ?? sendMsg,
      }

      const options = {
        to: messageToImId, // 消息的接收方
        conversationType: type === 'GROUP' ? utils.TIM_TYPES.CONV_GROUP : utils.TIM_TYPES.CONV_C2C, // 会话类型取值timStore.tim.TYPES.CONV_C2C或timStore.tim.TYPES.CONV_GROUP
        payload: content, // 消息内容的容器
      }
      // // 发送文本消息，Web 端与小程序端相同
      // 1. 创建消息实例，接口返回的实例可以上屏
      const message = tim.createTextMessage(options)
      // 2. 发送消息
      sendMessageFun(message, 'text')
    }
  }

  const msgDisplay = (item) => {
    if (item.type === 'TIMTextElem') {
      return item.payload.text
    }
  }

  const initConversation = async (sendId: string) => {
    const conversationID = await buildConversation(sendId)
    setConversationID(conversationID[0])
    setMessageToImId(conversationID[1])
  }

  const buildConversation = async (sendId: string) => {
    const res = await request<IDataResponse<{ imUserId: string }>, IRequestOptionsWithType>(`/app/im/agent/${sendId}`, {
      method: 'GET',
    })
    console.log(res, 'getImUserInfo')
    // setIMUserInfo(res.data)
    const imUserId = res.data.imUserId || sendId
    const groupID = `${sendId}_${timUser.userId}`
    const conversationID = type === 'C2C' ? `${type}${imUserId}` : `${type}${groupID}`
    const isGroup = type === 'GROUP'

    if (!isGroup) {
      return [conversationID, imUserId]
    }

    console.log(groupID, 'groupID')

    const groupRes = await tim.getGroupList()
    if (groupRes.data.groupList.some((item) => `${type}${item.groupID}` === conversationID)) {
      return [conversationID, groupID]
    }
    console.log(groupRes, 'groupRes')

    const createGroupRes = await tim.createGroup({
      type: utils.TIM_TYPES.GRP_WORK,
      groupID,
      name: `${companyName}_${timUser.userId}`,
      avatar,
      memberList: [
        {
          userID: imUserId,
          role: 'Admin',
        },
        {
          userID: timUser.userId,
        },
      ], // 如果填写了 memberList，则必须填写 userID
    })
    console.log(createGroupRes, 'createGroupRes')

    return [conversationID, groupID]
  }

  useEffect(() => {
    setMyMessages([])
    return () => {
      setMyMessages(undefined)
    }
  }, [])

  // 模拟初始消息
  useEffect(() => {
    if (tim && conversationID && !myMessages.length) {
      console.log(
        'tim',
        tim,
        conversationID,
        'agentImIdagentImIdagentImIdagentImIdagentImIdagentImIdagentImIdagentImIdagentImId'
      )

      getMsgList()
    }
    if (myMessages.length) {
      setMessageRead()
    }
  }, [tim, conversationID, myMessages])

  useEffect(() => {
    if (sendId && !conversationID) {
      console.log(sendId, 'sendId    ============= conversationID')
      initConversation(sendId)
    }
  }, [sendId, conversationID])

  console.log(scrollIntoView, 'scrollIntoViewscrollIntoViewscrollIntoView')

  return (
    <View className="msg-room  flex flex-col h-[100vh]">
      <View className="h-[58Px] z-50 sticky top-0 flex shrink-0 items-center justify-center border-0 !border-b border-solid border-[#b9b8b8] bg-gray-50">
        <NavBar
          onBackClick={() => {
            Taro.navigateTo({ url: `/pages/shop/index?sendId=${sendId}` })
          }}
          back={
            <Button type="primary" size="mini">
              店铺
            </Button>
          }
          right={
            <View>
              <Phone
                className="text-red-500 active:text-red-400"
                onClick={() => {
                  // Taro.makePhoneCall({
                  //   phoneNumber: sendId,
                  // })
                }}
              />
            </View>
          }
          title={companyName}
        >
          <View>Taro UI</View>
        </NavBar>
      </View>

      <ScrollView
        // style={{
        //   height: `calc(${sc.windowHeight}px - ${Taro.pxTransform(308)})`,
        // }}
        // onRefresh={() => {
        //   return getMsgList(nextReqMessageID)
        // }}
        // onScroll={(event) => {
        //   console.log(event, 'event scrollTop', scrollTop)
        //   setScrollHeight((prev) => {
        //     if (prev !== event.detail.scrollHeight) {
        //       setScrollTop(event.detail.scrollHeight - prev)
        //       return event.detail.scrollHeight
        //     }
        //     return event.detail.scrollHeight
        //   })
        // }}
        onScrollToUpper={(event) => {
          console.log(event, 'event 2333333333333', scrollTop)

          if (!isCompleted && nextReqMessageID) getMsgList(nextReqMessageID)
        }}
        style={{
          height: `${fullHeight - 94 - 58}Px !important`,
        }}
        scrollIntoViewAlignment="start"
        scrollIntoView={scrollIntoView}
        upperThreshold={100}
        scrollTop={scrollTop}
        enhanced
        enableFlex
        showScrollbar={false}
        onClick={() => {
          setShowEmoji(false)
          setShowMore(false)
          Taro.pageScrollTo({
            scrollTop: 0,
            duration: 200,
          })
        }}
        className="chat-scroll pl-3 pr-3 box-border bg-gray-50"
        scrollY
      >
        <View className="chat-c flex flex-col gap-2 pb-3 pt-3 items-end ">
          {myMessages
            .filter((item) => !!item)
            .map((item) => (
              <View
                id={`scroll-${item.ID}`}
                key={item.ID}
                className={`flex gap-2 max-w-[89%]  ${timUser.userId === item.from ? 'justify-end' : 'flex-row-reverse mr-auto'}`}
              >
                <View className="chat-r">
                  {/* <View className="chat-name">{item.nick}</View> */}
                  <View className="chat-text">
                    <View
                      className={`chat-text-bg box-border rounded leading-[24Px] min-h-[40Px] min-w-[40Px] p-2 ${timUser.userId === item.from ? 'bg-red-100' : 'bg-white'}`}
                    >
                      {/* <Image src="" className="tel-img"></Image> */}
                      <Text className=" select-text">{msgDisplay(item)}</Text>
                    </View>
                  </View>
                </View>
                <View className="chat-l">
                  <Avatar shape="square" src={item.avatar}></Avatar>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>

      {/* <Overlay visible={!isLoaded}>
        <Loading />
      </Overlay> */}
      <View
        style={{
          top: `${fullHeight - 94}Px`,
        }}
        className="footer flex absolute flex-col shrink-0 w-full bg-gray-100  p-3 pt-1 pb-8 box-border text-red-500"
      >
        <View className="flex items-center gap-3">
          <VolumeMax size={24} />
          <View
            className="chat-input flex-auto flex items-center relative shrink-0 min-h-[40PX]"
            style={
              {
                ['--nutui-textarea-padding']: '8px 40px 8px 8px',
              } as CSSProperties
            }
          >
            <TextArea
              autoSize
              placeholder=""
              name="value1"
              value={sendMsg}
              onChange={(value) => setSendMsg(value)}
              onConfirm={() => handleSend()}
              onFocus={() => {
                setShowMore(false)
                setShowEmoji(false)
                setIsOnInput(true)
                Taro.pageScrollTo({
                  scrollTop: 0,
                  duration: 200,
                })
              }}
              onBlur={() => {
                setIsOnInput(false)
              }}
              className=" pr-10 box-border"
              style={{
                maxHeight: '48Px',
                height: '32Px !important',
                lineHeight: '24Px',
              }}
            />

            <View className=" absolute w-0 right-0">
              {isOnInput ? (
                <Button type="primary" size="mini" className="relative left-[-32Px]">
                  键盘
                </Button>
              ) : (
                <Dongdong
                  className=" relative left-[-32Px]"
                  size={24}
                  onClick={() => {
                    setShowEmoji(true)
                    setShowMore(false)
                    Taro.pageScrollTo({
                      scrollTop: 307,
                      duration: 200,
                    })
                  }}
                />
              )}
            </View>
          </View>
          <View className="flex items-center justify-center rounded-full border-solid border-red-500 box-border border">
            <Add
              size={20}
              onClick={() => {
                setShowMore(true)
                setShowEmoji(false)
                Taro.pageScrollTo({
                  scrollTop: 250,
                  duration: 200,
                })
              }}
            />
          </View>
          <Top onClick={() => handleSend()} />
        </View>
        <View
          className={`mt-2 border-0 !border-t border-solid border-[#e2e2e2] transition-all  ${showMore ? 'h-[250Px] opacity-100' : 'h-0 opacity-0 pointer-events-none'}`}
        >
          <Button
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/file-upload/index?backUrl=${encodeURIComponent(`chat${location.search}`)}`,
              })
              // setOpenFileUpload(true)
            }}
          >
            大文件上传
          </Button>
        </View>
        <View
          className={`chat-emojis pt-2 transition-all  ${showEmoji ? 'h-[307Px] opacity-100' : 'h-0 opacity-0 pointer-events-none'}`}
        >
          <VirtualList
            style={{ height: '307Px' }}
            itemHeight={40}
            list={emojis}
            itemRender={(emojiArr, dataIndex) => {
              return (
                <View key={dataIndex} className="flex  justify-around">
                  {emojiArr.map((emoji) => {
                    return (
                      <View
                        key={emoji}
                        className="h-[40Px] w-[40Px] rounded active:bg-red-200 flex items-center justify-center "
                        onClick={() => {
                          setSendMsg((prev) => prev + emoji)
                        }}
                      >
                        {emoji}
                      </View>
                    )
                  })}
                </View>
              )
            }}
            itemEqual={true}
          />
        </View>
      </View>
      {openFileUpload && (
        <WebView
          src={`http://26.26.26.1:10086/#/pages/index/index?clientId=${loginInfo.client_id}&token=${token}&baseUrl=${baseUrl}&backUrl=${backUrl}`}
          onMessage={(event) => {
            console.log(event, 'event')
            setOpenFileUpload(false)
          }}
        />
      )}
    </View>
  )
}
//border-0 !border-b border-solid border-[#e2e2e2]
export default useNavTitle(Chat, '消息')
