

export const createOrderByProduct = async (productId: number, referId: number) => {
  let res = await wx.cloud.callContainer({
    "path": "/mall/order/create_by_product",
    "header": {
      ...getApp<IAppOption>().globalData.COMMON_HEADERS,
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      "product_id": productId,
      "refer_id": referId
    }
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    return res.data;
  }
};


export const queryOrderStatusByOrderno = async (orderNo: string) => {
  let res = await wx.cloud.callContainer({
    "path": "/mall/order/status_by_orderno/"+orderNo,
    "header": {
      ...getApp<IAppOption>().globalData.COMMON_HEADERS,
      "content-type": "application/json"
    },
    "method": "GET",
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    return res.data;
  }
  return null;
};
