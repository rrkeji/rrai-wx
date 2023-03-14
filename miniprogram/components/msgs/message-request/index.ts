Component({
  properties: {
    // 属性值可以在组件使用时指定
    request: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        this.setData({
          ...newVal
        });
      }
    },
  },
  data: {
    // 这里是一些组件内部数据
    type: 'text',
    text: '',
    sender: 'client',
    result: 0,
  },
  methods: {
    // 这里是一个自定义方法
    //链接的跳转
    linkGoTo: function (event: any) {
      if (event.currentTarget && event.currentTarget.dataset &&
        event.currentTarget.dataset.url) {
        let url = event.currentTarget.dataset.url;
        console.log(url);
        wx.navigateTo({
          url: `../webview/webview?url=${url}`,
        })
      }
    },
  }
})