import { View, Image, ScrollView, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

export default function Magazine() {
  useLoad(() => {
    console.log('Magazine page loaded.')
  })

  return (
    <View className='magazine'>
      <View className='search-bar'>
        <input type='text' placeholder='搜索杂志内容' />
      </View>

      <ScrollView scrollY className='magazine-list'>
        <View className='magazine-item'>
          <Image
            className='cover'
            mode='aspectFill'
            src='https://placeholder.com/300x200'
          />
          <View className='info'>
            <View className='title'>茶机真面·开工大吉</View>
            <View className='desc'>青城、西湖、内蒙、内江...</View>
            <View className='meta'>
              <Text className='date'>2024-02-28</Text>
              <Text className='views'>阅读 2890</Text>
            </View>
          </View>
        </View>

        <View className='magazine-item'>
          <Image
            className='cover'
            mode='aspectFill'
            src='https://placeholder.com/300x200'
          />
          <View className='info'>
            <View className='title'>快幕秀 方便携带 安装简单</View>
            <View className='desc'>商城、商铺、展览、内外...</View>
            <View className='meta'>
              <Text className='date'>2024-02-27</Text>
              <Text className='views'>阅读 1560</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
