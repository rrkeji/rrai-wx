// index.ts
import { getShareAppMessage } from '../../services/index';


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
  },
  onShow: function () {
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
    const app = getApp<IAppOption>();
    if (!app.globalData.userId || app.globalData.userId == '') {
      //
      wx.showToast({
        title: '网络或者服务存在问题，查看是否连接网络如还有问题联系客服~',
        icon: "none",
        duration: 2000
      });
      return;
    }
    // wx.redirectTo({
    //   url: '../chat/index',
    // });
    wx.redirectTo({
      url: '../../pkg_zhengzhao/pages/index/index',
    });
  },
})
