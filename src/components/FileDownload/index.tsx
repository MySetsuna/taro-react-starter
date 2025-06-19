import { ArrowDown, Check } from '@nutui/icons-react-taro'
import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemo, useRef, useState } from 'react'

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
      // 下载文件 通过
      const filePath = `${Taro.env.USER_DATA_PATH}/${fileName}`
      console.log(filePath, 'filePath')

      Taro.request({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
        success: (res) => {
          if (res.statusCode === 200) {
            fileSystemManager.current.writeFile({
              filePath,
              data: res.data,
              encoding: 'binary',
              success: () => {
                // Taro.saveFile({
                //   filePath,
                //   tempFilePath: url,
                //   success: (saveRes) => {
                //     onSuccess?.(saveRes, id)
                //     Taro.showToast({
                //       title: '下载完成',
                //       icon: 'success',
                //     })
                //   },
                //   fail: (error) => {
                //     console.error('保存文件失败:', error)
                //     onFail?.(error)
                //     Taro.showToast({
                //       title: '保存文件失败',
                //       icon: 'none',
                //     })
                //   },
                // })
                console.log(filePath, 'filePath')

                onSuccess?.({ savedFilePath: filePath, errMsg: 'success' }, id)
              },
              fail: (error) => {
                console.error('写入文件失败:', error)
                onFail?.(error)
                Taro.showToast({
                  title: '写入文件失败',
                  icon: 'none',
                })
              },
            })
          } else {
            console.error('下载失败:', res.statusCode)
            onFail?.(new Error(`下载失败，状态码: ${res.statusCode}`))
            Taro.showToast({
              title: '下载失败',
              icon: 'none',
            })
          }
        },
        fail: (error) => {
          console.error('请求失败:', error)
          onFail?.(error)
          Taro.showToast({
            title: '请求失败',
            icon: 'none',
          })
        },
        complete: () => {
          setIsDownloading(false)
          setProgress(0)
        },
      })
    } catch (error) {
      console.error('下载出错:', error)
      onFail?.(error)
      setIsDownloading(false)
    }
  }

  const showSize = useMemo(() => {
    let showSize = Math.round(size / 1024 / 1024)
    if (showSize < 1) {
      return `${Math.ceil(size / 1024)}KB`
    }
    if (showSize > 1024) {
      return `${Math.round(showSize / 1024)}GB`
    }
    return `${showSize}MB`
  }, [size])
  return (
    <View className={className}>
      <View className="text-xs text-gray-500">{fileName}</View>
      <View className="text-xs text-gray-500">{showSize}</View>
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
            Taro.navigateTo({
              url: `${savedPath}`,
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
