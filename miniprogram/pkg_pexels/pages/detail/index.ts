// pkg_pexels/pages/detail/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    original: <string | null>null,
    large: <string | null>null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options && options.id && +options.id > 0 && options.original && options.large) {
      let original = decodeURIComponent(options.original);
      let large = decodeURIComponent(options.large);
      this.setData({
        original: original,
        large: large,
      });
    }
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
  onImageItemTap: function (event: any) {
    if (event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.url) {
      //预览图片
      let url = event.currentTarget.dataset.url;
      console.log(event.currentTarget.dataset);
      wx.previewImage({
        urls: [url]
      });
    }
  },
})