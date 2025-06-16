import { View, Text, Image } from '@tarojs/components'
import './index.scss'

interface MessageItemProps {
  message: {
    ID: string
    from: string
    payload: {
      text?: string
      data?: string
    }
    type: string
    flow: 'in' | 'out'
  }
  isSelf: boolean
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isSelf }) => {
  const renderMessageContent = () => {
    switch (message.type) {
      case 'TIMTextElem':
        return (
          <View className="text-message">
            <Text>{message.payload.text}</Text>
          </View>
        )
      case 'TIMCustomElem':
        try {
          const customData = JSON.parse(message.payload.data || '{}')
          switch (customData.type) {
            case 'voice':
              return (
                <View className="voice-message">
                  <View className="voice-icon" />
                  <Text>{customData.duration}s</Text>
                </View>
              )
            case 'image':
              return (
                <View className="image-message">
                  <Image src={customData.url} mode="widthFix" />
                </View>
              )
            default:
              return null
          }
        } catch (error) {
          console.error('解析自定义消息失败:', error)
          return null
        }
      default:
        return null
    }
  }

  return (
    <View className={`message-item ${isSelf ? 'self' : 'other'}`}>
      <View className="avatar">
        <Image src={isSelf ? '/assets/avatar-self.png' : '/assets/avatar-other.png'} />
      </View>
      <View className="content">
        {renderMessageContent()}
      </View>
    </View>
  )
}

export default MessageItem
