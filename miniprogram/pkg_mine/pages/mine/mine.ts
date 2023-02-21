// mine.ts

import { getShareAppMessage } from "../../../services/share_service";

// 获取应用实例
Page({
  data: {
  },
  request: function (userid: string, msgid: string) {
    //获取消息的内容
    //获取评论的内容
  },
  onLoad: function (query) {
    const app = getApp<IAppOption>();
    let that = this;
    app.getMainAreaHeight(that).then(res => {
      that.setData({
        mainHeight: 'height:-webkit-calc(100vh - ' + res + 'px);height: calc(100vh - ' + res + 'px);'
      })
    })
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
    return getShareAppMessage();
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
  },
  onAIChange() {
    //跳转到AI大脑切换页面
    wx.navigateTo({
      url: '../ai/ai'
    });
  }
})
