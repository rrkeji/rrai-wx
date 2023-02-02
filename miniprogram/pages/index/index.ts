// index.ts
// 获取应用实例
Page({
  data: {
    hi_text: '您好，我是软软AI智能机器人，你可以叫我“软软”。你可以对我说“写一个笑话”、“写一篇关于人工智能的短文”。',
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
    const promise = new Promise(resolve => {
      wx.request({
        method: 'GET',
        url: 'https://www.idns.link/rrai/wx/share/msgid',
        header: {
          'content-type': 'text/plain',
          'Authorization': app.globalData.jwtToken
        },
        success(res) {
          console.log(res.data);
          resolve({
            title: '来软软AI,体验下智能对话!',
            imageUrl: 'https://www.idns.link/statics/rrai/share_app.png',
            path: '/pages/index/index?stype=wxuser&sid=' + app.globalData.userId + '&smsgid=' + res.data.msg_id,
          });
        }
      });
    });
    return {
      title: '来软软AI,体验下智能对话!',
      imageUrl: 'https://www.idns.link/statics/rrai/share_app.png',
      path: '/pages/index/index?stype=wxuser&sid=' + app.globalData.userId,
      promise
    };
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../chat/chat',
    })
  },
})
