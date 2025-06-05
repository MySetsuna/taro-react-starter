import type { PropsWithChildren } from 'react'
import Taro, { useDidShow, useLaunch } from '@tarojs/taro'
import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
  })

  useDidShow(() => {})

  // children 是将要会渲染的页面
  return children
}

export default App
