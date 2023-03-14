// pkg_prompts/pages/prompt-detail/index.ts
import { InteracteField, PromptEntity, getPromptById, promptsInteractionByUserid, promptsInteractionById, userPromptsInteracte } from '../../../services/prompts_service';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: <PromptEntity | null>null,
    emptySetting: {
      text: "暂无文章",
    },
    summary: {
      favorite: 0,
      thumbs_down: 0,
      thumbs_up: 0,
      view: 0
    },
    userInteraction: {
      favorite: 0,
      thumbs_down: 0,
      thumbs_up: 0,
      view: 0
    }
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
      let examplesObj = null;
      if (res && res.ai_type == 'replicate' && res.examples && res.examples.length > 0) {
        examplesObj = JSON.parse(res.examples);
      }
      this.setData({
        prompt: res,
        examplesObj: examplesObj
      });
    }).catch((err) => {
      console.log(err);
    });
    //获取交互的信息
    this.refreshInteraction(parseInt(options.prompt_id));

  },
  refreshInteraction(promptId: number) {
    //获取交互的信息
    promptsInteractionByUserid(promptId).then((res) => {
      //{favorite: 0, thumbs_down: 0, thumbs_up: 0, view: 0}
      this.setData({
        summary: res
      });
    }).catch((err) => {
      console.log(err);
    });

    promptsInteractionById(promptId).then((res) => {
      //{favorite: 0, thumbs_down: 0, thumbs_up: 0, view: 0}
      this.setData({
        userInteraction: res
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
  onThumbsDownTap(event: any) {
    userPromptsInteracte(this.data.prompt.id,
      InteracteField.ThumbsDown,
      !this.data.userInteraction.thumbs_down
    ).then((res) => {
      this.refreshInteraction(this.data.prompt.id);
    }).catch((err) => {
      console.log(err);
    });
  },
  onThumbsUpTap(event: any) {
    userPromptsInteracte(this.data.prompt.id,
      InteracteField.ThumbsUp,
      !this.data.userInteraction.thumbs_up
    ).then((res) => {
      this.refreshInteraction(this.data.prompt.id);
    }).catch((err) => {
      console.log(err);
    });
  },
  onHeartTap(event: any) {
    userPromptsInteracte(this.data.prompt.id,
      InteracteField.Favorite,
      !this.data.userInteraction.favorite
    ).then((res) => {
      this.refreshInteraction(this.data.prompt.id);
    }).catch((err) => {
      console.log(err);
    });
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
    //执行decodeURIComponent
    if (this.data.prompt.ai_type == 'replicate') {
      //AI绘画
      wx.redirectTo({
        url: '../../../pkg_painter/pages/index/index?src=try&ai_type=replicate&prompts=' + encodeURIComponent(JSON.stringify(this.data.prompt))
      });
    } else {
      console.log('',this.data.prompt.prompts);
      //AI问答
      wx.redirectTo({
        url: '../../../pages/chat/index?src=try&ai_type=text&prompts=' + encodeURIComponent(JSON.stringify(this.data.prompt.prompts))
      });
    }

  }
})