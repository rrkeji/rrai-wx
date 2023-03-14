// pkg_mine/components/tools/index.ts
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
    onItemTap() {
      wx.showToast({
        title: '您还未解锁该工具,赶快去解锁吧!',
        icon: 'none',
        duration: 2000
      });
    }
  }
})
