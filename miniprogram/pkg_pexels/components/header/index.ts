// pkg_pexels/components/header/index.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: String,
      value: ''
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
    conInput: function (e) {
      this.setData({
        content: e.detail.value,
      })
    },
    onBindSend: function () {
      //
      this.triggerEvent('search', {
        keywords: this.data.content
      });
    },
  }
})
