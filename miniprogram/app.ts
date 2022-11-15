// app.ts
App<IAppOption>({
  globalData: {
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

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
              console.log(res.data);
              const app = getApp<IAppOption>();
              let obj = res.data as any;
              app.globalData.jwtToken = obj.token;
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      }
    });
  },
})