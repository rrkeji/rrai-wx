// pkg_mine/components/vip-label/index.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    vip: {
      type: Number,
      value: 0,
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
    onUnlockVip() {
      //
      wx.navigateTo({
        url: '../../pages/unlockvip/index'
      });
    }
  }
})
