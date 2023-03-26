// app.ts
import { getUserConfig, getSystemConfigByKey } from './services/index';

App<IAppOption>({
  globalData: {
    userId: '',
    avatar: undefined,
    nickname: undefined,
    checkin: '',
    times: 0,
    vip: 0,
    recharge: 0,
    COMMON_HEADERS: {
      "X-WX-SERVICE": "rrai"
    },
  },
  async onLaunch(options) {
    console.log('onLaunch', options);
    //初始化云
    wx.cloud.init({
      "env": "prod-5gwfszum5fc2702e",
    });
    //
    await this.refreshSystemConfig();
    await this.refreshUserConfig();
  },
  async onShow(ops) {
    console.log('onShow', ops);
    wx.preloadAd([
      {
        unitId: 'adunit-f2e79dad59bee277',
        type: 'banner'
      },
      {
        unitId: 'adunit-9c64e457097d841f',
        type: 'banner'
      },
      {
        unitId: 'adunit-43d6b8c12ab78ce7',
        type: 'video'
      },
    ]);

    // 分享统计放到此处的目的是因为热启动会不走onload，导致统计不准确。
    if ((ops.scene == 1007 || ops.scene == 1008) && ops.query.stype && ops.query.sid && ops.query.smsgid) {
      // 分享数据统计
      // 发送请求，后台解析出分享信息
      let res = await wx.cloud.callContainer({
        "path": "/wx/share/confirm",
        "header": {
          ...this.globalData.COMMON_HEADERS,
          "content-type": "application/json"
        },
        "method": "POST",
        "data": {
          stype: ops.query.stype,
          sid: ops.query.sid,
          smsgid: ops.query.smsgid
        }
      });
      console.log(res);
    }
  },
  getRecordAuth: function () {
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              console.log("succ auth")
            }, fail() {
              console.log("fail auth")
            }
          })
        } else {
          console.log("record has been authed")
        }
      }, fail(res) {
        console.log(res)
      }
    })
  },
  async refreshSystemConfig() {
    let res: any = await getSystemConfigByKey("SYS_BOOT");
    if (res && res.values) {
      this.globalData.sysOptions = res.values;
    } else {
      //再次调用
      const callback = () => {
        this.refreshSystemConfig();
      };
      setTimeout(callback, 2000);
    }
  },
  async refreshUserConfig() {
    let res = await getUserConfig();
    console.log(res);
    if (res && res.user_id) {
      this.globalData.userId = res.user_id;
      this.globalData.nickname = res.nickname;
      this.globalData.checkin = res.checkin;
      this.globalData.times = res.times;
      this.globalData.vip = res.vip;
      this.globalData.recharge = res.recharge;
      //通过 fileID 获取到临时的 URL
      if (res.avatar && res.avatar != '') {
        wx.cloud.getTempFileURL({
          fileList: [res.avatar],
          success: (fileTemp: any) => {
            //{tempFileURL}
            if (fileTemp && fileTemp.fileList && fileTemp.fileList.length > 0) {
              this.globalData.avatar = fileTemp.fileList[0].tempFileURL;
            }
          },
          fail: (err) => {
            console.log(err);
          }
        });
      }
    } else {
      //再次调用
      const callback = () => {
        this.refreshUserConfig();
      };
      setTimeout(callback, 2000);
    }
  }
});