// mine.ts
// 获取应用实例
Page({
  data: {
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
  onDelete() {
    //
    wx.clearStorageSync();
    wx.showToast({
      title: '清除成功！', //弹框内容
      icon: 'success',  //弹框模式
      duration: 2000    //弹框显示时间
    });
  }
})
