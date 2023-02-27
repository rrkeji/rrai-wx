// pkg_mine/components/reward-point/index.ts
import { searchRewardLogs } from '../../services/reward-service';

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
    rewardLogs: <Array<any>>[],
    page: 1,
    pageSize: 10,
    total: 0,
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      //reward logs
      searchRewardLogs(this.data.page, this.data.pageSize).then((res) => {
        console.log(res);
        this.setData({
          total: res.total,
          rewardLogs: res.data.map((item: any) => {
            item.reason = item.reason.replace('${amount}', item.amount);
            return item;
          }),
        });
      }).catch((err) => {
        console.log(err);
      });
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
  }
})
