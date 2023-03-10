// components/message-stack/index.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    sendLoading: {
      type: Boolean,
      value: false
    },
    currentMessage: {
      type: Boolean,
      value: false
    },
    data: {
      type: Array,
      value: []
    },
    respAvatarUrl: {
      type: String,
      value: "/images/logo.png"
    },
    guideMessage: {
      type: String,
      value: "您好，我是软软!"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollTop: 0,
    avatarUrl: "",
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
