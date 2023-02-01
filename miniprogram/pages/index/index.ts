// index.ts
// 获取应用实例
Page({
  data: {
    hi_text: '您好，我是软软AI智能机器人，你可以叫我“软软”，我有一些能力。你可以对我说“现在几点了？”“今天是几号”“你都会什么？”',
  },
  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    const app = getApp<IAppOption>();
    return {
      title: '来软软AI,体验下智能对话!',
      imageUrl: 'https://www.idns.link/statics/rrai/share_app.png',
      path: '/pages/index/index?stype=wxuser&sid=' + app.globalData.userId
    };
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../chat/chat',
    })
  },
})
