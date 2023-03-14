export const getUserConfig = async (): Promise<{ times: number, user_id: string, avatar: string, nickname: string, checkin: string, vip: number, recharge: number } | null> => {
  //请求剩余次数等
  let res = await wx.cloud.callContainer({
    "path": "/user/config",
    "header": {
      "X-WX-SERVICE": "chat2",
      "content-type": "application/json"
    },
    "method": "GET",
    "data": ""
  });
  console.log(res.data);
  if (res && res.statusCode == 200) {
    return res.data;
  } else {
    return null;
  }
}

export const getShareAppMessage = () => {
  const app = getApp<IAppOption>();
  const promise = new Promise(resolve => {
    //
    wx.cloud.callContainer({
      "path": "/wx/share/msgid",
      "header": {
        ...getApp<IAppOption>().globalData.COMMON_HEADERS,
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