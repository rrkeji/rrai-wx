// pkg_painter/components/painter-header/index.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    active: {
      type: Number,
      value: 0,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    items: [{
      "product_id": 1,
      "icon": "icon-huihua",
      "title": "AI创作"
    }, {
      "product_id": 2,
      "icon": "icon-huihua",
      "title": "AI涂鸦"
    }, {
      "product_id": 3,
      "icon": "icon-huihua",
      "title": "AI抠图"
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onItemTap(e: any) {
      console.log(e.currentTarget.dataset);
      const { idx, productid } = e.currentTarget.dataset;
      this.triggerEvent("change", {
        active: idx,
        productId: productid
      });
    }
  }
})
