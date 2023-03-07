// mine.ts
import { getShareAppMessage, getUserConfig } from "../../../services/share_service";
import { updateUserConfig, rewardAdOrderCreate, rewardAdOrderCash, rewardUserSummaryToday } from '../../services/reward-service';
import { createOrderByProduct } from '../../../services/mall_service';

let rewardedVideoAd: WechatMiniprogram.RewardedVideoAd | null = null;
let adOrderNo: string | null = null;

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
    isReward0: 0,
    isReward1: 0,
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
    this.refreshReward();
    //参数判断 {stype:'',userid:'',msgid:''}
    if (wx.createRewardedVideoAd && rewardedVideoAd == null) {
      rewardedVideoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-43d6b8c12ab78ce7'
      });
      rewardedVideoAd.onLoad(() => {
        console.log('onLoad event emit');
        //请求后端获取到一个UUID
        // rewardAdOrderCreate().then((res) => {
        //   adOrderNo = res;
        // })
      })
      rewardedVideoAd.onError((err) => {
        console.log('onError event emit', err)
        wx.showToast({
          title: '加载广告失败,稍后重试~', //弹框内容
          icon: 'success',  //弹框模式
          duration: 2000    //弹框显示时间
        });
      })
      rewardedVideoAd.onClose((res) => {
        //{isEnded: true}
        console.log('onClose event emit', res)
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          rewardAdOrderCash(adOrderNo!).then((res) => {
            //刷新页面
            this.refreshReward();
          })
        } else {
          // 播放中途退出，不下发游戏奖励
        }
      })
    }
  },
  refreshReward() {
    // 
    getUserConfig().then((userConfig) => {
      this.setData({
        points: userConfig.times
      });
    }).catch((err) => {
      console.log(err);
    });
    rewardUserSummaryToday().then((res: {
      "is_reward_0": number,
      "is_reward_1": number
    }) => {
      this.setData({
        isReward0: res.is_reward_0,
        isReward1: res.is_reward_1,
      });
    })
  },
  onUnload: function () {
    // rewardedVideoAd?.destroy();
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
    const app = getApp<IAppOption>();
    const { avatarUrl } = e.detail

    wx.cloud.uploadFile({
      cloudPath: `avatars/${app.globalData.userId}/avatar.png`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
      filePath: avatarUrl, // 微信本地文件，通过选择图片，聊天文件等接口获取
      success: res => {
        console.log(res.fileID)
        updateUserConfig({
          avatar: res.fileID,
        }).then((res) => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
        });
        //通过 fileID 获取到临时的 URL
        wx.cloud.getTempFileURL({
          fileList: [res.fileID],
          success: (fileTemp: any) => {
            //{tempFileURL}
            console.log(fileTemp.fileList);
            if (fileTemp && fileTemp.fileList && fileTemp.fileList.length > 0) {
              app.globalData.avatar = fileTemp.fileList[0].tempFileURL;
              this.setData({
                avatarUrl: fileTemp.fileList[0].tempFileURL
              });
            }
          },
          fail: (err) => {
            console.log(err);
          }
        });
      },
      fail: err => {
        console.error(err)
      }
    })
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
  },
  onBuyButtonTap(e) {
    console.log('sss');
    createOrderByProduct(1, 1).then((res) => {
      const { orderNo, payment } = res;
      wx.requestPayment({
        timeStamp: payment.timeStamp,
        nonceStr: payment.nonceStr,
        package: payment.package,
        signType: payment.signType,
        paySign: payment.paySign,
        success(res) {
          console.log(orderNo);
          console.log('pay success', res)
        },
        fail(err) {
          console.error('pay fail', err)
        }
      })
    }).catch((err) => {
      console.error(err);
    });
  }
})
