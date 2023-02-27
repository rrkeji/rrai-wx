// app.ts
import { getUserConfig } from './services/share_service';

App<IAppOption>({
  globalData: {
    systemInfo: wx.getSystemInfoSync() || {},
    statusBarHeight: 0,
    customBarHeight: 0,
  },
  async onLaunch(options) {
    console.log('onLaunch', options);
    //初始化云
    wx.cloud.init();
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
        "config": {
          "env": "prod-5gwfszum5fc2702e"
        },
        "path": "/wx/share/confirm",
        "header": {
          "X-WX-SERVICE": "rrai",
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
