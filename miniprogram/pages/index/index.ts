// index.ts
import { getShareAppMessage } from '../../services/share_service';

// 获取应用实例
Page({
  data: {
  },
  onLoad: function () {
    //设置分享
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    // this.init();
  },
  onShow: function () {
    // this.play();
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return getShareAppMessage();
  },
  // 事件处理函数
  bindViewTap() {
    //查看是否微信登录成功，查看是否有token
    wx.redirectTo({
      url: '../../pkg_rr/pages/rr/rr',
    });
    // wx.switchTab({
    //   url: '../rr/index',
    // });
    // wx.navigateTo({
    //   url: '../docs/docs?stype=wxuser&userid=oZ3cl4xEzpiKYmL1-t-2DSGC-2j0&msgid=31',
    // });
  },
})
