import { View } from '@tarojs/components'
import {
  Address,
  Button,
  Cascader,
  CascaderOption,
  Image,
  Loading,
  SearchBar,
  VirtualList,
} from '@nutui/nutui-react-taro'
import { IconFont, Star } from '@nutui/icons-react-taro'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { pca } from 'area-data' // v3 or higher
import { useDebounce } from '@/hooks/common'
import { request } from '@/api'
import { ICategory, IFactory, IRowsResponse } from 'types/module'
import { useFactoryStore } from '@/models/factory'
import Taro, { useDidShow, useLaunch } from '@tarojs/taro'
import './index.scss'

function Factory() {
  const factoryList = useFactoryStore.use.factoryList()
  const locationValue = useFactoryStore.use.currentLocation()
  const searchValue = useFactoryStore.use.searchValue()
  const categorys = useFactoryStore.use.categories()
  const currentCategory = useFactoryStore.use.currentCategory()

  const setFactoryList = useFactoryStore.use.setFactoryList()
  const setLocationValue = useFactoryStore.use.setLocation()
  const setSearchValue = useFactoryStore.use.setSearchValue()
  const setCategories = useFactoryStore.use.setCategories()
  const setCurrentCategory = useFactoryStore.use.setCurrentCategory()

  const [isVisible, setIsVisible] = useState(false)
  const [wrapperHeight, setWrapperHeight] = useState(0)

  const categoryList = useMemo(() => categorys.slice(), [categorys])
  console.log(locationValue, 'locationValue')

  const options = useMemo(() => {
    // 86 中国
    const options: any = [{ value: '86', text: '全国' }]
    Object.entries(pca[86]).forEach(([key, value]) => {
      options.push({
        value: key,
        text: value,
        children: [
          { value: key, text: '不限' },
          ...Object.entries(pca[key]).map(([key, value]) => ({
            value: key,
            text: value,
          })),
        ],
      })
    })

    return options
  }, [])

  const displayLocatiopn = useMemo(() => {
    let displayLocatiopn = '全国'
    options.forEach((item: any) => {
      if (item.value === locationValue[0]) {
        if (locationValue[1] && locationValue[0] !== locationValue[1]) {
          item.children.forEach((child: any) => {
            if (child.value === locationValue[1]) {
              displayLocatiopn = child.text
            }
          })
        } else {
          displayLocatiopn = item.text
        }
      }
    })
    return displayLocatiopn
  }, [locationValue, options])

  const onChange = (value: any) => {
    console.log(value, 'setLocationValue')

    setLocationValue(value)
  }

  const fetchFactoryList = useCallback(async () => {
    const data = await request<IRowsResponse<IFactory>>('/app/tenant/list', {
      method: 'GET',
      params: {
        province: locationValue[0],
        city: locationValue[1],
        name: searchValue || undefined,
        tenantType: '[01]',
        tenantCategoryId: currentCategory,
      },
    })
    console.log(data, 'data')
    setFactoryList(data.rows)
  }, [locationValue, searchValue, currentCategory])

  const fetchCategoryList = useCallback(async () => {
    const data = await request<IRowsResponse<ICategory>>('/app/tenant/category/list', {
      method: 'GET',
    })
    setCategories(data.rows)
    setCurrentCategory(data.rows[0]?.id)
  }, [])

  const debouncedSearch = useDebounce(fetchFactoryList, 300)

  const onSearch = (value: string) => {
    setSearchValue(value)
  }

  const getWrapperHeight = useCallback(() => {
    return new Promise<number>((resolve) => {
      let wrapperHeight = 600
      const fullHeight = Taro.getSystemInfoSync().windowHeight
      const query = Taro.createSelectorQuery()
      query.select('#factory-header').boundingClientRect()
      query.select('.nut-tabbar').boundingClientRect()
      query.exec((res) => {
        console.log(res, 'tabbar')
        if (res) {
          const headerHeight = res[0].height
          const tabbarHeight = res[1].height
          wrapperHeight = fullHeight - headerHeight - tabbarHeight
          console.log('wrapperHeight', wrapperHeight, fullHeight, 'fullHeight')
        }
        resolve(wrapperHeight)
      })
    })
  }, [])

  useEffect(() => {
    debouncedSearch.cancel()
    debouncedSearch()
  }, [debouncedSearch])

  useEffect(() => {
    fetchCategoryList()
  }, [])

  useLayoutEffect(() => {
    getWrapperHeight().then((height) => {
      setWrapperHeight(height)
    })
  }, [])

  const itemRender = (item: ICategory) => {
    return (
      <View
        className={[
          'category-item h-[45Px] leading-[45Px] text-center text-sm',
          currentCategory === item.id ? 'bg-white font-bold' : 'bg-[#f6f6f6] text-gray-500',
        ].join(' ')}
        key={item.id}
        onClick={() => {
          setCurrentCategory(item.id)
        }}
      >
        <View className="category-text">{item.name}</View>
      </View>
    )
  }

  console.log(wrapperHeight, 'wrapperHeight')

  return (
    <>
      <View className="factory grid grid-rows-[58Px_1fr] h-[100vh]">
        <View
          id="factory-header"
          className="factory-header flex items-center top-0 bg-white pl-2 pr-2 border-0 !border-b border-solid border-[#f6f6f6]"
        >
          <View className="location flex items-center mr-1" onClick={() => setIsVisible(true)}>
            <IconFont className="nut-icon-am-jump nut-icon-am-infinite" name="locationg3" />
            <View className="location-text leading-10 mr-1 ml-1 text-ellipsis overflow-hidden whitespace-nowrap max-w-12 text-sm">
              {displayLocatiopn}
            </View>
          </View>
          <View className="flex items-center w-full justify-start relative">
            <SearchBar
              onChange={(val: string) => onSearch(val)}
              shape="round"
              style={{ ['--nutui-searchbar-input-height']: '38PX' } as any}
            />
          </View>
        </View>

        <View className="factory-wrapper grid grid-cols-[21%_1fr]">
          <View className="category-list bg-[#f6f6f6]">
            {!!wrapperHeight && (
              <VirtualList
                containerHeight={wrapperHeight}
                itemHeight={45}
                list={categoryList}
                itemRender={itemRender}
                itemEqual={true}
                overscan={10}
                margin={0}
              />
            )}
            {/* <View className="loading flex items-baseline justify-center h-full">
             <Loading direction="vertical" icon={<Star size={24} color="red" />} />
            </View> */}
          </View>
          <View className="factory-list pl-2 pr-4">
            {/* 厂家列表 */}
            {factoryList.map((item) => {
              return (
                <View className="factory-item flex gap-3 items-center mt-3" key={item.id}>
                  <Image className="logo" src={item.backgroundImageUrl} radius={5} height={60} width={60} />
                  <View className="factory-content flex flex-auto border-0 !border-b border-solid border-[#ebeaea] pb-1">
                    <View className="factory-info flex-auto">
                      <View className="name text-base font-bold leading-6">{item.companyName}</View>
                      <View className="desc text-gray-400 text-xs leading-5">{item.district}</View>
                      <View className="text-red-600 text-xs flex items-center leading-4 gap-1">
                        <View>去咨询</View>
                        <IconFont size={10} name="message" className="mt-[2Px]" />
                      </View>
                    </View>
                    <View className="location text-gray-400 text-xs leading-2">{item.city}</View>
                  </View>
                </View>
              )
            })}
          </View>
        </View>
        <Cascader
          visible={isVisible}
          value={locationValue}
          title="厂家地址"
          options={options}
          closeable
          onClose={() => {
            setIsVisible(false)
          }}
          onChange={onChange}
          className="pb-5"
        />
      </View>
    </>
  )
}

export default Factory
