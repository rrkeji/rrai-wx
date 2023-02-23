// {
//   "current": 0,
//   "pagePath": "../../pages/post/index",
//   "text": "会问",
//   "iconClass": "cu-btn icon-add bg-green shadow"
//   "iconTopClass": "add-action"
// }

Component({
  properties: {
    idx: {
      type: Number,
      value: 0
    },
  },
  data: {
    showTopBar: true,
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