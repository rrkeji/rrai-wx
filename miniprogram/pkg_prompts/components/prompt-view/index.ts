// pkg_prompts/components/prompt-view/index.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    id: {
      type: Number,
      value: 0
    },
    user_id: {
      type: String,
      value: ''
    },
    ai_type: {
      type: String,
      value: ''
    },
    prompts: {
      type: Array,
      value: []
    },
    recommend: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: ''
    },
    images: {
      type: Array,
      value: []
    },
    purpose: {
      type: String,
      value: ''
    },
    tags: {
      type: String,
      value: ''
    },
    examples: {
      type: String,
      value: ''
    },
    create_time: {
      type: Number,
      value: 0
    },
    update_time: {
      type: Number,
      value: 0
    },
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
