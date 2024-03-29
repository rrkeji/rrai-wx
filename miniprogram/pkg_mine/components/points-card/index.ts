// pkg_mine/components/points-card/index.ts
import { rewardUserSummaryToday, createOrderByProduct, getUserConfig } from "../../../services/index";

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
    isReward0: 0,
    isReward1: 0,
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
    onRefresh() {
      const app = getApp<IAppOption>();
      this.setData({
        points: app.globalData.times,
      });
      // 
      // rewardUserSummaryToday().then((res: {
      //   "is_reward_0": number,
      //   "is_reward_1": number
      // }) => {
      //   this.setData({
      //     isReward0: res.is_reward_0,
      //     isReward1: res.is_reward_1,
      //     points: app.globalData.times,
      //   });
      // })
    },
    onBuyButtonTap(e) {
      wx.navigateTo({
        url: '../../pages/unlockvip/index'
      });
    },
    onRewardedLogsTap(e) {
      wx.navigateTo({
        url: '../../pages/logs/index'
      });
    },
    onRewardedVideoAdTap() {
      this.triggerEvent('adtap', {});
    }
  }
})
