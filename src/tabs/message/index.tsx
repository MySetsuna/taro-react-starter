import { ScrollView, Text, View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { Avatar, Badge, Button, Cascader, Empty, Image, Input, NavBar, SearchBar, Swipe } from '@nutui/nutui-react-taro'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IDataResponse, IGetOptions, IGetOptionsWithoutParams, IPostOptions, IResponse } from 'types/http'
import { IIMUserInfo } from 'types/im'
import { useNavigate } from 'react-router'
import { ArrowLeft, Location, User } from '@nutui/icons-react-taro'
import { request } from '@/api'
import { utils } from '@/libs'
import { useAreaOptions, useFactoryStore, useImStore, useUserStore } from '@/models'
import { TabBar } from '@/tab-bar'
import { TABBAR_HEIGHT } from '@/config'
import { timeFormat } from '@/libs/time-method'
import { useInterval, useNavStyle } from '@/hooks'

const ENPTY_USER_NAME = '未命名用户'

function Message() {
  const navigate = useNavigate()
  const conversationList = useImStore.use.conversationList()
  const setConversationList = useImStore.use.setConversationList()
  const tim = useImStore.use.im()
  const isSDKReady = useImStore.use.isSDKReady()
  const pinnedList = useImStore.use.pinnedList()
  const setPinnedList = useImStore.use.setPinnedList()
  const isImLogin = useImStore.use.isImLogin()
  const isImConnectReady = useImStore.use.isImConnectReady()
  const areaData = useFactoryStore.use.areaData()
  const [locationValue, setLocationValue] = useState([-1])

  const fullHeight = Taro.getWindowInfo().windowHeight

  // fetch
  const fetchAreaData = useFactoryStore.use.fetchAreaData()

  const [isVisible, setIsVisible] = useState(false)

  const [now, setNow] = useState(new Date().getTime())

  const options = useAreaOptions(areaData)

  // const displayLocatiopn = useMemo(() => {
  //   let displayLocatiopn = '全国'
  //   options.forEach((item: any) => {
  //     if (item.value === locationValue[0]) {
  //       if (locationValue[1] > 0) {
  //         item.children.forEach((child: any) => {
  //           if (child.value === locationValue[1]) {
  //             displayLocatiopn = child.text
  //           }
  //         })
  //       }
  //       else {
  //         displayLocatiopn = item.text
  //       }
  //     }
  //   })
  //   return displayLocatiopn
  // }, [locationValue, options])

  console.log(conversationList, 'conversationList')
  const [searchValue, setSearchValue] = useState('')

  const swipeMapRef = useRef<any>({})

  const filterConversationList = useMemo(() => {
    let list = []
    if (!searchValue) {
      list = conversationList.filter((item) => {
        return item.type === 'GROUP' || item.type === 'C2C'
      })
    }
    list = conversationList.filter((item) => {
      if (item.type === 'GROUP') {
        return item.groupProfile.name.includes(searchValue)
      } else if (item.type === 'C2C') {
        return item.userProfile.nick.includes(searchValue)
      }
      return false
    })
    list.sort((a, b) => {
      let aIndex = pinnedList.indexOf(a.conversationID)
      let bIndex = pinnedList.indexOf(b.conversationID)

      if (aIndex === -1) {
        aIndex = Infinity
      }
      if (bIndex === -1) {
        bIndex = Infinity
      }
      return aIndex - bIndex
    })
    return list
  }, [conversationList, searchValue, pinnedList])

  const msgDisplay = (item) => {
    if (item.lastMessage.type === 'TIMTextElem') {
      return item.lastMessage.payload.text
    }
  }

  const fetchConversationList = useCallback(async () => {
    // 获取全量的会话列表
    let promise = tim.getConversationList()
    promise
      .then(function (imResponse) {
        const conversationList = imResponse.data.conversationList // 全量的会话列表，用该列表覆盖原有的会话列表
        const isSyncCompleted = imResponse.data.isSyncCompleted // 从云端同步会话列表是否完成
        console.log(conversationList, 'conversationList8888888888888', isSyncCompleted)
        setConversationList(conversationList)
      })
      .catch(function (imError) {
        console.warn('getConversationList error:', imError) // 获取会话列表失败的相关信息
      })
    // setIMUserInfo(res.data)
  }, [tim, isSDKReady, isImLogin, isImConnectReady])

  const avaDisplay = (nick) => {
    if (nick) {
      return nick[0] + (nick[1] ?? '')
    }
    return ''
  }

  const onChange = (value: any) => {
    setLocationValue(value)
  }

  const onDelete = (ID: string) => {
    const promise = tim.deleteConversation(ID)
    promise
      .then((imResponse) => {
        // 删除会话成功
        const { conversationID } = imResponse.data // 被删除的会话 ID
        setConversationList(conversationList.filter((item) => item.conversationID !== conversationID))
      })
      .catch((imError) => {
        console.warn('deleteConversation error:', imError) // 删除会话失败的相关信息
      })
  }

  const onPin = (ID: string) => {
    console.log(ID, 'ID')
    setPinnedList((list) => {
      return [ID, ...list]
    })
  }

  const onUnPin = (ID: string) => {
    setPinnedList((list) => {
      return list.filter((item) => item !== ID)
    })
  }

  const closeAllSwipe = () => {
    Object.values(swipeMapRef.current).forEach((item: any) => {
      item?.close()
    })
  }

  useEffect(() => {
    fetchAreaData()
  }, [])

  useEffect(() => {
    if (tim && isSDKReady && isImLogin && isImConnectReady) {
      fetchConversationList()
    }
  }, [tim, isSDKReady, isImLogin, isImConnectReady])

  useInterval(() => {
    setNow(new Date().getTime())
  }, 60 * 1000)

  return (
    <>
      <View>
        {/* <NavBar
          back={
            <View className=' flex items-center'>
              <ArrowLeft />
              <Badge value={10} />
            </View>
          }
          onBackClick={() => {
            Taro.navigateBack()
          }}
          title="消息"
        >
          <View>Taro UI</View>
        </NavBar> */}
        <View
          id="message-header"
          className="message-header flex items-center top-0 bg-white z-10 pl-2 pr-2 border-0 !border-b border-solid border-[#e2e2e2] fixed w-full h-[58Px] box-border"
        >
          {/* <View className="location flex items-center mr-1 active:text-red-400" onClick={() => setIsVisible(true)}>
            <Location className="nut-icon-am-jump nut-icon-am-infinite" name="locationg3" />
            <View className="location-text leading-10 mr-1 ml-1 text-ellipsis overflow-hidden whitespace-nowrap w-12 text-sm">
              {displayLocatiopn}
            </View>
          </View> */}
          <View className="flex items-center w-full justify-start relative">
            <SearchBar
              placeholder="搜索"
              onFocus={() => {
                Object.values(swipeMapRef.current).forEach((item: any) => {
                  item?.close()
                })
              }}
              onChange={setSearchValue}
              shape="round"
              style={{ '--nutui-searchbar-input-height': '38PX' } as any}
            />
          </View>
        </View>
        <ScrollView
          enhanced
          showScrollbar={false}
          style={{
            height: `${fullHeight - TABBAR_HEIGHT - 58}px`,
            position: 'fixed',
            top: '58PX',
          }}
          onTouchStart={() => {
            closeAllSwipe()
          }}
          onScroll={() => {
            closeAllSwipe()
          }}
          scrollY
        >
          <View className="chat-c flex flex-col">
            {filterConversationList.map((item) => {
              const isGroup = item.type === 'GROUP'
              const avatar = isGroup ? item.groupProfile.avatar : item.userProfile.avatar
              const nick = isGroup ? item.groupProfile.name.split('_')[0] : item.userProfile.nick || ENPTY_USER_NAME
              const ava = avaDisplay(nick)
              const sendId = isGroup ? item.groupProfile.groupID : item.userProfile.userID
              const path = `/pages/chat/index?sendId=${sendId}&companyName=${nick || ENPTY_USER_NAME}&type=${item.type}&conversationID=${item.conversationID}`
              // eslint-disable-next-line no-console
              console.log(avatar, 'avatar')

              return (
                <Swipe
                  ref={(swipeRef) => {
                    swipeMapRef.current[item.conversationID] = swipeRef
                  }}
                  contentEditable
                  className="active:bg-gray-100"
                  key={item.conversationID}
                  onActionClick={closeAllSwipe}
                  rightAction={
                    <View className="flex items-center">
                      {!pinnedList.includes(item.conversationID) ? (
                        <View
                          className=" bg-sky-300 w-[90PX] text-sm shrink-0 p-2 h-[67Px] text-white flex items-center justify-center text-nowrap"
                          onClick={() => {
                            setTimeout(() => {
                              onPin(item.conversationID)
                            }, 100)
                          }}
                        >
                          置顶
                        </View>
                      ) : (
                        <View
                          className=" bg-yellow-300 w-[90PX] text-sm p-2 h-[67Px] text-white flex items-center justify-center text-nowrap"
                          onClick={() => {
                            setTimeout(() => {
                              onUnPin(item.conversationID)
                            }, 100)
                          }}
                        >
                          取消置顶
                        </View>
                      )}
                      <View
                        className=" bg-red-600 w-[90PX] text-sm shrink-0 p-2 h-[67Px] text-white flex items-center justify-center text-nowrap"
                        onClick={() => onDelete(item.conversationID)}
                      >
                        删除
                      </View>
                    </View>
                  }
                >
                  <View
                    key={item.conversationID}
                    className="chat-box flex items-center gap-2   p-2 pl-3 pr-3 box-border"
                    onClick={() => {
                      Taro.navigateTo({ url: path })
                      Taro.setNavigationBarTitle({ title: '消息' })
                    }}
                  >
                    <Badge value={item.unreadCount}>
                      <Avatar
                        shape="square"
                        size={50 as any}
                        // 展示屏蔽，目前展示不出图片
                        // src={avatar}
                        icon={ava ? undefined : <User />}
                        color="#ff0f23"
                        background="#ffd6e1"
                      >
                        {/* {avatar ? '' : ava} */}
                        {ava}
                      </Avatar>
                    </Badge>
                  </View>
                  <View
                    key={item.conversationID}
                    className="chat-box flex items-center gap-2 w-full p-2 pl-3 pr-5 box-border border-0 !border-b border-solid border-[#e2e2e2]"
                    onClick={() => Taro.navigateTo({ url: path })}
                  >
                    <View className=" flex items-center justify-between w-full h-[50Px] ">
                      <View className="chat-r flex-auto flex flex-col gap-1 justify-start ">
                        <View className="chat-name">{nick}</View>
                        <View className="chat-text-bg text-sm text-gray-400 flex items-center gap-1 justify-start">
                          <Image src="" className="tel-img " height={10} width={10}></Image>
                          <View className=" flex-auto w-0 whitespace-nowrap text-ellipsis overflow-hidden">
                            {msgDisplay(item)}
                          </View>
                        </View>
                      </View>
                      <View className="flex flex-col justify-between h-[50Px]">
                        <View className="text-xs text-gray-300">{timeFormat(item.lastMessage.lastTime, now)}</View>
                        {/* <View>{item.userProfile.location}</View> */}
                      </View>
                    </View>
                  </View>
                </Swipe>
              )
            })}
          </View>
        </ScrollView>
      </View>
      <Cascader
        visible={isVisible}
        value={locationValue}
        title="厂家地址"
        options={options}
        closeable
        onClose={() => {
          setIsVisible(false)
        }}
        onChange={onChange}
        className="pb-5"
      />
    </>
  )
}

export default useNavStyle(Message, {
  navigationBarTitle: {
    title: '消息',
  },
  navigationBarColor: {
    backgroundColor: '#ff0f23',
    frontColor: '#ffffff',
  },
})
