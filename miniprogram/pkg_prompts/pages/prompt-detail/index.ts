// pkg_prompts/pages/prompt-detail/index.ts
import { PromptEntity, getPromptById } from '../../services/prompts_service';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: <PromptEntity | null>null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options, options.prompt_id);
    if (!options.prompt_id) {
      return;
    }
    //通过ID获取内容
    getPromptById(parseInt(options.prompt_id)).then((res) => {
      console.log(res);
      this.setData({
        prompt: res
      });
    }).catch((err) => {
      console.log(err);
    });
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

  }
})