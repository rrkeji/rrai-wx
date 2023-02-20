// ai.ts

import { getShareAppMessage } from "../../services/share_service";

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
    return getShareAppMessage();
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
