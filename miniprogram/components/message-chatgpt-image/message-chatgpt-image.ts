Component({
  properties: {
    // 属性值可以在组件使用时指定
    images: {
      type: Array,
      value: [],
    },
    type: {
      type: String,
      value: 'url',
    },
  },
  data: {
    // 这里是一些组件内部数据
    errors: <any>{}
  },
  methods: {
    // 这里是一个自定义方法
    onImageItemTap: function (event: any) {
      if (event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.url) {
        //预览图片
        let url = event.currentTarget.dataset.url;
        console.log(event.currentTarget.dataset);
        wx.previewImage({
          urls: [url]
        });
      }
    },
    onError: function (event: any) {
      console.log(event);
      let errors = this.data.errors;
      errors[event.currentTarget.dataset.index] = true;
      this.setData({
        errors: errors,
      });
    }
  }
})