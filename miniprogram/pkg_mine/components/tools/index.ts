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
    vip: 0,
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.refresh();
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {

    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onItemTap(e: any) {
      console.log(e.currentTarget.dataset);
      if (e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.enough === true) {
        const { opentype, url } = e.currentTarget.dataset;
        //
        if (opentype == 'webview') {
          wx.redirectTo({
            url: '../../../pages/webview/index?url=' + encodeURIComponent(url)
          });
        }
      } else {
        wx.showToast({
          title: '您还未解锁该工具,赶快去解锁吧!',
          icon: 'none',
          duration: 2000
        });
      }

    },
    refresh() {
      const app = getApp<IAppOption>();
      this.setData({
        vip: app.globalData.vip,
      });
    },
  }
})
