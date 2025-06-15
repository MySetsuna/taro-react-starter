import { useGlobalIconFont } from './icons/helper'

export default defineAppConfig({
  lazyCodeLoading: 'requiredComponents',
  usingComponents: Object.assign(useGlobalIconFont()),
  pages: ['pages/index/index', 'pages/file-upload/index'],
  animation: true,
  entryPagePath: 'pages/index/index',
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '广告制作',
    navigationBarTextStyle: 'black',
  },
  subPackages: [
    {
      root: 'im-sdk',
      pages: ['pages/blank/index'],
    },
  ],
  preloadRule: {
    'pages/index/index': {
      network: 'all',
      packages: ['im-sdk'],
    },
  },
  // tabBar: {
  //   custom: true,
  //   list: [
  //     {
  //       pagePath: 'pages/index/index',
  //       text: '罗马广告',
  //     },
  //     {
  //       pagePath: 'pages/login/index',
  //       text: '登录',
  //     },
  //     // {
  //     //   pagePath: 'pages/message/index',
  //     //   text: '消息',
  //     // },
  //     // {
  //     //   pagePath: 'pages/moments/index',
  //     //   text: '广告圈',
  //     // },
  //     // {
  //     //   pagePath: 'pages/magazine/index', // 添加杂志页面到 tabBar
  //     //   text: '杂志',
  //     // },
  //     // {
  //     //   pagePath: 'pages/mine/index',
  //     //   text: '我的',
  //     // },
  //   ],
  //   color: '#999',
  //   selectedColor: '#ff0000',
  //   backgroundColor: '#fff',
  //   borderStyle: 'black',
  // },
})
