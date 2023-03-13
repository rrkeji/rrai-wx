// pkg_mine/pages/unlockvip/index.ts
import { rewardUserSummaryToday, createOrderByProduct, getUserConfig } from "../../../services/index";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    vip: 0,
    rechargeItems: [
      {
        point: 999,
        fee: 9.99,
        productId: 1,
      }, {
        point: 9999,
        fee: 99.99,
        productId: 2,
      }, {
        point: 29999,
        fee: 299.99,
        productId: 3,
      }, {
        point: 59999,
        fee: 599.99,
        productId: 4,
      }, {
        point: 99999,
        fee: 999.99,
        productId: 5,
      }, {
        point: 999999,
        fee: 9999.99,
        productId: 6,
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  onRechargeTap(e: any) {
    console.log(e);
    if (e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.productid) {
      let productId: number = e.currentTarget.dataset.productid;

      createOrderByProduct(productId, productId).then((res) => {
        const { orderNo, payment } = res;
        wx.requestPayment({
          timeStamp: payment.timeStamp,
          nonceStr: payment.nonceStr,
          package: payment.package,
          signType: payment.signType,
          paySign: payment.paySign,
          success(res) {
            console.log(orderNo);
            console.log('pay success', res)
          },
          fail(err) {
            console.error('pay fail', err)
          }
        })
      }).catch((err) => {
        console.error(err);
      });
    }
  }
})