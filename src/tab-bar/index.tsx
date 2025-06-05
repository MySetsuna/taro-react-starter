import { memo, useEffect, useState } from 'react'
import { Tabbar } from '@nutui/nutui-react-taro'
import { IconFont } from '@nutui/icons-react-taro'
import { default as IconLM } from '../icons'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'

import './index.scss'
import { View } from '@tarojs/components'
import { useLocation, useNavigate } from 'react-router'
import { useUserStore } from '@/models'

export const tabList = [
  {
    path: '/factory',
    text: '厂家',
    iconRender: (isActive: boolean) => {
      return <IconFont name="shop" className={isActive ? ['nut-icon-am-breathe'].join(' ') : ''}></IconFont>
    },
  },
  {
    path: '/message',
    text: '消息',
    iconRender: (isActive: boolean) => {
      return <IconFont name="message" className={isActive ? ['nut-icon-am-breathe'].join(' ') : ''}></IconFont>
    },
  },
  {
    path: '/moments',
    text: '广告圈',
    iconRender: (isActive: boolean) => (
      <View className={isActive ? ['nut-icon-am-breathe'].join(' ') : ''}>
        <View className={isActive ? ['nut-icon-am-rotate'].join(' ') : ''}>
          <IconLM size={55} name="moments" color={isActive ? '#fa2c19' : ''} />
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
  const setLastTab = useUserStore.use.setLastTab()

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
    setLastTab(item.path)
    navigate(item.path)
  }

  const getValue = (path: string) => {
    switch (path) {
      case '/factory':
        return 0
      case '/message':
        return 1
      case '/moments':
        return 2
      case '/magazine':
        return 3
      case '/mine':
        return 4
      default:
        return undefined
    }
  }

  return (
    <Tabbar fixed value={tab} onSwitch={handleSwitch}>
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
