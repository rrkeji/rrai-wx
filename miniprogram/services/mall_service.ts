

export const createOrderByProduct = async (productId: number, referId: number) => {
  let res = await wx.cloud.callContainer({
    "path": "/mall/order/create_by_product",
    "header": {
      "X-WX-SERVICE": "chat2",
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
