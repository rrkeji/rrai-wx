// pkg_mine/components/settings/index.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    onDelete() {
      //
      wx.clearStorageSync();
      wx.showToast({
        title: '清除成功！', //弹框内容
        icon: 'success',  //弹框模式
        duration: 2000    //弹框显示时间
      });
    },
    onRewardLogsTap() {
      //跳转到AI大脑切换页面
      wx.navigateTo({
        url: '../ai/ai'
      });
    },
  }
})
