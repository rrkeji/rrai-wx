// components/prompts-input/index.ts
const plugin = requirePlugin("WechatSI")

// 获取**全局唯一**的语音识别管理器**recordRecoManager**
let manager: any = null;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: '',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    inputFocus: true,
    translateContent: '',
    translateEnable: false,
    recording: false,  // 正在录音
    recordStatus: false,
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      this.initRecord();
    },
    hide: function () {
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 手动输入内容
    conInput: function (e) {
      this.setData({
        content: e.detail.value,
      })
      this.triggerEvent('input', {
        value: e.detail.value
      });
    },
    onBindFocus: function (e: any) {
      this.setData({
        inputFocus: true
      })
      this.triggerEvent('focus', {});
    },
    onBindBlur: function (e: any) {
      this.setData({
        inputFocus: false,
      })
      this.triggerEvent('blur', {});
    },
    //识别语音 -- 初始化
    initRecord: function () {
      const that = this;
      if (manager == null) {
        manager = plugin.getRecordRecognitionManager()

        // 有新的识别内容返回，则会调用此事件
        manager.onRecognize = function (res) {
          console.log(res)
        }
        // 正常开始录音识别时会调用此事件
        manager.onStart = function (res) {
          console.log("成功开始录音识别", res)
        }
        // 识别错误事件
        manager.onError = function (res) {
          console.error("error msg", res)
        }
        //识别结束事件
        manager.onStop = function (res) {
          console.log('..............结束录音')
          console.log('录音临时文件地址 -->' + res.tempFilePath);
          console.log('录音总时长 -->' + res.duration + 'ms');
          console.log('文件大小 --> ' + res.fileSize + 'B');
          console.log('语音内容 --> ' + res.result);
          if (res.result == '') {
            wx.showModal({
              title: '提示',
              content: '听不清楚，请重新说一遍！',
              showCancel: false,
              success: function (res) { }
            })
            return;
          }
          var text = that.data.content + res.result;
          that.setData({
            content: text
          })
        }
      }

    },
    /**
     * 按住按钮开始语音识别
     */
    touchStart: function (e) {
      this.setData({
        recordStatus: true  //录音状态
      })
      // 语音开始识别
      manager.start({
        lang: 'zh_CN',// 识别的语言，目前支持zh_CN en_US zh_HK sichuanhua
      })
    },
    /**
     * 松开按钮结束语音识别
     */
    touchEnd: function (e) {
      this.setData({
        recordStatus: false
      })
      // 语音结束识别
      manager.stop();
    },
    onTranslateBack: function () {
      this.setData({
        translateEnable: false,
      });
    },
    onTranslate: function () {
      this.setData({
        translateEnable: true,
      });

      plugin.translate({
        lfrom: "zh_CN",
        lto: "en_US",
        content: this.data.content,
        success: (res) => {
          if (res.retcode == 0) {
            console.log("result", res.result)
            this.setData({
              translateContent: res.result
            });
          } else {
            console.warn("翻译失败", res)
          }
        },
        fail: (res) => {
          console.log(res);
          this.setData({
            translateContent: '网络失败'
          });
        }
      });
    },
    onBindSend: function () {
      //
      if (this.data.translateEnable) {
        this.triggerEvent('send', {
          messageValue: this.data.translateContent
        });
      } else {
        this.triggerEvent('send', {
          messageValue: this.data.content
        });
      }
      this.setData({
        content: ""
      });
    },
    onBindSettings: function () {
      //
      this.triggerEvent('settings', {
      });
    }
  }
})
