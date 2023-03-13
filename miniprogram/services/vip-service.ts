export const checkin = async (): Promise<{ times: number, user_id: string, avatar: string, nickname: string, checkin: string } | null> => {
  //请求剩余次数等
  let res = await wx.cloud.callContainer({
    "path": "/user/vip/checkin",
    "header": {
      ...getApp<IAppOption>().globalData.COMMON_HEADERS,
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