// index.ts
// 获取应用实例
Page({
  data: {
    hi_text: '您好，我是软软AI智能机器人，你可以叫我“软软”，我有一些能力。你可以对我说“现在几点了？”“今天是几号”“你都会什么？'
  },
  onLoad: function () {
    
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../chat/chat',
    })
  },
})
