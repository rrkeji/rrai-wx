export const getUserConfig = async (): Promise<{ times: number, user_id: string }> => {
  //请求剩余次数等
  let res = await wx.cloud.callContainer({
    "config": {
      "env": "prod-5gwfszum5fc2702e"
    },
    "path": "/user/config",
    "header": {
      "X-WX-SERVICE": "rrai",
      "content-type": "application/json"
    },
    "method": "GET",
    "data": ""
  });
  console.log(res.data);
  return res.data;
}

export const getShareAppMessage = () => {
  const app = getApp<IAppOption>();
  const promise = new Promise(resolve => {
    //
    wx.cloud.callContainer({
      "config": {
        "env": "prod-5gwfszum5fc2702e"
      },
      "path": "/wx/share/msgid",
      "header": {
        "X-WX-SERVICE": "rrai",
        "content-type": "application/json"
      },
      "method": "GET",
      "data": ""
    }).then((res) => {
      console.log(res.data);
      let data = res.data as Record<string, any>;
      resolve({
        title: '来软软AI,体验下智能对话!',
        // imageUrl: 'https://www.idns.link/statics/rrai/share_app.png',
        path: '/pages/index/index?stype=wxuser&sid=' + app.globalData.userId + '&smsgid=' + data.msg_id,
      });
    });
  });
  return {
    title: '来软软AI,体验下智能对话!',
    // imageUrl: 'https://www.idns.link/statics/rrai/share_app.png',
    path: '/pages/index/index?stype=wxuser&sid=' + app.globalData.userId,
    promise
  };
}