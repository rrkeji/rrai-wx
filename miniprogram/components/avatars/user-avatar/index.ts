// components/avatars/user-avatar/index.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    size: {
      type: Number,
      value: 100
    },
    rounded: {
      type: Boolean,
      value: true
    },
    background: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    avatarUrl: ''
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      let app = getApp<IAppOption>();
      this.setData({
        avatarUrl: app.globalData.avatar && app.globalData.avatar != '' ? app.globalData.avatar : '/images/logo.png'
      });
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
