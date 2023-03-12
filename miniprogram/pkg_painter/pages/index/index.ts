// pkg_painter/pages/index/index.ts
import { messageSecCheck, replicateProxyPredictions, getShareAppMessage, getUserConfig } from '../../../services/index'
const plugin = requirePlugin("WechatSI");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newslist: <any>[],
    messageValue: "",
    currentMessage: "",
    loading: false,
    sendLoading: false,
    showCreateDialog: false,
    showSettingsDialog: false,
    publishItem: <{ prompt: string, examples: string } | null>null,
    guideMessage: "您好，我是软软（图片生成），我可以根据您的提示生成一些图片，快来试试吧~",
    inputImageSize: 0,
    activeModule: 0,
    replicateApi: 1,
    stackHeight: 210,
    inputImages: <Array<{ localPath: string, fileId: string | null, tempUrl: string | null, uploaded: 'uploading' | 'success' | 'error' }>>[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const app = getApp<IAppOption>();
    //接收初始值
    let message = '';
    if (options && options.prompt && options.prompt.length > 0) {
      let arr = JSON.parse(decodeURIComponent(options.prompt));
      if (arr && arr.length > 0) {
        message = arr[0]
      }
    }
    //从本地读取存储的数据
    const messages = wx.getStorageSync('image_messages') || []
    this.setData({
      newslist: messages,
      messageValue: message,
    }, () => {
      this.bottom();
    });
    //   
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    //
    this.refreshByReplicateApi();
  },

  onImageStorageSync() {
    //从本地读取存储的数据
    const messages = wx.getStorageSync('image_messages') || []
    this.setData({
      newslist: messages,
    }, () => {
      this.bottom();
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

  },
  refreshByReplicateApi() {
    //
    if (this.data.replicateApi == 1) {
      this.setData({
        inputImageSize: 0,
        stackHeight: 210,
      });
    } else if (this.data.replicateApi == 2) {
      this.setData({
        inputImageSize: 1,
        stackHeight: 362,
      });
    } else if (this.data.replicateApi == 3) {
      this.setData({
        inputImageSize: 0,
        stackHeight: 210,
      });
    } else {
      this.setData({
        inputImageSize: 0
      });
    }
  },
  //////
  onModuleChange(e: any) {
    const { active, productId } = e.detail;
    this.setData({
      activeModule: active,
      replicateApi: productId
    }, () => {
      this.refreshByReplicateApi();
    });
  },
  send: function () {
    //消息为空
    if (this.data.messageValue.trim() == "") {
      wx.showToast({
        title: '消息不能为空哦~',
        icon: "none",
        duration: 2000
      });
      return;
    }
    let msg = this.data.messageValue;

    try {
      //消息安全检测
      messageSecCheck(msg).then((res) => {
        if (res && res.code === 0) {
          //安全检测成功
          console.log("开始翻译");
          this.translate(msg, (newMsg) => {
            console.log('结束翻译');
            this._send(newMsg, msg);
          });
        } else {
          //
          wx.showToast({
            title: '发言的规范检测失败,请重试~',
            icon: "none",
            duration: 2000
          });
        }
      }).catch((e) => {
        console.error(e);
        //
        wx.showToast({
          title: '发言的规范检测失败,请重试~',
          icon: "none",
          duration: 2000
        });
      });

    } catch (e) {
      console.error(e);
      //
      wx.showToast({
        title: '发言的规范检测失败,请重试~',
        icon: "none",
        duration: 2000
      });
    }
  },
  //
  onSendTap(e: any) {
    this.setData({
      messageValue: e.detail.messageValue
    }, () => {
      this.send();
    });
  },
  _send(msg, originMsg) {
    //调用后端的接口
    let data: any = {};
    //准备参数
    if (this.data.replicateApi == 1) {
      data = {
        "prompt": 'mdjrny-v4 style ' + msg,
        "width": "512",
        "height": "512",
        "num_outputs": 1,
        "guidance_scale": 14,
        "num_inference_steps": 50,
      };
    } else if (this.data.replicateApi == 2) {
      let inputImages = this.data.inputImages;
      if (!inputImages || inputImages.length <= 0) {
        wx.showToast({
          title: '没有上传图片~',
          icon: "none",
          duration: 2000
        });
        return;
      }
      //获取到图片信息和文本
      data = {
        "image": inputImages[0].tempUrl,
        "prompt": msg,
        "num_samples": "1",
        "image_resolution": "512",
        "ddim_steps": 20,
        "scale": 9,
        "eta": 0,
        "a_prompt": "best quality, extremely detailed",
        "n_prompt": "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality"
      };
    } else if (this.data.replicateApi == 3) {
      //
      data = {
        "prompt": msg,
        "width": "512",
        "height": "512",
        "num_outputs": "1",
        "guidance_scale": "7.5",
        "num_inference_steps": 50,
      };
    } else {
      wx.showToast({
        title: '系统错误,请重试~',
        icon: "none",
        duration: 2000
      });
      return;
    }
    this.setData({
      loading: true
    });
    replicateProxyPredictions('' + this.data.replicateApi, originMsg, data).then((res) => {
      //请求完成
      console.log(res);
      if (res && res.prediction_id) {
        let list = this.addMessagesAndSync([{
          "sender": "client",
          "text": originMsg,
          "type": "replicate",
          "replicate_api_id": this.data.replicateApi,
          "prediction_id": res.prediction_id,
          "input": data,
          "result": 0
        }, {
          "sender": "response",
          "type": "replicate",
          "replicate_api_id": this.data.replicateApi,
          "prediction_id": res.prediction_id,
          "result": 1
        }]);
        this.setData({
          newslist: list,
          loading: false
        });
      } else {
        //错误处理
        let list = this.addMessageAndSync({
          "sender": "client",
          "text": originMsg,
          "type": "replicate",
          "replicate_api_id": this.data.replicateApi,
          "input": data,
          "result": 3
        });
        this.setData({
          newslist: list,
          loading: false
        });
      }
    }).catch((err) => {
      //错误处理
      let list = this.addMessageAndSync({
        "sender": "client",
        "text": originMsg,
        "type": "replicate",
        "replicate_api_id": this.data.replicateApi,
        "input": data,
        "result": 3
      });
      this.setData({
        newslist: list,
        loading: false
      });
    });
  },
  //监听input值的改变
  bindChange(res: any) {
    if (res.detail.value && res.detail.value.length > 2000) {
      wx.showToast({
        title: '您的提问不能超过2000，太长软软理解不了的~',
        icon: "none",
        duration: 2000
      })
      return;
    }
    this.setData({
      messageValue: res.detail.value
    })
  },
  bottom() {

  },
  translate(msg: string, callback: (msg: string) => void) {
    plugin.translate({
      lfrom: "zh_CN",
      lto: "en_US",
      content: msg,
      success: (res) => {
        if (res.retcode == 0) {
          console.log("result", res.result)
          callback(res.result);
        } else {
          console.warn("翻译失败", res)
          callback(msg);
        }
      },
      fail: (res) => {
        callback(msg);
      }
    });
  },
  onImageInputChange(e: any) {
    this.setData({
      inputImages: e.detail.images
    });
  },
  addMessageAndSync: function (item: any) {
    //判断list是否已经最大值
    let list = this.data.newslist;
    if (list.length > 200) {
      list.shift();
    }
    list.push(item);
    wx.setStorageSync('image_messages', list);
    return list;
  },
  addMessagesAndSync: function (item: Array<any>) {
    //判断list是否已经最大值
    let list: Array<any> = this.data.newslist;
    if (list.length > 200) {
      list.shift();
    }
    list = list.concat(item);
    wx.setStorageSync('image_messages', list);
    return list;
  },
})