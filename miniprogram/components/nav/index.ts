Component({
  relations: {
    '../scroller/index': {
      type: 'parent',
      linked() { }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    list: Array,
    activeColor: {
      type: String,
      value: '#d13435'
    },
    active: {
      type: Number,
      value: 0,
      observer: function (newVal) {
        this.setData({
          toView: 'item' + (newVal - 1)
        })
        // console.log(this);
        this._change(newVal)
      }
    }
  },
  data: {
    toView: 'item0',
    navWidth: wx.getSystemInfoSync().windowWidth,
    scroll: false,
    index: 0
  },
  methods: {
    _changeNav(e) {
      this.setData({
        active: e.currentTarget.dataset.index
      })
    },
    _change(index) {
      this.triggerEvent('change', {
        id: this.data.list[index].id
      })
    },
    _catchTouchMove() {
      return false;
    }
  }
})