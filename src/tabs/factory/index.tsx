import { ScrollView, View } from '@tarojs/components'
import {
  Address,
  Button,
  Cascader,
  CascaderOption,
  Image,
  InfiniteLoading,
  Loading,
  SearchBar,
  Toast,
  VirtualList,
} from '@nutui/nutui-react-taro'
import { Location, Message, Star } from '@nutui/icons-react-taro'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useDebounce } from '@/hooks/common'
import { EResponseCode, request } from '@/api'
import { ICategory, IFactory } from 'types/module'
import { IRowsResponse } from 'types/http'
import { useFactoryStore } from '@/models/factory'
import Taro, { useDidShow, useLaunch } from '@tarojs/taro'
import './index.scss'
import { BackTop } from '@/components/back-top'

function Factory() {
  // value
  const factoryList = useFactoryStore.use.factoryList()
  const locationValue = useFactoryStore.use.currentLocation()
  const searchValue = useFactoryStore.use.searchValue()
  const categorys = useFactoryStore.use.categories()
  const currentCategory = useFactoryStore.use.currentCategory()
  const areaData = useFactoryStore.use.areaData()

  // set
  const setFactoryList = useFactoryStore.use.setFactoryList()
  const setLocationValue = useFactoryStore.use.setLocation()
  const setSearchValue = useFactoryStore.use.setSearchValue()
  const setCurrentCategory = useFactoryStore.use.setCurrentCategory()

  // fetch
  const fetchCategoryList = useFactoryStore.use.fetchCategoryList()
  const fetchAreaData = useFactoryStore.use.fetchAreaData()

  const [isVisible, setIsVisible] = useState(false)
  const [wrapperHeight, setWrapperHeight] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)

  const categoryList = useMemo(() => categorys.slice(), [categorys])

  const options = useMemo(() => {
    const options: Array<CascaderOption> = areaData.slice().map((item) => {
      const children = item.children.map((child) => {
        return {
          value: child.value,
          text: child.label,
        }
      })
      if (children.length > 1) {
        children.unshift({
          value: -1,
          text: '不限',
        })
      }
      return {
        value: item.value,
        text: item.label,
        children,
      }
    })
    options.unshift({
      value: -1,
      text: '全国',
    })
    return options
  }, [areaData])

  const displayLocatiopn = useMemo(() => {
    let displayLocatiopn = '全国'
    options.forEach((item: any) => {
      if (item.value === locationValue[0]) {
        if (locationValue[1] > 0) {
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
    setLocationValue(value)
  }

  const getWrapperHeight = useCallback(() => {
    return new Promise<number>((resolve) => {
      let wrapperHeight = 600
      const fullHeight = Taro.getWindowInfo().windowHeight
      const query = Taro.createSelectorQuery()
      query.select('#factory-header').boundingClientRect()
      query.select('.nut-tabbar').boundingClientRect()
      query.exec((res) => {
        if (res) {
          const headerHeight = res[0].height
          const tabbarHeight = res[1].height
          wrapperHeight = fullHeight - headerHeight - tabbarHeight
        }
        resolve(wrapperHeight)
      })
    })
  }, [])

  const fetchFactoryList = useCallback(async () => {
    const data = await request<IRowsResponse<IFactory>>('/app/tenant/list', {
      method: 'GET',
      params: {
        province: locationValue[0] > 0 ? locationValue[0] : undefined,
        city: locationValue[1] > 0 ? locationValue[1] : undefined,
        name: searchValue || undefined,
        // tenantType: '[01]',
        tenantCategoryId: currentCategory,
      },
    })
    console.log(data, 'data')

    if (data.code === EResponseCode.SUCCESS) {
      setFactoryList(data.rows)
    }
  }, [locationValue, searchValue, currentCategory])

  const debouncedSearch = useDebounce(fetchFactoryList, 300)

  useEffect(() => {
    debouncedSearch()
  }, [locationValue, searchValue, currentCategory])

  useEffect(() => {
    fetchCategoryList()
    fetchAreaData()
    getWrapperHeight().then((height) => {
      setWrapperHeight(height)
    })
  }, [])


  return (
    <>
      <View className="factory grid grid-rows-[58Px_1fr] h-[100vh]">
        <View
          id="factory-header"
          className="factory-header flex items-center top-0 bg-white z-10 pl-2 pr-2 border-0 !border-b border-solid border-[#e2e2e2] fixed w-full h-[58Px] box-border"
        >
          <View className="location flex items-center mr-1" onClick={() => setIsVisible(true)}>
            <Location className="nut-icon-am-jump nut-icon-am-infinite" name="locationg3" />
            <View className="location-text leading-10 mr-1 ml-1 text-ellipsis overflow-hidden whitespace-nowrap w-12 text-sm">
              {displayLocatiopn}
            </View>
          </View>
          <View className="flex items-center w-full justify-start relative">
            <SearchBar
              onSearch={setSearchValue}
              shape="round"
              style={{ ['--nutui-searchbar-input-height']: '38PX' } as any}
            />
          </View>
        </View>

        <View
          className="factory-wrapper grid grid-cols-[21%_1fr] fixed top-[58Px] w-full h-[100vh]"
          style={!!wrapperHeight ? { height: `${wrapperHeight}Px` } : undefined}
        >
          <InfiniteLoading
            enhanced
            showScrollbar={false}
            className="category-list bg-[#f6f6f6] overflow-y-auto overflow-x-hidden !h-[inherit] "
          >
            {categoryList.map((item) => {
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
            })}
          </InfiniteLoading>
          <InfiniteLoading
            enhanced
            showScrollbar={false}
            className="factory-list pl-2 overflow-y-auto overflow-x-hidden !h-[inherit]"
            pullRefresh
            onRefresh={fetchFactoryList}
            scrollAnimationDuration="200"
            scrollWithAnimation
            onScroll={setScrollTop}
            scrollTop={scrollTop === -1 ? 0 : undefined}
          >
            {factoryList.map((item, index) => {
              return (
                <View
                  className="factory-item flex gap-3 items-center mt-3 pr-3"
                  key={item.id}
                  id={`factory-list-${index}`}
                >
                  <Image className="logo" src={item.backgroundImageUrl} radius={5} height={70} width={70} />
                  <View className="factory-content flex flex-auto border-0 !border-b border-solid border-[#e2e2e2] w-0 h-[70Px]  pb-1">
                    <View className="factory-info flex-auto h-full flex flex-col justify-between w-0">
                      <View className="name text-base font-bold leading-6 w-100% text-ellipsis overflow-hidden whitespace-nowrap">
                        {item.companyName}
                      </View>
                      <View className="desc text-gray-400 text-xs leading-5 h-5 text-ellipsis overflow-hidden whitespace-nowrap">
                        {item.intro}
                      </View>
                      <Button type="primary" size="mini" style={{ width: '50%' }}>
                        <View className="flex items-center leading-4 gap-1 ">
                          <View>去咨询</View>
                          <Message size={10} name="message" />
                        </View>
                      </Button>
                    </View>
                    <View className="location text-gray-400 text-xs leading-2">{item.city}</View>
                  </View>
                </View>
              )
            })}
            <BackTop isShow={scrollTop > 100} onToTop={() => setScrollTop(-1)} />
          </InfiniteLoading>
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
