// mine.ts

import { getShareAppMessage } from "../../../services/share_service";

// 获取应用实例
Page({
  data: {
    modules: [{
      id: 3,
      title: '我的设置'
    }],
    isEdit: false,
    activeModule: 0,
    avatarUrl: "/images/logo.png",
    nickname: "昵称",
  },
  request: function (userid: string, msgid: string) {
    //获取消息的内容
    //获取评论的内容
  },
  onLoad: function (query) {
    const app = getApp<IAppOption>();
    wx.onThemeChange((result) => {
      this.setData({
        theme: result.theme
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
  
  bindchooseavatar(e: any) {
    console.log("avatarUrl", e.detail.avatarUrl)
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({
      avatarUrl,
    });
  },
  formSubmit(event) {
    console.log(event);
    this.setData({
      nickname: event.detail.value.nickname,
      isEdit: !this.data.isEdit
    });
  },
  onEditButton(event) {
    this.setData({
      isEdit: !this.data.isEdit
    });
  }
})
