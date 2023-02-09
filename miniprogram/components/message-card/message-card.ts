Component({
  properties: {
    // 属性值可以在组件使用时指定
    msgType: {
      type: String,
      value: 'GPT3',
    },
    request: {
      type: String,
      value: '',
    },
    responseType: {
      type: String,
      value: 'text',
    },
    response: {
      type: String,
      value: '',
    },
    createTime: {
      type: String,
      value: '',
    },
  },
  data: {
    // 这里是一些组件内部数据
  },
  methods: {
    // 这里是一个自定义方法
  }
})