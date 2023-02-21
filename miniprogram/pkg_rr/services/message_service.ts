export const messageSecCheck = async (msg: string) => {
  const app = getApp<IAppOption>();
  //进行安全检测
  //请求剩余次数等
  let res = await wx.cloud.callContainer({
    "config": {
      "env": "prod-5gwfszum5fc2702e"
    },
    "path": "/wx/msg/sec_check",
    "header": {
      "X-WX-SERVICE": "rrai",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      content: msg
    }
  });
  console.log(res.data);
  return res.data;
}