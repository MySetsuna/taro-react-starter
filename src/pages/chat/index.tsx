import { TABBAR_HEIGHT } from '@/config'
import { utils } from '@/libs'
import { useImStore, useMessageMapById, useUserStore } from '@/models'
import {
  Add,
  ArrowLeft,
  Dongdong,
  Phone,
  Plus,
  Top,
  VolumeMax,
  Image as ImageIcon,
  Video,
} from '@nutui/icons-react-taro'
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
  CircleProgress,
} from '@nutui/nutui-react-taro'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useRef, useEffect, CSSProperties } from 'react'
import { emojis } from '../../tabs/message/emoji/data'
import './index.scss'
import { useNavTitle } from '@/hooks'
import { request } from '@/api'
import { IDataResponse, IRequestOptionsWithType } from 'types/http'
import SoundMessage from '@/components/SoundMessage'

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
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const recordingTimer = useRef<NodeJS.Timeout>()
  const recorderManager = useRef(Taro.getRecorderManager())
  const [showRecordingOverlay, setShowRecordingOverlay] = useState(false)
  const [recordingStatus, setRecordingStatus] = useState<'recording' | 'cancel'>('recording')
  const [touchStartY, setTouchStartY] = useState(0)
  const [isInCancelArea, setIsInCancelArea] = useState(false)
  const shouldSendMessage = useRef(true)
  const MAX_RECORDING_TIME = 60 // 最大录音时间60秒

  const [scrollTop, setScrollTop] = useState(99999)
  const [sendMsg, setSendMsg] = useState('')
  const [toView, setToView] = useState('')
  const [nextReqMessageID, setNextReqMessageID] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [myMessages, setMyMessages] = useMessageMapById(conversationID)
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollIntoView, setScrollIntoView] = useState('')
  const [is_lock, setis_lock] = useState(true)
  const [isClosing, setIsClosing] = useState(false)

  const token = useUserStore.use.token()
  const baseUrl = process.env.TARO_APP_API

  const textAreaRef = useRef<any>(null)

  const [progress, setProgress] = useState(0)
  console.log(myMessages, 'myMessages')

  // 播放音效
  const playSound = (type: 'start' | 'cancel' | 'end') => {
    const innerAudioContext = Taro.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = `/assets/sounds/${type}.mp3`
    innerAudioContext.onError((res) => {
      console.error('播放音效失败:', res)
    })
  }

  // 触发震动
  const vibrate = (type: 'short' | 'long' = 'short') => {
    Taro.vibrateShort({
      type: type === 'short' ? 'light' : 'medium',
      success: () => {
        console.log('震动成功')
      },
      fail: (error) => {
        console.error('震动失败:', error)
      },
    })
  }

  // 开始录音
  const startRecording = async (e) => {
    try {
      const touch = e.touches[0]
      setTouchStartY(touch.clientY)
      setIsRecording(true)
      setIsInCancelArea(false)
      setShowRecordingOverlay(true)
      setRecordingStatus('recording')
      setRecordingTime(0)
      shouldSendMessage.current = true
      playSound('start')
      vibrate('short')

      recordingTimer.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1
          if (newTime >= MAX_RECORDING_TIME) {
            // 达到最大录音时间，自动停止并发送
            stopRecording()
          }
          return newTime
        })
      }, 1000)

      recorderManager.current.onStart(() => {
        console.log('录音开始')
      })

      recorderManager.current.onStop((res) => {
        if (!shouldSendMessage.current) {
          playSound('cancel')
          vibrate('long')
          return
        }
        playSound('end')
        vibrate('short')
        const { tempFilePath } = res
        handleVoiceUpload(tempFilePath)
      })

      recorderManager.current.onError((error) => {
        console.error('录音失败:', error)
        Taro.showToast({
          title: '录音失败',
          icon: 'none',
        })
        stopRecording()
      })

      recorderManager.current.start({
        duration: MAX_RECORDING_TIME * 1000, // 设置最大录音时间为60秒
        sampleRate: 44100,
        numberOfChannels: 1,
        encodeBitRate: 192000,
        format: 'mp3',
      })
    } catch (error) {
      console.error('录音失败:', error)
      Taro.showToast({
        title: '录音失败',
        icon: 'none',
      })
      stopRecording()
    }
  }

  // 创建多媒体消息
  const createMediaMessage = (file: any, mediaType: 'image' | 'video' | 'voice') => {
    const conversationType = type === 'GROUP' ? utils.TIM_TYPES.CONV_GROUP : utils.TIM_TYPES.CONV_C2C
    let message
    console.log(file, 'filefilefile')

    switch (mediaType) {
      case 'image':
        message = tim.createImageMessage({
          to: messageToImId,
          conversationType,
          payload: {
            file,
          },
          onProgress(event) {
            setProgress(event)
          },
        })
        break
      case 'video':
        message = tim.createVideoMessage({
          to: messageToImId,
          conversationType,
          payload: {
            file,
          },
        })
        break
      case 'voice':
        message = tim.createAudioMessage({
          to: messageToImId,
          conversationType,
          payload: {
            file,
          },
        })
        break
    }
    console.log(message, 'send message ')

    if (message) {
      sendMessageFun(message, mediaType)
    }
  }

  // 处理语音上传
  const handleVoiceUpload = (tempFilePath: string) => {
    createMediaMessage(
      {
        path: tempFilePath,
        duration: recordingTime,
      },
      'voice'
    )
  }

  // 停止录音
  const stopRecording = () => {
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current)
    }
    if (shouldSendMessage.current) {
      setShowRecordingOverlay(false)
      setIsInCancelArea(false)
      recorderManager.current.stop()
      setTimeout(() => {
        setRecordingTime(0)
      }, 800)
    } else {
      // 取消发送时，立即显示取消状态，然后快速渐变关闭
      setIsClosing(true)
      setShowRecordingOverlay(false)
      recorderManager.current.stop()
      setTimeout(() => {
        setRecordingTime(0)
        setIsClosing(false)
      }, 800)
    }
  }

  // 取消录音
  const cancelRecording = () => {
    shouldSendMessage.current = false
    setRecordingStatus('cancel')
    stopRecording()
  }

  // 处理触摸移动
  const handleTouchMove = (e) => {
    const touch = e.touches[0]
    const { clientY } = touch
    const moveDistance = clientY - touchStartY

    if (moveDistance < -50) {
      if (!isInCancelArea) {
        setIsInCancelArea(true)
        vibrate('short')
      }
      setRecordingStatus('cancel')
      shouldSendMessage.current = false
    } else {
      if (isInCancelArea) {
        setIsInCancelArea(false)
        vibrate('short')
      }
      setRecordingStatus('recording')
      shouldSendMessage.current = true
    }
  }

  // 选择图片
  const chooseImage = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 9,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      })

      createMediaMessage(res, 'image')
    } catch (error) {
      console.error('选择图片失败:', error)
      Taro.showToast({
        title: '选择图片失败',
        icon: 'none',
      })
    }
  }

  // 选择视频
  const chooseVideo = async () => {
    try {
      const res = await Taro.chooseVideo({
        sourceType: ['album', 'camera'],
        compressed: true,
        maxDuration: 60,
      })

      createMediaMessage(
        {
          path: res.tempFilePath,
          duration: res.duration,
        },
        'video'
      )
    } catch (error) {
      console.error('选择视频失败:', error)
      Taro.showToast({
        title: '选择视频失败',
        icon: 'none',
      })
    }
  }

  // 选择文件
  const chooseFile = async () => {
    try {
      const res = await Taro.chooseMessageFile({
        count: 1,
        type: 'file',
      })

      const file = res.tempFiles[0]
      const message = tim.createCustomMessage({
        to: messageToImId,
        conversationType: type === 'GROUP' ? utils.TIM_TYPES.CONV_GROUP : utils.TIM_TYPES.CONV_C2C,
        payload: {
          data: JSON.stringify({
            type: 'file',
            path: file.path,
            name: file.name,
            size: file.size,
          }),
        },
      })
      sendMessageFun(message, 'file')
    } catch (error) {
      console.error('选择文件失败:', error)
      Taro.showToast({
        title: '选择文件失败',
        icon: 'none',
      })
    }
  }

  const chooseBigFile = () => {
    Taro.navigateTo({
      url: `/pages/file-upload/index?backUrl=${encodeURIComponent(`chat${location.search}`)}`,
    })
  }

  const sendMessageFun = (message, type) => {
    const promise = tim.sendMessage(message)
    promise.then((imResponse) => {
      setMessageRead()
      setMyMessages((prev) => [...prev, imResponse.data.message])
      setSendMsg('')
      setShowEmoji(false)
      scrollToBottom()
    })
  }

  const setMessageRead = async () => {
    await tim.setMessageRead({
      conversationID,
    })
  }

  // 拉取会话列表
  const getMsgList = async (nextReqMessageID?: string) => {
    const param = {
      conversationID,
      count: 15,
      nextReqMessageID,
    }
    const promise = tim.getMessageList(param)

    promise
      .then((imResponse) => {
        const messageList = imResponse.data.messageList

        const newNextReqMessageID = imResponse.data.nextReqMessageID
        const newIsCompleted = imResponse.data.isCompleted
        setMessageRead()

        setMyMessages((prev) => (nextReqMessageID ? [...messageList, ...prev] : messageList))
        if (nextReqMessageID) {
          if (messageList[0]) {
            const scrollId = `scroll-${messageList[messageList.length - 1].ID}`
            setScrollIntoView(scrollId)
          }
        } else {
          scrollToBottom()
        }
        setIsCompleted(newIsCompleted)
        setNextReqMessageID(newNextReqMessageID)
      })
      .catch((imError) => {
        console.warn('getConversationList error:', imError)
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
        to: messageToImId,
        conversationType: type === 'GROUP' ? utils.TIM_TYPES.CONV_GROUP : utils.TIM_TYPES.CONV_C2C,
        payload: content,
      }

      const message = tim.createTextMessage(options)
      sendMessageFun(message, 'text')
    }
  }

  const msgDisplay = (item) => {
    switch (item.type) {
      case 'TIMTextElem':
        return <Text className="select-text">{item.payload.text}</Text>
      case 'TIMImageElem':
        return (
          <Image src={item.payload.imageInfoArray[0].url} mode="aspectFit" className="max-w-[200px] max-h-[200px]" />
        )
      case 'TIMSoundElem':
        return (
          <SoundMessage
            url={item.payload.url}
            duration={item.payload.second}
            onConvertVoiceToText={async () => {
              const res = await tim.convertVoiceToText({ message: item })
              return res.data.result
            }}
          />
        )
      case 'TIMVideoElem':
        return <Video svgSrc={item.payload.videoUrl} className="max-w-[200px] max-h-[200px]" />
      case 'TIMCustomElem':
        const data = item.payload.data
        switch (data.type) {
          case 'voice':
            return (
              <View className="flex items-center">
                <VolumeMax size={20} />
                <Text>{data.duration}s</Text>
              </View>
            )
          case 'file':
            return (
              <View className="flex items-center">
                <Top size={20} />
                <Text>{data.name}</Text>
              </View>
            )
          default:
            return null
        }
      default:
        return null
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
    const imUserId = res.data.imUserId || sendId
    const groupID = `${sendId}_${timUser.userId}`
    const conversationID = type === 'C2C' ? `${type}${imUserId}` : `${type}${groupID}`
    const isGroup = type === 'GROUP'

    if (!isGroup) {
      return [conversationID, imUserId]
    }

    const groupRes = await tim.getGroupList()
    if (groupRes.data.groupList.some((item) => `${type}${item.groupID}` === conversationID)) {
      return [conversationID, groupID]
    }

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
      ],
    })

    return [conversationID, groupID]
  }

  const scrollToBottom = (num?: number) => {
    setScrollTop((prev) => prev + (num || 1))
  }

  const handleScrollToUpper = () => {
    if (!isCompleted && nextReqMessageID) {
      getMsgList(nextReqMessageID)
    }
  }

  const handleScrollClick = () => {
    setShowEmoji(false)
    setShowMore(false)
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 200,
    })
  }

  const handleEmojiClick = () => {
    setShowEmoji(true)
    setShowMore(false)
    setIsRecording(false)
    Taro.pageScrollTo({
      scrollTop: 307,
      duration: 200,
    })
  }

  const handleMoreClick = () => {
    setShowMore(true)
    setShowEmoji(false)
    setIsRecording(false)
    Taro.pageScrollTo({
      scrollTop: 250,
      duration: 200,
    })
  }

  const handleKeyboardClick = () => {
    setIsRecording(false)
    Taro.pageScrollTo({
      scrollTop: 20,
      duration: 200,
    })
    setTimeout(() => {
      textAreaRef.current.focus()
    }, 100)
  }

  const handleTextAreaFocus = () => {
    setShowMore(false)
    setShowEmoji(false)
    setIsOnInput(true)
    Taro.pageScrollTo({
      scrollTop: 20,
      duration: 200,
    })
  }

  const handleTextAreaBlur = () => {
    setIsOnInput(false)
  }

  const handleEmojiSelect = (emoji: string) => {
    setSendMsg((prev) => prev + emoji)
  }

  const handleVoiceClick = () => {
    setIsRecording(true)
    setShowEmoji(false)
    setShowMore(false)
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 200,
    })
  }

  useEffect(() => {
    setMyMessages([])
    return () => {
      setMyMessages(undefined)
    }
  }, [])

  useEffect(() => {
    if (tim && conversationID && !myMessages.length) {
      getMsgList()
    }
    if (myMessages.length) {
      setMessageRead()
    }
  }, [tim, conversationID, myMessages])

  useEffect(() => {
    if (sendId && !conversationID) {
      initConversation(sendId)
    }
  }, [sendId, conversationID])

  return (
    <View className="msg-room flex flex-col h-[100vh]">
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
                  Taro.makePhoneCall({
                    phoneNumber: sendId,
                  })
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
        onScrollToUpper={handleScrollToUpper}
        style={{
          height: `${fullHeight - 94 - 58}Px !important`,
        }}
        scrollIntoViewAlignment="nearest"
        scrollIntoView={scrollIntoView}
        upperThreshold={100}
        scrollTop={scrollTop}
        enhanced
        enableFlex
        showScrollbar={false}
        onClick={handleScrollClick}
        className="chat-scroll pl-3 pr-3 box-border bg-gray-50"
        scrollY
      >
        <View className="chat-c flex flex-col gap-2 pb-3 pt-3 items-end">
          {myMessages
            .filter((item) => !!item)
            .map((item) => (
              <View
                id={`scroll-${item.ID}`}
                key={item.ID}
                className={`flex gap-2 max-w-[89%]  ${timUser.userId === item.from ? 'justify-end' : 'flex-row-reverse mr-auto'}`}
              >
                <View className="chat-r">
                  <View className="chat-text">
                    <View
                      className={`chat-text-bg box-border rounded leading-[24Px] min-h-[40Px] min-w-[40Px] p-2 ${timUser.userId === item.from ? 'bg-red-100' : 'bg-white'}`}
                    >
                      {msgDisplay(item)}
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

      <Overlay visible={showRecordingOverlay} zIndex={1000}>
        <View className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <View
            className={`bg-white rounded-lg p-8 flex flex-col items-center transition-opacity duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
          >
            <View className="relative w-[100Px] h-[100Px] mb-4 flex items-center justify-center">
              <View
                className={`w-[94Px] h-[94Px] absolute rounded-full ${isInCancelArea ? 'bg-gray-500' : 'bg-red-100'} flex items-center justify-center transition-colors duration-200 shrink-0`}
              >
                {isInCancelArea ? (
                  <View className="text-white text-4xl">×</View>
                ) : (
                  <VolumeMax size={48} color="#ff0f23" />
                )}
              </View>
              <CircleProgress
                percent={(recordingTime / MAX_RECORDING_TIME) * 100}
                strokeWidth={4}
                radius={50}
                color={!isInCancelArea ? '#ff0f23' : 'black'}
                background="transparent"
                className="shrink-0 z-50 w-[100Px] h-[100Px] absolute top-0 left-0"
              ></CircleProgress>
            </View>
            <Text className="text-lg font-medium">
              {recordingStatus === 'cancel' ? '松开手指，取消发送' : '手指上滑，取消发送'}
            </Text>
            <Text className="text-sm text-gray-500 mt-2">{recordingTime}s</Text>
          </View>
        </View>
      </Overlay>

      <View
        className="footer flex absolute h-[400Px] flex-col shrink-0 w-full bg-gray-100 p-3 pt-2 pb-8 box-border text-red-500"
        style={{
          top: `${fullHeight - 94}Px`,
        }}
      >
        <View className="flex items-center gap-3">
          {!isRecording ? (
            <View className={isRecording ? 'animate-pulse' : ''} onClick={handleVoiceClick}>
              <VolumeMax size={24} />
            </View>
          ) : (
            <Button type="primary" size="mini" onClick={handleKeyboardClick}>
              键盘
            </Button>
          )}
          {isRecording ? (
            <View
              className="bg-red-200 rounded p-1 flex-auto flex justify-center text-sm items-center relative shrink-0 min-h-[40PX]"
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              onTouchCancel={cancelRecording}
              onTouchMove={handleTouchMove}
            >
              {showRecordingOverlay ? `${recordingTime}s` : '长按发送语音'}
            </View>
          ) : (
            <View
              className="chat-input flex-auto flex items-center relative shrink-0 min-h-[40PX]"
              style={
                {
                  ['--nutui-textarea-padding']: '8px 40px 8px 8px',
                } as CSSProperties
              }
            >
              <TextArea
                ref={textAreaRef}
                autoSize
                placeholder=""
                name="value1"
                value={sendMsg}
                onChange={(value) => setSendMsg(value)}
                onConfirm={() => handleSend()}
                onFocus={handleTextAreaFocus}
                onBlur={handleTextAreaBlur}
              />

              <View className="absolute w-0 right-0">
                {!showEmoji ? (
                  <Dongdong className="relative left-[-32Px]" size={24} onClick={handleEmojiClick} />
                ) : (
                  <Button type="primary" size="mini" className="relative left-[-32Px]" onClick={handleKeyboardClick}>
                    键盘
                  </Button>
                )}
              </View>
            </View>
          )}
          <View className="flex items-center justify-center rounded-full border-solid border-red-500 box-border border">
            <Add size={20} onClick={handleMoreClick} />
          </View>
          <Top onClick={() => handleSend()} />
        </View>
        <View
          className={`mt-2 border-0 !border-t border-solid border-[#e2e2e2] transition-all  ${showMore ? 'h-[250Px] opacity-100' : 'h-0 opacity-0 pointer-events-none'}`}
        >
          <View className="flex items-center justify-around mt-2">
            <View className="flex flex-col items-center" onClick={chooseImage}>
              <ImageIcon size={24} />
              <Text className="text-xs mt-1">图片</Text>
            </View>
            <View className="flex flex-col items-center" onClick={chooseVideo}>
              <Video size={24} />
              <Text className="text-xs mt-1">视频</Text>
            </View>
            <View className="flex flex-col items-center" onClick={chooseFile}>
              <Top size={24} />
              <Text className="text-xs mt-1">聊天文件</Text>
            </View>
            <View className="flex flex-col items-center" onClick={chooseBigFile}>
              <Top size={24} />
              <Text className="text-xs mt-1">大文件发送</Text>
            </View>
          </View>
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
                <View key={dataIndex} className="flex justify-around">
                  {emojiArr.map((emoji) => {
                    return (
                      <View
                        key={emoji}
                        className="h-[40Px] w-[40Px] rounded active:bg-red-200 flex items-center justify-center"
                        onClick={() => handleEmojiSelect(emoji)}
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
    </View>
  )
}

export default useNavTitle(Chat, '消息')
