// components/avatars/user-avatar/index.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    size: {
      type: Number,
      value: 90
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
  lifetimes: {
    attached: function () {
      let app = getApp<IAppOption>();
      // 在组件实例进入页面节点树时执行
      this.setData({
        avatarUrl: app.globalData.avatar && app.globalData.avatar != '' ? app.globalData.avatar : '/images/logo.png'
      });
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
