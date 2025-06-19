import { View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { Button, Image, SearchBar } from '@nutui/nutui-react-taro'
import { useUserStore } from '@/models'
import { default as IconLM } from '@/icons'
import Taro from '@tarojs/taro'

function Factory() {
  const isLogged = useUserStore.use.isLogged()

  useLoad(() => {
    console.log('Factory page loaded.')
  })

  const handleSearch = (value: string) => {
    console.log('搜索:', value)
  }

  const handleShopClick = (shopId: string) => {
    Taro.navigateTo({ url: `/pages/shop/index?shopId=${shopId}` })
  }

  const handleLogin = () => {
    Taro.navigateTo({ url: '/pages/login/index' })
  }

  return (
    <View className="factory">
      <View className="header">
        <View className="search-container">
          <SearchBar
            placeholder="搜索厂家、产品"
            onSearch={handleSearch}
            className="search-bar"
          />
        </View>
      </View>

      <View className="content">
        <View className="section">
          <View className="section-title">推荐厂家</View>
          <View className="shop-list">
            <View className="shop-item" onClick={() => handleShopClick('1')}>
              <Image className="shop-image" src="shop1.jpg" />
              <View className="shop-info">
                <View className="shop-name">优质厂家A</View>
                <View className="shop-desc">专业生产高质量产品</View>
                <View className="shop-rating">★★★★★</View>
              </View>
            </View>
            <View className="shop-item" onClick={() => handleShopClick('2')}>
              <Image className="shop-image" src="shop2.jpg" />
              <View className="shop-info">
                <View className="shop-name">优质厂家B</View>
                <View className="shop-desc">创新设计，品质保证</View>
                <View className="shop-rating">★★★★☆</View>
              </View>
            </View>
          </View>
        </View>

        <View className="section">
          <View className="section-title">热门产品</View>
          <View className="product-grid">
            <View className="product-item">
              <Image className="product-image" src="product1.jpg" />
              <View className="product-name">产品名称1</View>
              <View className="product-price">¥99.00</View>
            </View>
            <View className="product-item">
              <Image className="product-image" src="product2.jpg" />
              <View className="product-name">产品名称2</View>
              <View className="product-price">¥199.00</View>
            </View>
            <View className="product-item">
              <Image className="product-image" src="product3.jpg" />
              <View className="product-name">产品名称3</View>
              <View className="product-price">¥299.00</View>
            </View>
            <View className="product-item">
              <Image className="product-image" src="product4.jpg" />
              <View className="product-name">产品名称4</View>
              <View className="product-price">¥399.00</View>
            </View>
          </View>
        </View>
      </View>

      {!isLogged && (
        <View className="login-prompt">
          <Button type="primary" onClick={handleLogin}>
            登录查看更多内容
          </Button>
        </View>
      )}
    </View>
  )
}

export default Factory
