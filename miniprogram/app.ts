// app.ts
App<IAppOption>({
  globalData: {
  },
  async onLaunch() {
    //初始化云
    wx.cloud.init();
  },
  async onShow(ops) {
    // 分享统计放到此处的目的是因为热启动会不走onload，导致统计不准确。
    if (ops.query.stype && ops.query.sid && ops.query.smsgid) {
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
})