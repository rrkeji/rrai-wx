// pkg_zhengzhao/pages/editphoto/complete/index.ts
let interstitialAd = null


Page({

  /**
   * 页面的初始数据
   */
  data: {
		msg: '',
		tempFilePath: '',
		url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
		this.setData({
			msg: options.msg,
			tempFilePath: options.tempFilePath,
			url: options.url
		})
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

	preView () {
		wx.previewImage({
			urls: [this.data.url],
			current: this.data.url
		})
	},
	contineu() {
		debugger
		wx.navigateBack({
			delta: 3   //默认值是1
		})
	},
})