import { Image, View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

function Moments() {
  useLoad(() => {
    console.log('Moments page loaded.')
  })

  return (
    <View className="moments">
      <View className="moment-item">
        <View className="header">
          <Image className="avatar" src="default-avatar.png" />
          <View className="info">
            <View className="name">旗王双喷旗帜横幅厂</View>
            <View className="time">2小时前</View>
          </View>
        </View>
        <View className="content">双喷纺织天黑布,大型商超广告展示...</View>
        <View className="images">
          <Image className="img" src="product1.png" />
          <Image className="img" src="product2.png" />
        </View>
        <View className="actions">
          <View className="like">点赞</View>
          <View className="comment">评论</View>
        </View>
      </View>
    </View>
  )
}

export default Moments
