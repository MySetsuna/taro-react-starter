import { defineConfig } from '@tarojs/cli'
import type { UserConfigExport } from '@tarojs/cli'
import path from 'node:path'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack'

const WeappTailwindcssDisabled = ['h5', 'rn'].includes(process.env.TARO_ENV)

const config: UserConfigExport = {
  projectName: 'taro-react-starter',
  date: '2023-11-5',
  designWidth: (input: any) => {
    // 配置 NutUI 375 尺寸
    if (input?.file?.replace(/\\+/g, '/').indexOf('@nutui') > -1) return 375

    // 全局使用 Taro 默认的 750 尺寸
    return 750
  },
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    375: 2,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['@tarojs/plugin-html', '@tarojs/plugin-http'],
  alias: {
    '@': path.resolve(__dirname, '../src'),
  },
  sass: {
    data: '@import "@nutui/nutui-react/dist/styles/variables.scss";',
  },
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'react',
  compiler: {
    type: 'webpack5',
    prebundle: {
      enable: false,
    },
  },
  cache: {
    enable: false, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['nut-'],
        },
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    webpackChain(chain) {
      chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
      chain.merge({
        plugin: {
          install: {
            plugin: UnifiedWebpackPluginV5,
            args: [{ appType: 'taro', disabled: WeappTailwindcssDisabled }],
          },
        },
      })
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true, // 添加这行配置
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['nutui-react-taro', 'icons-react-taro'],
    output: {
      filename: 'js/[name].[hash:8].js',
      chunkFilename: 'js/[name].[chunkhash:8].js',
    },
    miniCssExtractPluginOption: {
      enableExtract: true,
      ignoreOrder: true,
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[name].[chunkhash].css',
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['nut-'],
        },
      },
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    webpackChain(chain) {
      chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
    },
  },
  rn: {
    appName: 'taroDemo',
    postcss: {
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
      },
    },
  },
}

export default defineConfig(config)
