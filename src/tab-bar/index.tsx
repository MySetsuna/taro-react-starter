import { memo, useEffect, useState } from 'react'
import { Tabbar } from '@nutui/nutui-react-taro'
import { Message, Store } from '@nutui/icons-react-taro'
import { default as IconLM } from '../icons'
import Taro from '@tarojs/taro'

import './index.scss'
import { View } from '@tarojs/components'
import { useLocation, useNavigate } from 'react-router'
import { useImStore, useUserStore } from '@/models'
import { TABBAR_HEIGHT } from '@/config'

export const tabList = [
  {
    path: '/factory',
    text: '厂家',
    iconRender: (isActive: boolean) => {
      return <Store className={isActive ? ['nut-icon-am-breathe'].join(' ') : ''}></Store>
    },
  },
  {
    path: '/message',
    text: '消息',
    iconRender: (isActive: boolean) => {
      return <Message className={isActive ? ['nut-icon-am-breathe'].join(' ') : ''}></Message>
    },
  },
  {
    path: '/moments',
    text: '广告圈',
    iconRender: (isActive: boolean) => (
      <View className={isActive ? ['nut-icon-am-breathe'].join(' ') : ''}>
        <View className={isActive ? ['nut-icon-am-rotate'].join(' ') : ''}>
          <IconLM name="moments" color={isActive ? '#fa2c19' : ''} />
        </View>
      </View>
    ),
  },
  {
    path: '/magazine', // 添加杂志页面到 tabBar
    text: '杂志',
    iconRender: (isActive: boolean) => {
      return (
        <View className={isActive ? ['nut-icon-am-breathe'].join(' ') : ''}>
          <IconLM name="magazine" color={isActive ? '#fa2c19' : ''} />
        </View>
      )
    },
  },
  {
    path: '/mine',
    text: '我的',
    iconRender: (isActive: boolean) => {
      return (
        <View className={isActive ? ['nut-icon-am-breathe'].join(' ') : ''}>
          <IconLM name="mine" color={isActive ? '#fa2c19' : ''} />
        </View>
      )
    },
  },
]

export const TabBar = memo(() => {
  const [tab, setTab] = useState(-1)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const conversationList = useImStore.use.conversationList()

  useEffect(() => {
    const index = tabList.findIndex((item) => pathname === item.path)
    console.log(tab, 'tab', pathname, 'pathname', index, 'index')
    if (index !== -1) {
      setTab(index)
      Taro.setNavigationBarTitle({
        title: tabList[index].text,
      })
    }
  }, [pathname])

  const handleSwitch = (index: number) => {
    setTab(index)
    const item = tabList[index]
    navigate(item.path)
  }

  const getValue = (path: string) => {
    switch (path) {
      // case '/factory':
      //   return 0
      case '/message':
        return conversationList.reduce((pre, cur) => {
          return pre + cur.unreadCount
        }, 0)
      // case '/moments':
      //   return 2
      // case '/magazine':
      //   return 3
      // case '/mine':
      //   return 4
      default:
        return undefined
    }
  }

  return (
    <Tabbar
      fixed
      value={tab}
      onSwitch={handleSwitch}
      style={
        {
          ['--nutui-tabbar-box-shadow']: '0 1px 4px 0 rgb(0 0 0 / 0.1)',
          ['--nutui-tabbar-height']: `${TABBAR_HEIGHT}px`,
          zIndex: 9999999999,
        } as any
      }
    >
      {tabList.map((item, index) => {
        return (
          <Tabbar.Item
            key={item.path}
            value={getValue(item.path)}
            icon={item.iconRender(tab === index)}
            title={item.text}
          ></Tabbar.Item>
        )
      })}
    </Tabbar>
  )
})
