import Taro from '@tarojs/taro'

interface FileInfo {
  name: string
  size: number
  type: string
  url: string
  ossId: string
}

interface OssData {
  url: string
  ossId: string
}

const sendMiniProgramMessage = (data: any) => {
  import('weixin-js-sdk').then(({ default: wx }) => {
    wx.miniProgram.postMessage({
      // 向小程序发送消息
      data,
    })
  })
}

export const sendNavigateBack = (backUrl: string) => {
  import('weixin-js-sdk').then(({ default: wx }) => {
    try {
      console.log('closeWindow',WeixinJSBridge)

      wx.miniProgram.navigateBack(undefined)
    } catch (error) {
      console.log(error, 'error')
    }
  })
}

export const isWx = () => {
  const ua = navigator.userAgent.toLowerCase() /*  */
  console.log(ua, 'ua')

  if (ua.startsWith('micromessenger') || ua.includes('miniprogramhtmlwebview') || ua.includes('miniprogram')) {
    // 在微信环境中
    return new Promise((resolve) => {
      import('weixin-js-sdk').then(({ default: wx }) => {
        wx.miniProgram.getEnv(function (res) {
          // 如果是小程序环境
          resolve(res.miniprogram ? 'mini-wx' : 'wx')
        })
      })
    })
  } else {
    // 不在微信中
    return Promise.resolve('no-wx')
  }
}

export const sendWxMessage = (data: any) => {
  const { type, data: messageData } = data
  isWx()
    .then((env) => {
      if (env === 'mini-wx') {
        // 在小程序中，并且存在 goodDetail.id
        sendMiniProgramMessage({
          type,
          data: messageData,
        })
      }
    })
    .catch((error) => {
      // 处理错误，如果有的话
      console.error('Error checking WeChat environment:', error)
    })
}

/**
 * 发送文件上传完成消息
 * @param file 文件信息
 * @param ossData OSS数据
 */
export function sendUploadCompleteMessage(file: File, ossData: OssData) {
  const fileInfo: FileInfo = {
    name: file.name,
    size: file.size,
    type: file.type,
    url: ossData.url,
    ossId: ossData.ossId,
  }

  // 根据不同环境使用不同的消息发送方式
  const env = Taro.getEnv()

  if (env === 'WEB') {
    Taro.showToast({
      title: 'H5环境',
      icon: 'none',
    })
    isWx()
      .then((type) => {
        if (type === 'mini-wx') {
          // 在小程序中，并且存在 goodDetail.id
          sendMiniProgramMessage({
            type: 'UPLOAD_COMPLETE',
            data: fileInfo,
          })
        }
      })
      .catch((error) => {
        // 处理错误，如果有的话
        console.error('Error checking WeChat environment:', error)
      })
    // H5环境使用 window.postMessage
    // window.parent.postMessage(
    //   {
    //     type: 'UPLOAD_COMPLETE',
    //     data: fileInfo,
    //   },
    //   '*'
    // )
  } else if (env === 'WEAPP') {
    // 微信小程序环境使用 Taro.eventCenter
    Taro.eventCenter.trigger('UPLOAD_COMPLETE', fileInfo)
  } else if (env === 'RN') {
    // React Native环境使用 Taro.eventCenter
    Taro.eventCenter.trigger('UPLOAD_COMPLETE', fileInfo)
  } else {
    // 其他环境使用 Taro.eventCenter
    Taro.eventCenter.trigger('UPLOAD_COMPLETE', fileInfo)
  }
}
