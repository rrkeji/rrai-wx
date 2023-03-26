

//SYS_BOOT
export const getSystemConfigByKey = async (key: string): Promise<{ code: number, amount: number } | null> => {
  //请求剩余次数等
  let res = await wx.cloud.callContainer({
    "path": `/system/config/${key}`,
    "header": {
      "X-WX-SERVICE": "rrai",
      "content-type": "application/json"
    },
    "method": "GET",
    "data": ""
  });
  console.log(res.data);
  if (res && res.statusCode == 200) {
    if (res.data && res.data.key_values) {
      try {
        res.data.values = JSON.parse(res.data.key_values);
      } catch (error) {
        console.log(error);
      }
    }
    return res.data;
  } else {
    return null;
  }
}
