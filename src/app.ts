import type { PropsWithChildren } from 'react'
import Taro, { useDidShow, useLaunch, useUnload } from '@tarojs/taro'
import './app.scss'
import { useImStore, useImStoreReset,  } from './models'
import { utils } from './libs'

function App({ children }: PropsWithChildren<any>) {
  const setIsSDKReady = useImStore.use.setIsSDKReady()
  const im = useImStore.use.im()

  useLaunch(() => {

    useImStoreReset()
    console.log('App launched.')
    // Taro.getEnv() === Taro.ENV_TYPE.WEAPP
    //   ? __non_webpack_require__.async('./im-sdk/pages/blank/index')
    //   : import('./im-sdk/pages/blank/index')
    utils.onIMSDKReady(() => {
      console.log('onIMSDKReady')
      setIsSDKReady(true)
    })

  })

  useUnload(() => {
    console.log('App unloaded.')
    im?.destroy?.()
  })

  useDidShow(() => {})

  // children 是将要会渲染的页面
  return children
}

export default App
