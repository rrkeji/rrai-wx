// components/avatars/bot-avatar/index.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ai_type: {
      type: String,
      value: 'ChatGPT_Text',
    },
    size: {
      type: Number,
      value: 100
    },
    rounded: {
      type: Boolean,
      value: true
    },
    background: {
      type: String,
      value: ''
    },
    withTitle: {
      type: Boolean,
      value: false
    },
    titleSize: {
      type: Number,
      value: 24
    },
    titleColor: {
      type: String,
      value: '#000000'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
