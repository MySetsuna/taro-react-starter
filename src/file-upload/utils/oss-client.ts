import OSS from 'ali-oss'

export interface OssConfig {
  clientId: string
  token: string
  baseUrl: string
}

export interface OssTokenInfo {
  objectKey: string
  region: string
  endpoint: string
  accessKeyId: string
  accessKeySecret: string
  stsToken: string
  bucket: string
}

export interface OssUploadResult {
  url: string
  ossId: string
}

export interface OssClient {
  init: (fileName: string, config: OssConfig) => Promise<void>
  upload: (file: File, onProgress?: (percent: number) => void) => Promise<OssUploadResult>
  pause: () => Promise<void>
  resume: (file: File, onProgress?: (percent: number) => void) => Promise<OssUploadResult>
}

class AliOssClient implements OssClient {
  private client?: OSS
  private checkpoint?: any
  private objectKey: string = ''
  private config?: OssConfig

  async init(fileName: string, config: OssConfig) {
    this.config = config
    const tokenInfo = await this.getStsToken(fileName, 'default_custom')
    this.objectKey = tokenInfo.objectKey
    this.client = new OSS({
      authorizationV4: true,
      region: tokenInfo.region,
      endpoint: tokenInfo.endpoint,
      accessKeyId: tokenInfo.accessKeyId,
      accessKeySecret: tokenInfo.accessKeySecret,
      stsToken: tokenInfo.stsToken,
      bucket: tokenInfo.bucket,
      retryMax: 5,
      refreshSTSToken: async () => {
        const newTokenInfo = await this.refreshStsToken(this.objectKey)
        return {
          accessKeyId: newTokenInfo.accessKeyId,
          accessKeySecret: newTokenInfo.accessKeySecret,
          stsToken: newTokenInfo.stsToken,
        }
      },
      refreshSTSTokenInterval: 10 * 60 * 1000, // 10分钟刷新一次
    })
  }

  async upload(file: File, onProgress?: (percent: number) => void): Promise<OssUploadResult> {
    if (!this.client) {
      throw new Error('OSS client not initialized')
    }

    console.log(this.objectKey, 'this.objectKey')
    const uploadTask = this.client.multipartUpload(this.objectKey, file, {
      partSize: 1024 * 1024, // 1MB
      parallel: 5,
      headers: {
        'Cache-Control': 'no-cache',
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,
        'x-oss-forbid-overwrite': 'true',
      },
      progress: async (p, cpt) => {
        this.checkpoint = cpt
        onProgress?.(p * 100)
      },
      success: (result) => {
        console.log(`success:`, result)
      },
      error: (err) => {
        console.error(`error:`, err)
      },
    })

    const result = await uploadTask
		console.log(`multiPartUpload result:`, result);
    const ossInfo = await this.finishUpload(this.objectKey)
    return ossInfo.data
  }

  async pause(): Promise<void> {
    if (!this.client) {
      throw new Error('OSS client not initialized')
    }
    await this.client.cancel()
  }

  async resume(file: File, onProgress?: (percent: number) => void): Promise<OssUploadResult> {
    if (!this.client || !this.checkpoint) {
      throw new Error('OSS client not initialized or no checkpoint')
    }

    const uploadTask = this.client.multipartUpload(this.objectKey, file, {
      partSize: 1024 * 1024, // 1MB
      parallel: 5,
      checkpoint: this.checkpoint,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Disposition': file.name,
        'x-oss-forbid-overwrite': 'true',
      },
      progress: async (p, cpt) => {
        this.checkpoint = cpt
        onProgress?.(p * 100)
      },
    })

    await uploadTask
    const ossInfo = await this.finishUpload(this.objectKey)
    return ossInfo.data
  }

  private async getStsToken(fileName: string, configKey: string): Promise<OssTokenInfo> {
    if (!this.config) {
      throw new Error('OSS config not initialized')
    }

    const url = `${this.config.baseUrl}/oss/sts/token?fileName=${fileName}&configKey=${configKey}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        clientid: this.config.clientId,
        authorization: `Bearer ${this.config.token}`,
      },
    })
    const res = await response.json()
    return res.data
  }

  private async refreshStsToken(objectKey: string): Promise<OssTokenInfo> {
    if (!this.config) {
      throw new Error('OSS config not initialized')
    }

    const url = `${this.config.baseUrl}/oss/sts/refresh?objectKey=${objectKey}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        clientid: this.config.clientId,
        authorization: `Bearer ${this.config.token}`,
      },
    })
    const res = await response.json()
    return res.data
  }

  private async finishUpload(objectKey: string) {
    if (!this.config) {
      throw new Error('OSS config not initialized')
    }

    const url = `${this.config.baseUrl}/oss/upload/finish?key=${objectKey}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        clientid: this.config.clientId,
        authorization: `Bearer ${this.config.token}`,
      },
    })
    return response.json()
  }
}

// 工厂函数，用于创建不同平台的OSS客户端
export function createOssClient(platform: 'aliyun' | 'qiniu' | 'tencent'): OssClient {
  switch (platform) {
    case 'aliyun':
      return new AliOssClient()
    case 'qiniu':
      // TODO: 实现七牛云客户端
      throw new Error('Qiniu OSS client not implemented')
    case 'tencent':
      // TODO: 实现腾讯云客户端
      throw new Error('Tencent OSS client not implemented')
    default:
      throw new Error(`Unsupported OSS platform: ${platform}`)
  }
}
