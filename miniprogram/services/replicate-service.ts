export const replicateProxyPredictions = async (replicate_api_id: string, data: any) => {

  console.log(replicate_api_id, data);
  
  // let res = await wx.cloud.callContainer({
  //   "path": "/replicate/proxy/predictions",
  //   "header": {
  //     "X-WX-SERVICE": "rrai",
  //     "content-type": "application/json"
  //   },
  //   "method": "POST",
  //   "data": {
  //     replicate_api_id: replicate_api_id,
  //     "inputs_data": data
  //   }
  // });
  // console.log(res);
}