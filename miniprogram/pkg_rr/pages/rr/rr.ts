// mine.ts
// 获取应用实例
Page({
  data: {
  },
  onLoad: function (query) {
    const app = getApp<IAppOption>();
    let that = this;
    app.getMainAreaHeight(that).then(res => {
      that.setData({
        mainHeight: 'height:-webkit-calc(100vh - ' + res + 'px);height: calc(100vh - ' + res + 'px);'
      })
    })
  },
  onShow: function () {
    //获取AI大脑类型，进行页面跳转
    const currentAIType = wx.getStorageSync('CurrentAIType') || "ChatGPT_Text";
    console.log(currentAIType);

    if (currentAIType === 'ChatGPT_Text' || currentAIType === 'ChatGPT_Image') {
      //跳转到chat
      wx.redirectTo({
        url: '../../pages/chat/chat'
      });
    } else if (currentAIType === 'ChatGPT_Edit_Image') {
      //跳转到图片编辑
      wx.redirectTo({
        url: '../../pages/image-edit/image-edit'
      });
    } else {
      //跳转到默认
    }
  },
  // 事件处理函数
  bindViewTap() {
  },
  pageLifetimes: {
    show() {
    }
  }
})
