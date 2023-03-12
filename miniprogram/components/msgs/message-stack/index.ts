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
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        setTimeout(() => {
          this.bottom();
        }, 200);
      }
    },
    data: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        setTimeout(() => {
          this.bottom();
        }, 200);
      }
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
    avatarUrl: "",
    scrollTop: 0,
  },
  lifetimes: {
    attached: function () {
      let app = getApp<IAppOption>();
      // 在组件实例进入页面节点树时执行
      this.setData({
        avatarUrl: app.globalData.avatar && app.globalData.avatar != '' ? app.globalData.avatar : '/images/logo.png'
      });
    },
    ready: function () {
      this.bottom();
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {

    },
    resize: function () {
      this.bottom();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //聊天消息始终显示最底端
    bottom: function () {
      let that = this;
      this.createSelectorQuery()
        .select('.history').scrollOffset().exec(function (res) {
          that.setData({
            scrollTop: res[0] && res[0].scrollHeight
          });
        });
    },
  }
})
