import { utils } from '@/libs'
import { iminit_TIM, TIM_TYPES, TIM_EVENT } from '../../../libs/im'
import { useEffect } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'

export default function Index() {
  useDidShow(() => {
    utils.setIMSDK(iminit_TIM, TIM_TYPES, TIM_EVENT)
    utils.onIMSDKReady(() => {
      Taro.redirectTo({
        url: '/pages/index/index',
      })
    })
  })
  return <></>
}
