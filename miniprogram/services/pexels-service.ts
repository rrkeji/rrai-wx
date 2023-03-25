export const proxyPexelsImageSearch = async (
  query: string,
  page: number,
  perPage: number,
  orientation?: string,
  size?: string,
  color?: string) => {

  //调用后台接口进行人像分割
  let res = await wx.cloud.callContainer({
    "path": "/proxy/pexels/image/search",
    "header": {
      ...getApp<IAppOption>().globalData.COMMON_HEADERS,
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      query: query,
      orientation: orientation,
      size: size,
      page: page,
      per_page: perPage,
      color: color,
    }
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    return res.data;
  } else {
    return null;
  }
}



export const proxyPexelsImageCurated = async (
  page: number,
  perPage: number) => {

  //调用后台接口进行人像分割
  let res = await wx.cloud.callContainer({
    "path": "/proxy/pexels/image/curated",
    "header": {
      ...getApp<IAppOption>().globalData.COMMON_HEADERS,
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      page: page,
      per_page: perPage,
    }
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    return res.data;
  } else {
    return null;
  }
}