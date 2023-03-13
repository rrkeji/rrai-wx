// components/msgs/message-actions-bar/index.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    requestitem: {
      type: Object,
      value: {},
    },
    responseitem: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showCreateDialog: false,
    publishItem: <{ prompt: string, examples: string } | null>null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPublish: function (event: any) {
      this.setData({
        showCreateDialog: true,
      });
    },
    onNewsCopyText: function (event: any) {
      if (event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.text) {
        wx.setClipboardData({
          data: event.currentTarget.dataset.text,
          success(res) {
            wx.showToast({
              title: '已经复制~',
              icon: "none",
              duration: 2000
            })
          }
        });
      }
    },
  }
})
