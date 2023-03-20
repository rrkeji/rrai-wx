
/**
 * 
 * @param fileUrl 
 * @param segType 
 */
export const baiduImageClassifyBodySeg = async (fileUrl: string, segType?: string): Promise<{ fileId: string, fileTempUrl: string } | null> => {
  //调用后台接口进行人像分割
  let res = await wx.cloud.callContainer({
    "path": "/baidu/image_classify/body_seg",
    "header": {
      ...getApp<IAppOption>().globalData.COMMON_HEADERS,
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      file_url: fileUrl,
      return_type: segType
    }
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    return res.data;
  } else {
    return null;
  }
};