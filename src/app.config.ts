export default defineAppConfig({
  pages: [
    'pages/factory/index',
    'pages/message/index',
    'pages/moments/index',
    'pages/mine/index',
    'pages/magazine/index',
    'pages/index/index'
  ],
  animation: true,
  // entryPagePath: 'pages/index/index',
  entryPagePath: 'pages/factory/index',
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '广告制作',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    list: [
      {
        pagePath: 'pages/factory/index',
        text: '厂家',
        iconPath: 'assets/tabbar/home.png',
        selectedIconPath: 'assets/tabbar/home-selected.png'
      },
      {
        pagePath: 'pages/message/index',
        text: '消息',
        iconPath: 'assets/tabbar/home.png',
        selectedIconPath: 'assets/tabbar/home-selected.png',
      },
      {
        pagePath: 'pages/moments/index',
        text: '广告圈',
        iconPath: 'assets/tabbar/home.png',
        selectedIconPath: 'assets/tabbar/home-selected.png'
      },
      {
        pagePath: 'pages/magazine/index',  // 添加杂志页面到 tabBar
        text: '杂志',
        iconPath: 'assets/tabbar/home.png',
        selectedIconPath: 'assets/tabbar/home-selected.png'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: 'assets/tabbar/profile.png',
        selectedIconPath: 'assets/tabbar/profile-selected.png'
      }
    ],
    color: '#999',
    selectedColor: '#ff0000',
    backgroundColor: '#fff',
    borderStyle: 'black'
  }
})
