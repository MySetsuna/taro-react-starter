import { View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { Button, Image } from '@nutui/nutui-react-taro'
import { useUserStore } from '@/models'
import { TabBar } from '@/tab-bar'
import { useTabBar } from '@/hooks/useTabBar'

function Mine() {
  useLoad(() => {
    console.log('Mine page loaded.')
  })

  const logout = () => {
    useUserStore.use.removeToken()
  }

  return (
    <>
      <View className="mine">
        <View className="user-info">
          <Image className="avatar" src="default-avatar.png" />
          <View className="name">罗马杂志客服</View>
          <View className="vip-tag">普通会员</View>
        </View>

        <View className="menu-list">
          <View className="menu-item">
            <View className="title">支付记录</View>
            <View className="arrow">{'>'}</View>
          </View>
          <View className="menu-item">
            <View className="title">厂家入驻</View>
            <View className="arrow">{'>'}</View>
          </View>
          <View className="menu-item">
            <View className="title">联系客服</View>
            <View className="arrow">{'>'}</View>
          </View>
          <View className="menu-item">
            <View className="title">平台协议</View>
            <View className="arrow">{'>'}</View>
          </View>
          <View className="menu-item">
            <View className="title">关于我们</View>
            <View className="arrow">{'>'}</View>
          </View>
        </View>

        <Button className="logout-btn" onClick={logout}>
          退出登录
        </Button>
      </View>
    </>
  )
}
export default Mine
