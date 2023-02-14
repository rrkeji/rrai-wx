Component({
  properties: {
    // 属性值可以在组件使用时指定
    avatar: {
      type: String,
      value: '',
    },
    nickname: {
      type: String,
      value: '',
    },
  },
  data: {
    // 这里是一些组件内部数据
  },
  methods: {
    // 这里是一个自定义方法
    bindchooseavatar(e: any) {
      console.log("avatarUrl", e.detail.avatarUrl)
    }
  }
})