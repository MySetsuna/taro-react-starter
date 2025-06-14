export default defineAppConfig({
  pages: [
    'pages/index/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '文件上传',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom'
  },
  style: 'v2',
  sitemapLocation: 'sitemap.json',
  disableScroll: true
})
