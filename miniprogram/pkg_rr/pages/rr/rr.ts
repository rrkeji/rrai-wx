// mine.ts
// 获取应用实例
Page({
  data: {
    src: '',
    ai_type: '',
    prompts: '',
  },
  onLoad: function (options) {
    //src,ai_type,prompts
    let src = '';
    let ai_type = '';
    let prompts = '';
    if (options && options.src) {
      src = options.src;
    }
    if (options && options.ai_type) {
      ai_type = options.ai_type;
    }
    if (options && options.prompts) {
      prompts = options.prompts;
    }
    this.setData({
      src,
      ai_type,
      prompts
    });
  },
  onShow: function () {
    //获取AI大脑类型，进行页面跳转
    let currentAIType = wx.getStorageSync('CurrentAIType') || "ChatGPT_Text";
    if (this.data.src === 'try') {
      //
      if (this.data.ai_type && this.data.ai_type.length > 0) {
        currentAIType = this.data.ai_type;
      }
    }
    let prompts = '';

    if (this.data.prompts && this.data.prompts.length > 0) {
      prompts = this.data.prompts;
      try {
        prompts = JSON.parse(prompts);
      } catch (error) {
      }
      if (Array.isArray(prompts)) {
        prompts = prompts.join('\n');
      }
    }
    console.log(currentAIType);
    //
    if (currentAIType === 'ChatGPT_Text') {
      //跳转到chat
      wx.redirectTo({
        url: '../../pages/chat/chat?prompt=' + prompts
      });
    } else if (currentAIType === 'ChatGPT_Image') {
      //跳转到图片编辑
      wx.redirectTo({
        url: '../../pages/openai-image/index?prompt=' + prompts
      });
    } else if (currentAIType === 'ChatGPT_Edit_Image') {
      //跳转到图片编辑
      wx.redirectTo({
        url: '../../pages/image-edit/image-edit?prompt=' + prompts
      });
    } else {
      //跳转到默认
    }
  },
  // 事件处理函数
  bindViewTap() {
  },
})
