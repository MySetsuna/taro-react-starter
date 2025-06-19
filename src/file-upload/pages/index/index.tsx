import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { Button, View } from '@tarojs/components'
import { type OssClient, type OssConfig, createOssClient } from '../../utils/oss-client'
import { sendNavigateBack, sendUploadCompleteMessage, sendWxMessage } from '../../utils/message-sender'
import './index.scss'
import { NavBar } from '@nutui/nutui-react-taro'
import { ArrowLeft } from '@nutui/icons-react-taro'

const MB = 1024 * 1024
const GB = 1024 * MB

export default function FileUpload() {
  const [showSelect, setShowSelect] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [fileName, setFileName] = useState('')
  const [status, setStatus] = useState<'inited' | 'uploading' | 'paused' | 'success'>('inited')
  const [percent, setPercent] = useState(0)

  const [ossClient, setOssClient] = useState<OssClient>()
  const [file, setFile] = useState<File>()
  const [backUrl, setBackUrl] = useState('')

  // 初始化参数
  const [clientConfig, setClientConfig] = useState<OssConfig>({
    clientId: '',
    token: '',
    baseUrl: '',
  })

  useEffect(() => {
    const params = Taro.getCurrentInstance().router?.params
    console.log(params, 'params')
    setBackUrl(params?.backUrl || '')
    setClientConfig({
      clientId: params?.clientId || '',
      token: params?.token || '',
      baseUrl: params?.baseUrl || '',
    })
    sendWxMessage({
      type: 'UPLOAD_CONFIG_INIT',
      data: params,
    })
  }, [])

  const selectFile = async () => {
    const env = Taro.getEnv()
    if (env === 'WEB') {
      const input = document.createElement('input')
      input.type = 'file'
      input.onchange = (e) => {
        const selectedFile = (e.target as HTMLInputElement).files?.[0]
        if (selectedFile) {
          setFile(selectedFile)
          setFileName(selectedFile.name)
          setStatus('inited')
          setShowUpload(true)
          setShowSelect(false)
        }
      }
      input.click()
    }
  }

  const initUpload = async () => {
    const client = createOssClient('aliyun') // 这里可以根据配置选择不同的平台
    await client.init(fileName, clientConfig)
    setOssClient(client)
  }

  console.log(ossClient, 'ossClientossClientossClientossClientossClient')

  const startUpload = async () => {
    console.log(file, 'file', ossClient, 'ossClient')

    if (!file) {
      Taro.showToast({ title: '请选择文件', icon: 'none' })
      return
    }

    if (!ossClient) {
      Taro.showToast({ title: '初始化失败', icon: 'error' })
    }

    if (file.size >= 5 * GB) {
      Taro.showToast({ title: '文件大小不能超过5G', icon: 'none' })
      return
    }

    setShowSelect(false)
    // try {
    const ossInfo = await ossClient.upload(file, (p) => {
      setPercent(p)
    })
    setStatus('success')
    sendUploadCompleteMessage(file, ossInfo)
    // } catch (error) {
    //   console.log(error, 'error')
    //   Taro.showToast({ title: '上传失败', icon: 'error' })
    // }
  }

  const pauseUpload = async () => {
    if (!ossClient) return

    try {
      await ossClient.pause()
      setStatus('paused')
    } catch {
      Taro.showToast({ title: '暂停失败', icon: 'error' })
    }
  }

  const resumeUpload = async () => {
    if (!ossClient || !file) return

    try {
      const ossInfo = await ossClient.resume(file, (p) => {
        setPercent(p)
      })
      setStatus('success')
      sendUploadCompleteMessage(file, ossInfo)
    } catch {
      Taro.showToast({ title: '继续上传失败', icon: 'error' })
    }
  }

  const goBack = () => {
    sendNavigateBack(backUrl)
  }

  const onFinishUpload = () => {
    sendWxMessage({
      type: 'UPLOAD_CONFIRM',
    })
    goBack()
  }

  console.log(window.parent, '9999999999999999999')

  useEffect(() => {
    console.log(clientConfig, 'clientConfig', fileName, 'fileName')

    if (clientConfig.clientId && clientConfig.token && clientConfig.baseUrl && fileName) {
      console.log('initUpload')

      initUpload()
    }
  }, [clientConfig, fileName])

  return (
    <View className="container">
      {showSelect && (
        <View className="selector-container">
          <Button onClick={selectFile}>选择文件</Button>
        </View>
      )}
      {/* 文件信息与按钮区域 */}
      {showUpload && (
        <View className="file-info-container">
          <View className="file-and-buttons">
            <View className="file-name">{fileName}</View>
            <View className="button-group">
              {status === 'inited' && <Button onClick={startUpload}>上传</Button>}
              {status === 'uploading' && <Button onClick={pauseUpload}>暂停</Button>}
              {status === 'paused' && <Button onClick={resumeUpload}>继续</Button>}
              {status === 'success' && <Button onClick={onFinishUpload}>完成</Button>}
            </View>
          </View>
        </View>
      )}
      {/* 进度条 */}
      {showUpload && (
        <View className="progress-container">
          <View className="progress-bar" style={{ width: `${percent}%` }} />
        </View>
      )}
    </View>
  )
}
