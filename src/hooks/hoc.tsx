import Taro from '@tarojs/taro'
import { useEffect } from 'react'

export const useNavStyle = (
  FC: React.FC,
  options: {
    navigationBarTitle?: Taro.setNavigationBarTitle.Option
    navigationBarColor?: Taro.setNavigationBarColor.Option
    backgroundColor?: Taro.setBackgroundColor.Option
  }
) => {
  const { navigationBarTitle, navigationBarColor, backgroundColor } = options
  return (props: any) => {
    useEffect(() => {
      if (navigationBarTitle) {
        Taro.setNavigationBarTitle(navigationBarTitle)
      }
      if (navigationBarColor) {
        Taro.setNavigationBarColor(navigationBarColor)
      }
      if (backgroundColor) {
        Taro.setBackgroundColor(backgroundColor)
      }
    }, [navigationBarTitle, navigationBarColor, backgroundColor])
    return <FC {...props} />
  }
}
