export default defineAppConfig({
  lazyCodeLoading: 'requiredComponents',
  pages: ['pages/index/index', 'pages/file-upload/index', 'pages/chat/index'],
  animation: true,
  entryPagePath: 'im-sdk/pages/blank/index',
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '罗马广告',
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
