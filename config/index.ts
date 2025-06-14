import { defineConfig } from '@tarojs/cli'
import devConfig from './dev'
import prodConfig from './prod'
import mainConfig from './main.config'
import fileUploadConfig from './file-upload.config'

const appType = process.env.TARO_APP_TYPE || 'main'
const currentConfig = appType === 'file-upload' ? fileUploadConfig : mainConfig

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
// @ts-expect-error
export default defineConfig(async (merge, { command, mode }) => {
  console.log(appType, 'current appType ========= >mode')

  const envConfig = process.env.NODE_ENV === 'development' ? devConfig : prodConfig
  return merge({}, currentConfig, envConfig)
})
