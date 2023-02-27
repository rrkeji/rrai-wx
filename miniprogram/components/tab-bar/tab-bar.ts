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
    aiType: {
      type: String,
      value: 'ChatGPT_Text'
    },
  },
  data: {
    aiSelectShow: false,
  },
  lifetimes: {
    attached: function () {
      const rr_tab_show = wx.getStorageSync('rr_tab_show') || false;
      console.log(rr_tab_show);
      if(this.data.idx == 1 && !rr_tab_show){
        this.setData({
          aiSelectShow: true
        });
      }
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
    },
    onAIItemTap: function (event: any) {
      if (event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.aitype) {
        //如果和当前的一致，那么不进行跳转
        let to = event.currentTarget.dataset.aitype;
        if (this.data.aiType === to) {
          //
          this.setData({
            aiSelectShow: false,
          });
        } else {
          //进行跳转
          wx.setStorageSync('CurrentAIType', to);
          this.setData({
            aiType: to,
          }, () => {
            wx.redirectTo({
              url: '../../../pkg_rr/pages/rr/rr'
            })
          });
        }
      }
    },
    showAISelect: function (e: any) {
      wx.setStorageSync('rr_tab_show', 'true');
      this.setData({
        aiSelectShow: !this.data.aiSelectShow,
        first: false,
      });
    }
  }
});