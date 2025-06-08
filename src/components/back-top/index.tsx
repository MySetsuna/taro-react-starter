import { Top } from '@nutui/icons-react-taro'
import { View } from '@tarojs/components'

export const BackTop = (props: { onToTop: () => void; isShow: boolean }) => {
  return (
    <View
      onTouchEnd={props.onToTop}
      className="w-12 h-12 rounded-full bg-[#f7f7f7ab] active:bg-[#e9e9e9] hover:bg-[#e9e9e9] shadow border border-solid border-[#aaaaaa] fixed bottom-20 right-3 z-[999] text-[#aaaaaa] flex items-center justify-center"
      style={props.isShow ? {} : { visibility: 'hidden', pointerEvents: 'none' }}
    >
      <Top size={25}/>
    </View>
  )
}
