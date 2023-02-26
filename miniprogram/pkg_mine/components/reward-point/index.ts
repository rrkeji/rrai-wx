// pkg_mine/components/reward-point/index.ts
import { getShareAppMessage, getUserConfig } from '../../../services/share_service';
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
    points: 0,
    rewardLogs: <Array<any>>[],
    page: 1,
    pageSize: 10,
    total: 0,
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      //
      getUserConfig().then((userConfig) => {
        this.setData({
          points: userConfig.times
        });
      }).catch((err) => {
        console.log(err);
      });
      //reward logs
      searchRewardLogs(this.data.page, this.data.pageSize).then((res) => {
        console.log(res);
        this.setData({
          total: res.total,
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
