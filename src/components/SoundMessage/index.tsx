import { View, Text, Progress } from '@tarojs/components'
import { useState, useRef, useEffect } from 'react'
import { Loading, VolumeMax, VolumeMute } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import './index.scss'

interface SoundMessageProps {
  url: string
  duration: number
  isSelf?: boolean
  onConvertVoiceToText?: () => Promise<string>
}

const SoundMessage: React.FC<SoundMessageProps> = ({ url, duration, isSelf = false, onConvertVoiceToText }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [translatedText, setTranslatedText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<any>(null)
  const longPressTimer = useRef<any>(null)

  useEffect(() => {
    // 初始化音频实例
    audioRef.current = Taro.createInnerAudioContext()

    // 设置音频源
    audioRef.current.src = url

    // 监听播放结束
    audioRef.current.onPause(() => {
      setIsPlaying(false)
    })

    audioRef.current.onStop(() => {
      setIsPlaying(false)
    })

    audioRef.current.onEnded(() => {
      setIsPlaying(false)
      setCurrentTime(0)
    })

    // 监听播放进度
    audioRef.current.onTimeUpdate(() => {
      setCurrentTime(audioRef.current.currentTime)
    })

    // 监听播放错误
    audioRef.current.onError((err) => {
      console.error('音频播放错误:', err)
      setIsPlaying(false)
      Taro.showToast({
        title: '播放失败',
        icon: 'none',
      })
    })

    return () => {
      // 组件卸载时销毁音频实例
      if (audioRef.current) {
        audioRef.current.destroy()
      }
    }
  }, [url])

  // 处理播放/暂停
  const handlePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      // 如果已经播放到末尾，重新开始播放
      if (currentTime >= duration) {
        audioRef.current.seek(0)
      }
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  // 处理长按开始
  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(async () => {
      if (onConvertVoiceToText) {
        setIsTranslating(true)
        try {
          const text = await onConvertVoiceToText()
          setTranslatedText(text)
        } catch (error) {
          console.error('语音转文字失败:', error)
          Taro.showToast({
            title: '转文字失败',
            icon: 'none',
          })
        } finally {
          setIsTranslating(false)
        }
      }
    }, 500) // 500ms 长按触发
  }

  // 处理长按结束
  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }

  // 计算播放进度
  const progress = Math.max(0, Math.min(100, (currentTime / duration) * 100))
  const remainingTime = Math.max(0, duration - currentTime).toFixed(0)

  return (
    <View className={`sound-message ${isSelf ? 'self' : ''}`}>
      <View className="sound-content" onClick={handlePlay} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {isSelf ? (
          <>
            <Text className="duration">{remainingTime}s</Text>
            <View className="sound-icon">
              {isPlaying ? <Loading size={20} /> : <VolumeMax size={20} />}
              {isPlaying && <Progress percent={progress} strokeWidth={3} />}
            </View>
          </>
        ) : (
          <>
            <View className="sound-icon">
              {isPlaying ? <Loading size={20} /> : <VolumeMax size={20} />}
              {isPlaying && <Progress percent={progress} strokeWidth={3} />}
            </View>
            <Text className="duration">{remainingTime}s</Text>
          </>
        )}
      </View>

      {translatedText && (
        <View className="translated-text">
          <Text>{translatedText}</Text>
        </View>
      )}

      {isTranslating && (
        <View className="translating">
          <Text>正在转文字...</Text>
        </View>
      )}
    </View>
  )
}

export default SoundMessage
