import { useState, useEffect, useRef } from 'react'
import Taro from '@tarojs/taro'
import { ScrollView, View, Text } from '@tarojs/components'
import './index.scss'

interface UpperLoadScrollViewProps {
  onLoadMore: () => Promise<any[]>
  renderItem: (item: any, index: number) => React.ReactNode
  initialData?: any[]
  pageSize?: number
  threshold?: number
  className?: string
  style?: React.CSSProperties
  emptyText?: string
  loadingText?: string
  noMoreText?: string
  latestText?: string
}

const UpperLoadScrollView: React.FC<UpperLoadScrollViewProps> = ({
  onLoadMore,
  renderItem,
  initialData = [],
  pageSize = 10,
  threshold = 100,
  className = '',
  style = {},
  emptyText = '暂无数据',
  loadingText = '加载中...',
  noMoreText = '已加载全部数据',
  latestText = '已显示最新数据'
}) => {
  const [list, setList] = useState<any[]>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const scrollViewRef = useRef<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const loadingLock = useRef(false)

  // 获取当前滚动内容高度
  const getScrollHeight = () => {
    return new Promise<number>(resolve => {
      Taro.createSelectorQuery()
        .select('#upper-load-scroller')
        .boundingClientRect()
        .exec((res) => {
          const rect = res[0]
          resolve(rect?.height || 0)
        })
    })
  }

  // 调整滚动位置保持视觉连续
  const adjustScrollPosition = (prevHeight: number) => {
    Taro.createSelectorQuery()
      .select('#upper-load-scroller')
      .boundingClientRect()
      .exec((res) => {
        const rect = res[0]
        if (rect?.height) {
          const newHeight = rect.height
          const scrollTop = newHeight - prevHeight

          Taro.nextTick(() => {
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollTo({
                top: scrollTop,
                animated: false
              })
            }
          })
        }
      })
  }

  // 加载历史数据
  const loadHistoryData = async () => {
    if (loadingLock.current || isLoading || !hasMore) return

    loadingLock.current = true
    setIsLoading(true)

    try {
      // 1. 记录当前滚动高度
      const prevHeight = await getScrollHeight()

      // 2. 获取新数据
      const newData = await onLoadMore()

      if (newData && newData.length > 0) {
        // 3. 将新数据添加到列表顶部
        setList(prev => [...newData, ...prev])

        // 4. 计算并设置新滚动位置
        setTimeout(() => {
          adjustScrollPosition(prevHeight)
        }, 50)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('加载失败', error)
    } finally {
      setIsLoading(false)
      loadingLock.current = false
    }
  }

  // 滚动事件处理
  const handleScroll = (e: any) => {
    const { scrollTop } = e.detail

    // 节流处理
    if (timerRef.current) return
    timerRef.current = setTimeout(() => {
      timerRef.current = null

      // 当滚动到顶部附近时触发加载
      if (scrollTop < threshold && !isLoading && hasMore) {
        loadHistoryData()
      }
    }, 300)
  }

  // 初始化加载最新数据
  useEffect(() => {
    if (initialData.length === 0) {
      loadHistoryData()
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return (
    <ScrollView
      id="upper-load-scroller"
      ref={scrollViewRef}
      scrollY
      className={`upper-load-scroll-view ${className}`}
      style={{ height: '100%', ...style }}
      onScroll={handleScroll}
      scrollWithAnimation
      scrollTop={0}
      enableBackToTop
    >
      {/* 顶部加载状态 */}
      <View className="header-loader">
        {isLoading && (
          <View className="loading-indicator">
            <View className="spinner" />
            <Text className="loading-text">{loadingText}</Text>
          </View>
        )}
        {!hasMore && list.length > 0 && (
          <Text className="no-more">{noMoreText}</Text>
        )}
      </View>

      {/* 数据列表 */}
      {list.length > 0 ? (
        list.map((item, index) => (
          <View
            id={`item-${index}`}
            key={index}
            className="scroll-item"
          >
            {renderItem(item, index)}
          </View>
        ))
      ) : (
        <View className="empty-state">
          <Text>{emptyText}</Text>
        </View>
      )}

      {/* 底部最新数据提示 */}
      {list.length > 0 && (
        <View className="latest-indicator">
          <Text>{latestText}</Text>
        </View>
      )}
    </ScrollView>
  )
}

export default UpperLoadScrollView
