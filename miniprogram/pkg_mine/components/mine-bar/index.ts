// pkg_mine/components/mine-bar/index.ts
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
    active: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTabTap(e: any) {
      console.log(e);
      if (this.data.active == e.currentTarget.dataset.index) {
        return;
      }
      this.setData({
        active: e.currentTarget.dataset.index
      });
      this.triggerEvent("change", {
        index: e.currentTarget.dataset.index
      });
    }
  }
})
