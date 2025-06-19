import { ArrowDown, Check } from '@nutui/icons-react-taro'
import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useRef, useState } from 'react'

interface FileDownloadProps {
  url: string
  size: number
  id: string
  isDownloaded: boolean
  savedPath?: string
  downloadPath?: string
  fileName?: string
  onSuccess?: (res: Taro.saveFile.SuccessCallbackResult, id: string) => void
  onFail?: (error: any) => void
  className?: string
  buttonText?: string
}

const FileDownload: React.FC<FileDownloadProps> = ({
  url,
  size,
  id,
  isDownloaded,
  savedPath,
  downloadPath,
  fileName,
  onSuccess,
  onFail,
  className,
  buttonText = '下载文件',
}) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileSystemManager = useRef<Taro.FileSystemManager>(Taro.getFileSystemManager())

  const handleDownload = async () => {
    if (!url) {
      Taro.showToast({
        title: '下载地址不能为空',
        icon: 'none',
      })
      return
    }

    setIsDownloading(true)
    setProgress(0)

    try {
      const downloadTask = Taro.downloadFile({
        filePath: downloadPath ? `${downloadPath}/${fileName}` : undefined,
        url,
        success: (res) => {
          if (res.statusCode === 200) {
            Taro.saveFile({
              tempFilePath: res.tempFilePath,
              success: (res) => {
                console.log(res, 'res saveFile')
                onSuccess?.(res, id)
                Taro.showToast({
                  title: `下载完成`,
                  icon: 'success',
                })
                fileSystemManager.current.readdir({
                  dirPath: downloadPath,
                  success: (res) => {
                    console.log(res, 'res readdir')
                  },
                })
              },
              fail: (error) => {
                console.error('下载失败:', error)
                onFail?.(error)
              },
            })

            console.log(res, 'res')
          } else {
            Taro.showToast({
              title: '下载失败',
              icon: 'none',
            })
            onFail?.(new Error(`下载失败，状态码: ${res.statusCode}`))
          }
        },
        fail: (error) => {
          console.error('下载失败:', error)
          onFail?.(error)
        },
        complete: () => {
          setIsDownloading(false)
          setProgress(0)
        },
      })

      // 监听下载进度
      downloadTask.onProgressUpdate((res) => {
        setProgress(res.progress)
      })
    } catch (error) {
      console.error('下载出错:', error)
      onFail?.(error)
      setIsDownloading(false)
    }
  }

  return (
    <View className={className}>
      <View className="text-xs text-gray-500">{fileName}</View>
      <View className="text-xs text-gray-500">{Math.round(size / 1024 / 1024)}MB</View>
      <View className="flex items-center flex-col text-xs">
        {isDownloaded ? (
          <Check
            size={20}
            color="#000"
            onClick={() => {
              fileSystemManager.current.readFile({
                filePath: savedPath,
                success: (res) => {
                  console.log(res, 'res fileSystemManager readFile')
                },
              })
            }}
          />
        ) : (
          <ArrowDown size={20} color="#000" />
        )}
        {isDownloading ? (
          `下载中 ${progress}%`
        ) : isDownloaded ? (
          '已下载'
        ) : (
          <View onClick={handleDownload}>{buttonText}</View>
        )}
      </View>
      {isDownloaded && savedPath && (
        <View
          className="text-xs text-gray-500 underline break-all"
          onClick={() => {
            fileSystemManager.current.readFile({
              filePath: savedPath,
              success: (res) => {
                console.log(res, 'res fileSystemManager readFile')
              },
            })
          }}
        >
          {savedPath}
        </View>
      )}
    </View>
  )
}

export default FileDownload
