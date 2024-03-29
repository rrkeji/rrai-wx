// components/waterfall-item/waterfall-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData: {
      type: Object
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
    onItemTap(e: any) {
      console.log( e.currentTarget.dataset.item);
      this.triggerEvent('itemclick', e.currentTarget.dataset.item);
    }
  }
})
