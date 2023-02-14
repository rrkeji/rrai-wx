// ai.ts
// 获取应用实例
Page({
  data: {
    currentAIType: 'ChatGPT_Text',
    selected: 'ChatGPT_Text'
  },
  request: function (userid: string, msgid: string) {
    //获取消息的内容
    //获取评论的内容
  },
  onLoad: function (query) {
    //设置分享
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    //参数判断 {stype:'',userid:'',msgid:''}
  },
  onShow: function () {
    const currentAIType = wx.getStorageSync('CurrentAIType') || "ChatGPT_Text";
    this.setData({
      currentAIType: currentAIType,
      selected: currentAIType
    });
  },
  onShareAppMessage: function (res) {
    const app = getApp<IAppOption>();

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
      return;
    }

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
          let data = res.data as Record<string, any>;
          resolve({
            title: '来软软AI,体验下智能对话!',
            // imageUrl: 'https://www.idns.link/statics/rrai/share_app.png',
            path: '/pages/index/index?stype=wxuser&sid=' + app.globalData.userId + '&smsgid=' + data.msg_id,
          });
        }
      });
    });
    return {
      title: '来软软AI,体验下智能对话!',
      // imageUrl: 'https://www.idns.link/statics/rrai/share_app.png',
      path: '/pages/index/index?stype=wxuser&sid=' + app.globalData.userId,
      promise
    };
  },
  // 事件处理函数
  bindViewTap() {
  },
  onItemTap(event: any) {
    if (event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.aitype) {
      console.log(event.currentTarget.dataset.aitype);
      this.setData({
        selected: event.currentTarget.dataset.aitype
      });
    }
  },
  onSwitchAI(event: any) {
    //设置本地存储
    wx.setStorageSync('CurrentAIType', this.data.selected);
    this.setData({
      currentAIType: this.data.selected
    });
  }
})
