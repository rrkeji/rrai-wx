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
    }
  },
  data: {
    tabBar: [
      {
        "current": 0,
        "pagePath": "../../../pkg_prompts/pages/prompts/prompts",
        "text": "趣问",
        "iconClass": "icon-discover",
        "iconTopClass": ""
      },
      {
        "current": 0,
        "pagePath": "../../../pkg_rr/pages/rr/rr",
        "text": "软软",
        "iconClass": "cu-btn icon-skinfill bg-rr shadow",
        "iconTopClass": "add-action"
      },
      {
        "current": 0,
        "pagePath": "../../../pkg_mine/pages/mine/mine",
        "text": "我的",
        "iconClass": "icon-my",
        "iconTopClass": ""
      },
    ]
  },
  observers: {
    "idx": function (id) {
      var otabbar: any = this.data.tabBar;
      otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
      otabbar[id]['current'] = 1;
      this.setData({ tabBar: otabbar });
    }
  },
  methods: {
    goToTab: function (e: any) {
      var url = e.currentTarget.dataset.url
      console.log('==', url);
      wx.redirectTo({
        url: url
      })
    }
  }
});