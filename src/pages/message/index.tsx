import { View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { Image } from '@nutui/nutui-react-taro'

export default function Message() {
  useLoad(() => {
    console.log('Message page loaded.')
  })

  return (
    <View className='message'>
      <View className='message-list'>
        <View className='message-item'>
          <Image className='avatar' src='default-avatar.png' />
          <View className='content'>
            <View className='title'>智忠标牌厂</View>
            <View className='preview'>您好,请问有什么可以帮您?</View>
          </View>
          <View className='time'>12:30</View>
        </View>
      </View>
    </View>
  )
}
