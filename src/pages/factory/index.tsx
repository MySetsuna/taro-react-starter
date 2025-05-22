import { View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { Button, Image } from '@nutui/nutui-react-taro'
import { Locationg3, TriangleDown, TriangleUp ,Search} from '@nutui/icons-react-taro'
import { useState } from 'react'

export default function Factory() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  const [isOpen, setIsOpen] = useState(false)

  return (
    <View className="factory p-2">
      <View className="factory-header flex items-center">
        <div className="location flex items-center" onClick={() => setIsOpen((open) => !open)}>
          <Locationg3 className="nut-icon-am-jump nut-icon-am-infinite" size={16} />
          <View className="location-text leading-10 mr-1 ml-1 text-ellipsis overflow-hidden whitespace-nowrap max-w-12">湖南</View>
          {isOpen ? <TriangleUp size={10} /> : <TriangleDown size={10} />}
        </div>
        <View className="flex items-center w-full justify-start">
          <Search size={16} className=" absolute left-5 w-0" />
          <input type="text" placeholder="请输入关键字" className="rounded-full bg-slate-300 w-full h-7 pl-8" />
        </View>
      </View>

      <View className="factory-list">
        {/* 厂家列表 */}
        <View className="factory-item">
          <Image className="logo" src="home.png" />
          <View className="info">
            <View className="name">智忠标牌厂</View>
            <View className="desc">广告牌、铭牌、钛金牌、不锈钢...</View>
          </View>
          <Button className="contact">去咨询</Button>
        </View>
      </View>
    </View>
  )
}
