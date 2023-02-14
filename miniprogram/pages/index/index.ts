// index.ts
import * as lottie from 'lottiejs-miniapp';
import data from './data';

// 获取应用实例
Page({
  inited: false,
  ani: null,
  data: {
  },
  // 初始化加载动画
  init() {
    if (this.inited) {
      return
    }
    wx.createSelectorQuery().selectAll('#lottie_demo').node(res => {
      const canvas = res[0].node
      const context = canvas.getContext('2d')
      canvas.width = 300
      canvas.height = 300
      lottie.setup(canvas)
      this.ani = lottie.loadAnimation({
        loop: true,
        autoplay: true,
        animationData: data,
        rendererSettings: {
          context,
        },
      })
      this.inited = true
    }).exec()
  },
  play() {
    this.ani.play()
  },
  pause() {
    this.ani.pause()
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
    //查看是否微信登录成功，查看是否有token
    const app = getApp<IAppOption>();
    if (app.globalData.jwtToken) {
      wx.switchTab({
        url: '../chat/chat',
      });
      // wx.navigateTo({
      //   url: '../docs/docs?stype=wxuser&userid=oZ3cl4xEzpiKYmL1-t-2DSGC-2j0&msgid=31',
      // });
    } else {
      wx.showToast({
        title: '微信登录小程序未完成或者失败，请重试~',
        icon: "none",
        duration: 2000
      });
    }
  },
})
