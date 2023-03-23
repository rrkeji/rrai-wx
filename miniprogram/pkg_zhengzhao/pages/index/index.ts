// pkg_zhengzhao/pages/index/index.ts
import { PhotoSize, getPhotoSizeList } from '../../sevices/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoSizeList: <Array<PhotoSize>>[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.refreshData();
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
  /////
  refreshData() {
    getPhotoSizeList().then((res) => {
      this.setData({
        photoSizeList: res
      });
    });
  },
  // 去选择照片页面
  goNextPage(e: any) {
    let item = this.data.photoSizeList[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: '../preimgedit/index?data=' + encodeURIComponent(JSON.stringify(item)),
    })
  },
  goCustomPage(e: any) {
    wx.showToast({
      title: '稍后添加!',
      icon: 'none',
      duration: 2000
    });
    // let item = this.data.photoSizeList[0];
    // wx.navigateTo({
    //   url: '../preimgedit/index?data=' + encodeURIComponent(JSON.stringify(item)),
    // })
  }
})