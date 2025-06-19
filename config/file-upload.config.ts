import { defineConfig } from '@tarojs/cli'
import type { UserConfigExport } from '@tarojs/cli'
import path from 'node:path'

const config: UserConfigExport = {
  projectName: 'file-upload',
  date: '2024-3-14',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src/file-upload',
  outputRoot: 'build/file-upload',
  plugins: ['@tarojs/plugin-html', '@tarojs/plugin-http'],
  alias: {
    '@': path.resolve(__dirname, '../src'),
  },
  defineConstants: {
  },
  copy: {
    patterns: [
    ],
    options: {
    },
  },
  framework: 'react',
  compiler: 'webpack5',
  cache: {
    enable: false,
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        },
      },
      url: {
        enable: true,
        config: {
          limit: 1024,
        },
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        },
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    webpackChain(chain) {
      chain.output.filename('file-upload/[name].js')
      chain.output.chunkFilename('file-upload/[name].js')
    },
  },
}

export default defineConfig(config)
