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
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  onTry(event: any) {
    if (this.data.prompt == null) {
      wx.showToast({
        title: '跳转失败!',
        icon: 'error',
        duration: 2000
      });
      return;
    }
    //执行
    wx.redirectTo({
      url: '../../../pkg_rr/pages/rr/rr?src=try&ai_type=' + this.data.prompt.ai_type + '&prompts=' + JSON.stringify(this.data.prompt.prompts)
    });
  }
})