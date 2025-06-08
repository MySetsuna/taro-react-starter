import Taro from '@tarojs/taro'
import { useCallback, useRef } from 'react'

/**
 * 防抖 hook
 * @param fn 需要防抖的函数
 * @param delay 防抖延迟时间，默认 300ms
 * @returns 防抖后的函数
 */
export const useDebounce = <T extends (...args: any[]) => any>(fn: T, delay: number = 300) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const callback = useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        fn(...args)
      }, delay)
    },
    [fn, delay]
  )
  Reflect.set(callback, 'cancel', () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  })
  return callback as T & { cancel: () => void }
}

export const useNavTitle = <P>(fc: React.FC<P>, title: string) => {
  return (props: P) => {
    Taro.setNavigationBarTitle({
      title,
    })
    return fc(props)
  }
}
