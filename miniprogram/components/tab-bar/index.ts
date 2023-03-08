Component({
  properties: {
    idx: {
      type: Number,
      value: 0
    },
  },
  data: {
  },
  lifetimes: {
    attached: function () {
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