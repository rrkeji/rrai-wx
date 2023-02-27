// pkg_mine/components/my-publish/index.ts
import { searchUserPrompts } from '../../../services/prompts_service';

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
    prompts: <Array<any>>[],
    page: 1,
    pageSize: 10,
    total: 0,
  },
  lifetimes: {
    attached: function () {
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      //reward logs
      searchUserPrompts(this.data.page, this.data.pageSize).then((res) => {
        console.log(res);
        this.setData({
          total: res.total,
          prompts: res.data.map((item) => {
            return item;
          }),
        });
      }).catch((err) => {
        console.log(err);
      });
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
