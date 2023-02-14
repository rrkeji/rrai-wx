export const getTimes = async () => {
  const app = getApp<IAppOption>();
  //请求剩余次数等
  wx.request({
    method: 'GET',
    url: 'https://www.idns.link/rrai/wx/share/times',
    header: {
      'content-type': 'text/plain',
      'Authorization': app.globalData.jwtToken
    },
    success(res) {
      console.log(res.data);
      //res.data.times
    }
  });
}