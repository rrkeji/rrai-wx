
export interface ImageComposeItem {
  data: string,
  data_type: string,
  x: number,
  y: number,
  width: number,
  height: number,
}
export const imageComposeByItems = async (width: number, height: number, items: Array<ImageComposeItem>, returnType: 'url' | 'base64'): Promise<{ data: string, return_type: 'url' | 'base64' } | null> => {
  //调用后台接口进行人像分割
  let res = await wx.cloud.callContainer({
    "path": "/image/compose/by_items",
    "header": {
      ...getApp<IAppOption>().globalData.COMMON_HEADERS,
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      "width": width,
      "height": height,
      "items": items,
      "return_type": returnType,
    }
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    return res.data;
  } else {
    return null;
  }
};