import { View } from '@tarojs/components'
import { Button, Cascader, SearchBar } from '@nutui/nutui-react-taro'
import { IconFont } from '@nutui/icons-react-taro'
import { useEffect, useMemo, useState } from 'react'
import { pca } from 'area-data' // v3 or higher
import 'react-area-linkage/dist/index.css' // v2 or higher

function Factory() {
  const [isVisible, setIsVisible] = useState(false)
  const [locationValue, setLocationValue] = useState(['湖南省', '长沙市'])
  const [searchValue, setSearchValue] = useState('')

  const options = useMemo(() => {
    // 86 中国
    const options = []
    Object.entries(pca[86]).forEach(([key, value]) => {
      options.push({
        value: value,
        text: value,
        children: [
          ...Object.entries(pca[key]).map(([_key, value]) => ({
            value: value,
            text: value,
          })),
        ],
      })
    })

    return options
  }, [])

  const onChange = (value: any) => {
    setLocationValue(value)
  }

  const onSearch = (value: string) => {
    setSearchValue(value)
    // TODO: 搜索
  }

  return (
    <>
      <View className="factory p-2">
        <View className="factory-header flex items-center">
          <View className="location flex items-center mr-1" onClick={() => setIsVisible(true)}>
            <IconFont className="nut-icon-am-jump nut-icon-am-infinite" name="locationg3" />
            <View className="location-text leading-10 mr-1 ml-1 text-ellipsis overflow-hidden whitespace-nowrap max-w-12 text-sm">
              {locationValue[1]}
            </View>
          </View>
          <View className="flex items-center w-full justify-start relative">
            <SearchBar onChange={(val: string) => onSearch(val)} shape="round" />
          </View>
        </View>

        <View className="factory-list">
          {/* 厂家列表 */}
          <View className="factory-item">
            {/* <Image className="logo" src="home.png" /> */}
            <View className="info">
              <View className="name">智忠标牌厂</View>
              <View className="desc">广告牌、铭牌、钛金牌、不锈钢...</View>
            </View>
            <Button className="contact">去咨询</Button>
          </View>
        </View>
        <Cascader
          visible={isVisible}
          activeColor="#3768FA"
          value={locationValue}
          title="厂家地址"
          options={options}
          closeable
          activeIcon="star"
          onClose={() => {
            setIsVisible(false)
          }}
          onChange={onChange}
          className="pb-10"
        />
      </View>
    </>
  )
}

export default Factory
