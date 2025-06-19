import { useEffect, type PropsWithChildren } from 'react'
import Taro, { useDidShow, useLaunch, useUnload } from '@tarojs/taro'
import './app.scss'
import { useImStore, useImStoreReset } from './models'
import { utils } from './libs'

function App({ children }: PropsWithChildren<any>) {
  const setIsSDKReady = useImStore.use.setIsSDKReady()
  const im = useImStore.use.im()

  useEffect(() => {
    useImStoreReset()
    console.log('App launched.')
    //
    //   ? __non_webpack_require__.async('./im-sdk/pages/blank/index')
    // if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
    //   __non_webpack_require__.async('./im-sdk/pages/blank/index')
    // }
    utils.onIMSDKReady(() => {
      console.log('onIMSDKReady')
      setIsSDKReady(true)
    })
    return () => {
      console.log(im, 'im11111111111111')
    }
  }, [])

  // useUnload(() => {
  //   console.log('App unloaded.')
  //   im?.destroy?.()
  // })

  useDidShow(() => {})

  // children 是将要会渲染的页面
  return children
}

export default App
