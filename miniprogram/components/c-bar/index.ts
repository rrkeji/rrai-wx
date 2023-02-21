let app = getApp()
Component({
  externalClasses: ["parent-class"],
  properties: {
    title: {
      type: String,
      value: ''
    },
    topClass: {
      type: String,
      value: ""
    },
    titleClass: {
      type: String,
      value: ""
    },
    titleTextClass: {
      type: String,
      value: ""
    },
    showBack: {
      type: Boolean,
      value: false
    },
    showBackText: {
      type: String,
      value: "返回"
    },
    showHome: {
      type: Boolean,
      value: false
    },
    homePath: {
      type: String,
      value: ""
    },
    homeOpenType: {
      type: String,
      value: ""
    },
    background: {
      type: String,
      value: ''
    },
    showShadow: {
      type: Boolean,
      value: true
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      var t = this
      let { showNavigationBarLoading, hideNavigationBarLoading } = Object.assign({}, wx)
      wx._showNavigationBarLoading || wx.__defineGetter__('showNavigationBarLoading', function () {
        wx._showNavigationBarLoading = 1
        return function (o) {
          var p = getCurrentPages().pop() || {},
            cb = p ? p.selectComponent('#c-bar') : false
          cb && cb.setData && cb.setData({
            loading: !0
          })

          return showNavigationBarLoading(o)
        }
      })
      wx._hideNavigationBarLoading || wx.__defineGetter__('hideNavigationBarLoading', function () {
        wx._hideNavigationBarLoading = 1
        return function (o) {
          var p = getCurrentPages().pop() || {},
            cb = p ? p.selectComponent('#c-bar') : false
          cb && cb.setData && cb.setData({
            loading: !1
          })
          return hideNavigationBarLoading(o)
        }
      })
    },
    hide: function () { },
    resize: function () { },
  },
  data: {
    custom: wx.getMenuButtonBoundingClientRect(),
    cBarHeight: 68,
    cBarTitleTop: 20,
    cBarTitleHeight: 68,
    cBarTitlePaddingTop: 20,
    isiPad: /^ipad/i.test(app.globalData.systemInfo.model || ""),
    canvasHeight: 300,
    canvasWidth: 300
  },
  observers: {
    "homePath": function (p) {
      this.setData({
        hPath: p ? p : '/pages/index/index'
      })
    },
    "homeOpenType": function (t) {
      this.setData({
        hOpenType: t ? t : 'switchTab'
      })
    }
  },
  ready: function () {
    let t = this, ps = getCurrentPages()
    t.setData({
      hPath: t.data.homePath ? t.data.homePath : '/pages/index/index',
      hOpenType: t.data.homeOpenType ? t.data.homeOpenType : 'switchTab',
      navBackType: ps.length <= 1 ? 'switchTab' : 'navigateBack',
      title: t.data.title || app.globalData.appName
    })

    wx.getSystemInfo({
      success: e => {
        let sH = e.statusBarHeight,
          // bH = t.data.custom.bottom + t.data.custom.top - sH
          bH = t.data.custom.bottom * 2 - t.data.custom.height - sH
        bH = bH < t.data.cBarHeight ? t.data.cBarHeight : bH
        ps[ps.length - 1].setData({
          addMiniTop: t.data.custom.top + t.data.custom.height + 10,
          addMiniRight: Math.ceil(3 * t.data.custom.width / 4) - 6
        })
        t.setData({
          cBarHeight: t.data.height || bH,
          cBarTitleTop: t.data.titleTop || sH,
          cBarTitleHeight: t.data.titleHeight || bH,
          cBarTitlePaddingTop: t.data.titlePaddingTop || sH
        })
      }
    })
  },
  methods: {
  }
});