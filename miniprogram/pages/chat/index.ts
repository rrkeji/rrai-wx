// pages/chat/index.ts
import { ReconnectWebsocket, messageSecCheck, createPromptToServer, getShareAppMessage, getUserConfig } from '../../services/index'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    newslist: <any>[],
    messageValue: "",
    currentMessage: "",
    sendLoading: false,
    reWebSocket: <ReconnectWebsocket | null>null,
    showCreateDialog: false,
    showSettingsDialog: false,
    publishItem: <{ prompt: string, examples: string } | null>null,
    guideMessage: "您好，我是软软，我可以在以下帮助你：\n1. 写代码中的一些问题。\n2.写故事的大纲。\n3.写论文的思路。\n4.以及您能想到的都可以试着问我。"
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
    const messages = wx.getStorageSync('messages') || []
    this.setData({
      reWebSocket: new ReconnectWebsocket({
        onMessage: (cmd, data, code) => {
          this.onMessage(cmd, data, code);
        },
        onError: (res) => {
          this.onError(res);
        },
        onClose: (res) => {
          this.onClose(res);
        },
        userId: app.globalData.userId!,
      }),
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
  onMessage: function (cmd: string, data: any, code?: number) {
    let flag = this;
    console.log("onMessage", cmd, data)
    if (cmd === 'Stream') {
      //追加
      flag.setData({
        currentMessage: flag.data.currentMessage + data
      }, () => {
        this.bottom();
      });
    } else if (cmd === 'ChatGPT_Text') {
      let message = "";
      if (code === 0) {
        message = flag.data.currentMessage.trim();
      } else if (code === 3) {
        message = data;
      } else {
        message = data;
      }
      //完成
      let list = flag.addMessageAndSync({
        "sender": "response",
        "text": message,
        "type": "text"
      });
      flag.setData({
        newslist: list,
        sendLoading: false,
        currentMessage: "",
      }, () => {
        flag.bottom();
      });
    } else {
      //完成
      let list = flag.addMessageAndSync({
        "sender": "response",
        "text": '服务器开小差，联系不上软软同学了~',
        "type": "text"
      });
      flag.setData({
        newslist: list,
        sendLoading: false,
      }, () => {
        flag.bottom();
      });
    }
  },
  onError: function (res) {
    console.log(res);
    this.stopWrite(true);
  },
  onClose: function (res) {
    this.stopWrite();
  },
  //事件处理函数
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
          this._send(msg);
        } else {
          //
          wx.showToast({
            title: '发言的规范检测失败,请重试~',
            icon: "none",
            duration: 2000
          });
        }
      }).catch((e) => {
        //
        wx.showToast({
          title: '发言的规范检测失败,请重试~',
          icon: "none",
          duration: 2000
        });
      });

    } catch (e) {
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
  //监听input值的改变
  bindChange(res: any) {
    if (res.detail.value && res.detail.value.length > 1000) {
      wx.showToast({
        title: '您的提问不能超过1000，太长软软理解不了的~',
        icon: "none",
        duration: 2000
      })
      return;
    }
    this.setData({
      messageValue: res.detail.value
    })
  },
  _send: function (msg: string) {
    let flag = this;

    //进行发送
    let socket = flag.data.reWebSocket;
    if (socket) {
      //进行发送
      const currentAIType = wx.getStorageSync('CurrentAIType') || "ChatGPT_Text";
      console.log(currentAIType);
      let res = socket.sendCommand(currentAIType, {
        "prompt": msg,
        "temperature": 0
      });
      let sendResult = res;
      if (res === 0) {
        //发送成功
        sendResult = res;
      } else {
        //发送失败
        sendResult = res;
      }
      let list = flag.addMessageAndSync({
        "sender": "client",
        "result": sendResult,
        "text": msg,
        "type": "text"
      });
      flag.setData({
        newslist: list,
        sendLoading: sendResult === 0 ? true : false,
        messageValue: ''
      }, () => {
        flag.bottom();
      });
    } else {
      //没有 socket 连接
      wx.showToast({
        title: '联系不到软软，请检测网络是否连接或者重新载入小程序~',
        icon: "none",
        duration: 2000
      });
    }
  },
  addMessageAndSync: function (item: any) {
    //判断list是否已经最大值
    let list = this.data.newslist;
    if (list.length > 200) {
      list.shift();
    }
    list.push(item);
    wx.setStorageSync('messages', list);
    return list;
  },
  stopWrite: function (error?: boolean) {
    //发送请求
    let message = this.data.currentMessage;
    let flag = this;

    if (!this.data.sendLoading) {
      //没有正在返回的，不处理
      return;
    }

    if (message && message.length > 0) {
      // 有正在输入的情况下
      let list = flag.addMessageAndSync({
        "sender": "response",
        "text": flag.data.currentMessage.trim(),
        "stop": error ? 1 : 0,
        "type": "text"
      });
      flag.setData({
        newslist: list,
        sendLoading: false,
        currentMessage: "",
      }, () => {
        flag.bottom();
        // flag.refreshTimes();
      });
    } else {
      //当前没有正在输入的
      if (error) {
        let list = flag.addMessageAndSync({
          "sender": "client",
          "text": '服务器开小差，联系不上软软同学了~',
          "type": "text"
        });
        flag.setData({
          newslist: list,
          sendLoading: false,
        }, () => {
          flag.bottom();
        });
      } else {
        flag.setData({
          sendLoading: false,
        }, () => {
        });
      }
    }
  },
  onSettingsTap() {

  },
  bottom() {

  }
})