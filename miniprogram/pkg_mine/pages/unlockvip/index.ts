// pkg_mine/pages/unlockvip/index.ts
import { queryOrderStatusByOrderno, createOrderByProduct, getUserConfig, getVipDetail } from "../../../services/index";

let vipDetailsCache: Array<{ level: number, upgrade: number, checkin_reward: number, slogan: string, scope: string, detail: string, options: string }> | null = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    vip: 0,
    recharge: 0,
    loading: false,
    rechargeItems: [
      {
        point: 100,
        fee: 9.99,
        productId: 1,
      }, {
        point: 1000,
        fee: 99.99,
        productId: 2,
      }, {
        point: 3000,
        fee: 299.99,
        productId: 3,
      }, {
        point: 6000,
        fee: 599.99,
        productId: 4,
      }, {
        point: 10000,
        fee: 999.99,
        productId: 5,
      }, {
        point: 100000,
        fee: 9999.99,
        productId: 6,
      }
    ],
    vipDetails: <Array<{ level: number, upgrade: number, checkin_reward: number, slogan: string, scope: string, detail: string, options: string }> | null>null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.refresh();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  refresh() {
    const app = getApp<IAppOption>();
    if (vipDetailsCache == null) {
      getVipDetail().then((res) => {
        vipDetailsCache = res;
        this.setData({
          vip: app.globalData.vip,
          recharge: app.globalData.recharge,
          vipDetails: vipDetailsCache
        });
      })
    } else {
      this.setData({
        vip: app.globalData.vip,
        recharge: app.globalData.recharge,
        vipDetails: vipDetailsCache
      });
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

    this.refresh();
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

      this.setData({
        loading: true
      });
      createOrderByProduct(productId, productId).then((res) => {
        const { orderNo, payment } = res;
        let that = this;
        wx.requestPayment({
          timeStamp: payment.timeStamp,
          nonceStr: payment.nonceStr,
          package: payment.package,
          signType: payment.signType,
          paySign: payment.paySign,
          success(res) {
            //提示支付完成, loading状态
            that.checkOrder(orderNo);
          },
          fail(err) {
            console.error('pay fail', err);
            that.setData({
              loading: false
            }, () => {
              wx.showToast({
                title: '支付失败!',
                icon: 'error',
                duration: 2000
              });
            });
          }
        })
      }).catch((err) => {
        this.setData({
          loading: false
        }, () => {
          wx.showToast({
            title: '支付失败!',
            icon: 'error',
            duration: 2000
          });
        });
      });
    }
  },
  checkOrder(orderNo: string) {
    queryOrderStatusByOrderno(orderNo).then((res) => {
      if (res && res.pay_status === 1) {
        const app = getApp<IAppOption>();
        app.refreshUserConfig().then(() => {
          //支付成功
          this.setData({
            loading: false
          }, () => {
            wx.showToast({
              title: '支付成功!',
              icon: 'success',
              duration: 2000
            }).then(() => {
              //
              wx.redirectTo({
                url: '../index/index'
              });
            });
          });
        });
      } else if (res && res.pay_status === 0) {
        setTimeout(() => {
          this.checkOrder(orderNo);
        }, 1000);
      } else {
        //
        this.setData({
          loading: false
        }, () => {
          wx.showToast({
            title: '支付失败!',
            icon: 'error',
            duration: 2000
          });
        });
      }
    }).catch((err) => { console.log(err); });
  }
})