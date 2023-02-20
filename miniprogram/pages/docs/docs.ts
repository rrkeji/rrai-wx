// index.ts

import { getShareAppMessage } from "../../services/share_service";

// 获取应用实例
Page({
  inited: false,
  ani: null,
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
  onShareAppMessage: function (res) {
    return getShareAppMessage();
  },
  // 事件处理函数
  bindViewTap() {
  },
})
