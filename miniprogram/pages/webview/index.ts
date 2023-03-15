// webview.ts
// 获取应用实例
Page({
  data: {
    url: 'https://www.idns.link/rrai/statics/404.html'
  },
  onLoad: function (option: any) {
    console.log(option)
    if (option && option.url) {
      this.setData({
        url: decodeURIComponent(option.url)
      });
    }
  },
})
