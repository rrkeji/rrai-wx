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
      type: Array,
      value: []
    },
    examples: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        try {
          this.setData({
            response:JSON.parse(newVal)
          });
        } catch (error) {
          console.log(error);
        }
      }
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
    response: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onItemTap: function (event: any) {
      //
      this.triggerEvent('itemtap', this.data, { bubbles: true, composed: true })
    },
    onTry(event: any) {
      console.log(event, this);
      //执行
      wx.redirectTo({
        url: '../../../pkg_rr/pages/rr/rr?src=try&ai_type=' + this.data.ai_type + '&prompts=' + JSON.stringify(this.data.prompts)
      });
    }
  }
})
