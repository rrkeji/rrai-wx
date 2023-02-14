export const messageSecCheck = (msg: string, isOk: () => void, notOk: () => void, error: (code: number, message: string) => void) => {
  const app = getApp<IAppOption>();
  //请求剩余次数等
  wx.request({
    method: 'POST',
    url: 'https://www.idns.link/rrai/wx/msg/check',
    header: {
      'content-type': 'text/plain',
      'Authorization': app.globalData.jwtToken
    },
    data: msg,
    success(res) {
      let resObj = res.data as any;
      if (resObj && resObj.code == 0) {
        isOk();
      } else {
        notOk()
      }
    },
    fail() {
      error(1, '系统错误');
    }
  });
}