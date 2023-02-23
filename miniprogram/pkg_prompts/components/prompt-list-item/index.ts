// pkg_prompts/components/prompt-list-item/index.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    prompt_id: {
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
    onItemTap: function (event: any) {
      //
      this.triggerEvent('itemtap', this.data, { bubbles: true, composed: true })
    },
    onTry: function (event: any) {
      console.log('========');
      wx.navigateTo({
        url: '',
        success: (res) => {

        }
      });
    }
  }
})
