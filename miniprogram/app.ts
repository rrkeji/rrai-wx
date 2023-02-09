// app.ts
App<IAppOption>({
  globalData: {
  },
  onLaunch() {
    wx.cloud.init({
      traceUser: true
    })
    // 登录
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          console.log(res);
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            method: 'POST',
            url: 'https://www.idns.link/rrai/wx/login',
            header: {
              'content-type': 'application/json' // 默认值
            },
            data: {
              code: res.code
            },
            success(res) {
              const app = getApp<IAppOption>();
              let obj = res.data as any;
              app.globalData.jwtToken = obj.token;
              app.globalData.userId = obj.user_id;
              app.globalData.shareTitle = obj.share_title ? obj.share_title : '';
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      }
    });
  },
  onShow(ops) {
    let that = this;
    // 分享统计放到此处的目的是因为热启动会不走onload，导致统计不准确。
    if (that.globalData.jwtToken && ops.query.stype
      && ops.query.sid && ops.query.smsgid) {
      // 分享数据统计
      // 发送请求，后台解析出分享信息
      wx.request({
        method: 'POST',
        url: 'https://www.idns.link/rrai/wx/share/confirm',
        data: {
          stype: ops.query.stype,
          sid: ops.query.sid,
          smsgid: ops.query.smsgid
        },
        header: {
          'content-type': 'application/json',
          'Authorization': that.globalData.jwtToken
        },
        success: function (res) {
          // 成功后的逻辑处理
        },
        fail: function (res) {
          // console.log('用户打开', res)
        }
      })
    }
  },
})