// app.ts
import { getUserConfig } from './services/index';

App<IAppOption>({
  globalData: {
    userId: '',
    avatar: undefined,
    nickname: undefined,
    COMMON_HEADERS: {
      "X-WX-SERVICE": "chat2"
    },
  },
  async onLaunch(options) {
    console.log('onLaunch', options);
    //初始化云
    wx.cloud.init({
      "env": "prod-5gwfszum5fc2702e",
    });
    //
    await this.refreshUserConfig();
  },
  async onShow(ops) {
    console.log('onShow', ops);
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
  async refreshUserConfig() {
    let res = await getUserConfig();
    console.log(res);
    if (res && res.user_id) {
      this.globalData.userId = res.user_id;
      this.globalData.nickname = res.nickname;
      //通过 fileID 获取到临时的 URL
      if (res.avatar && res.avatar != '') {
        wx.cloud.getTempFileURL({
          fileList: [res.avatar],
          success: (fileTemp: any) => {
            //{tempFileURL}
            console.log(fileTemp.fileList);
            if (fileTemp && fileTemp.fileList && fileTemp.fileList.length > 0) {
              this.globalData.avatar = fileTemp.fileList[0].tempFileURL;
            }
          },
          fail: (err) => {
            console.log(err);
          }
        });
      }
    }
  }
});