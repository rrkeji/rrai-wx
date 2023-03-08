// pkg_mine/components/reward-logs/index.ts
import { searchRewardLogs } from '../../../services/index';

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
    pageSize: 30,
    total: 0,
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      //reward logs
      this.onRefresh();
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
    
    onRefresh:function(){
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
    }
  }
})

