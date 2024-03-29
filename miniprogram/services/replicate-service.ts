export const replicateProxyPredictions = async (replicate_api_id: number, original_message: any, data: any) => {
  console.log(replicate_api_id, original_message, data);
  let res = await wx.cloud.callContainer({
    "path": "/replicate/proxy/predictions",
    "header": {
      ...getApp<IAppOption>().globalData.COMMON_HEADERS,
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      replicate_api_id: replicate_api_id,
      "original_input": original_message,
      "inputs_data": data
    }
  });
  if (res && res.statusCode == 200) {
    return res.data;
  } else {
    return null;
  }
}

export const replicateProxyQueryByPredictionId = async (replicate_api_id: string) => {
  let res = await wx.cloud.callContainer({
    "path": `/replicate/proxy/prediction/${replicate_api_id}`,
    "header": {
      ...getApp<IAppOption>().globalData.COMMON_HEADERS,
      "content-type": "application/json"
    },
    "method": "GET",
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    return res.data;
  } else {
    return null;
  }
}

