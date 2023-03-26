Component({
  properties: {
    idx: {
      type: Number,
      value: 0
    },
  },
  data: {
    aishow: false,
  },
  lifetimes: {
    attached: function () {
      const app = <IAppOption>getApp();
      this.setData({
        aishow: app.globalData.sysOptions?.openai
      })
    }
  },
  methods: {
    goToTab: function (e: any) {
      if (this.data.idx == e.currentTarget.dataset.index) {
        return;
      }
      var url = e.currentTarget.dataset.url
      wx.redirectTo({
        url: url
      })
    }
  }
});