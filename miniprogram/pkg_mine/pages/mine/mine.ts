// mine.ts
import { getShareAppMessage, getUserConfig } from "../../../services/share_service";
import { updateUserConfig } from '../../services/reward-service';

let rewardedVideoAd: WechatMiniprogram.RewardedVideoAd | null = null;

// 获取应用实例
Page({
  data: {
    modules: [{
      id: 1,
      title: '我的积分'
    }, {
      id: 3,
      title: '我的设置'
    }],
    isEdit: false,
    activeModule: 0,
    points: 0,
    avatarUrl: "/images/logo.png",
    nickname: "昵称",
  },
  request: function (userid: string, msgid: string) {
    //获取消息的内容
    //获取评论的内容
  },
  onLoad: function (query) {
    const app = getApp<IAppOption>();
    this.setData({
      nickname: app.globalData.nickname,
      avatarUrl: app.globalData.avatar
    });
    //设置分享
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    //
    getUserConfig().then((userConfig) => {
      this.setData({
        points: userConfig.times
      });
    }).catch((err) => {
      console.log(err);
    });
    //参数判断 {stype:'',userid:'',msgid:''}
    if (wx.createRewardedVideoAd) {
      rewardedVideoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-43d6b8c12ab78ce7'
      });
      rewardedVideoAd.onLoad(() => {
        console.log('onLoad event emit');
        //请求后端获取到一个UUID
      })
      rewardedVideoAd.onError((err) => {
        console.log('onError event emit', err)
      })
      rewardedVideoAd.onClose((res) => {
        //{isEnded: true}
        console.log('onClose event emit', res)
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
        } else {
          // 播放中途退出，不下发游戏奖励
        }
      })
    }
  },
  onUnload: function () {
    rewardedVideoAd?.destroy();
  },
  onShow: function () {
  },
  onShareAppMessage: function (res) {
    const app = getApp<IAppOption>();
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
      return;
    }
    return getShareAppMessage();
  },
  // 事件处理函数
  bindViewTap() {
  },

  bindchooseavatar(e: any) {
    console.log("avatarUrl", e.detail.avatarUrl)
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail

    updateUserConfig({
      avatar: avatarUrl,
    }).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
    this.setData({
      avatarUrl,
    });
  },
  formSubmit(event) {
    console.log(event);
    updateUserConfig({
      nickname: event.detail.value.nickname,
    }).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
    this.setData({
      nickname: event.detail.value.nickname,
      isEdit: !this.data.isEdit
    });
  },
  onEditButton(event) {
    this.setData({
      isEdit: !this.data.isEdit
    });
  },
  onRewardedVideoAdTap() {
    if (!rewardedVideoAd) {
      return;
    }
    rewardedVideoAd.show().catch(() => {
      if (!rewardedVideoAd) {
        return;
      }
      rewardedVideoAd.load()
        .then(() => rewardedVideoAd!.show())
        .catch(err => {
          console.log('激励视频 广告显示失败')
        });
    });
  }
})
