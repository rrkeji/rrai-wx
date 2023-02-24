// chat.ts
import { messageSecCheck } from '../../services/message_service';
import { getShareAppMessage, getUserConfig } from '../../../services/share_service';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    newslist: <any>[],
    scrollTop: 0,
    messageValue: "",
    sendLoading: false,
    timeoutHandle: 0,
    times: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app = getApp<IAppOption>();
    let message = '';
    if (options && options.prompt && options.prompt.length > 0) {
      message = options.prompt;
    }
    //从本地读取存储的数据
    const messages = wx.getStorageSync('ChatGPT_Image_messages') || []
    this.setData({
      newslist: messages,
      messageValue: message,
    }, () => {
      this.bottom();
    });
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  onShow: function () {
    this.refreshTimes();
  },
  isOnline: function () {
  },
  onShareAppMessage: function (res) {
    return getShareAppMessage();
  },
  // 页面卸载
  onUnload() {
    clearInterval(this.data.timeoutHandle);
  },
  //事件处理函数
  send: function () {
    var flag = this;
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
  bindConfirm(event: any) {
    this.setData({
      messageValue: event.detail.value
    });
    this.send();
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
  cleanInput() {
    //button会自动清空，所以不能再次清空而是应该给他设置目前的input值
    // const query = wx.createSelectorQuery()
    // let input = query.select('#message_intput');
    // console.log(input);

  },
  //聊天消息始终显示最底端
  bottom: function () {
    var query = wx.createSelectorQuery()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      wx.pageScrollTo({
        scrollTop: res[0] && res[0].scrollHeight  // #the-id节点的下边界坐标  
      })
      res[1] && res[1].scrollTop // 显示区域的竖直滚动位置  
    })
  },
  //刷新次数
  refreshTimes: function () {
    //请求剩余次数等
    const callback = async () => {
      let userConfig = await getUserConfig();
      this.setData({
        times: userConfig.times
      });
    }
    callback();
  },
  timesOnTap: function () {
    // wx.shareAppMessage({
    //   title: '转发标题'
    // });
  },
  addMessageAndSync: function (item: any) {
    //判断list是否已经最大值
    let list = this.data.newslist;
    if (list.length > 200) {
      list.shift();
    }
    list.push(item);
    wx.setStorageSync('ChatGPT_Image_messages', list);
    return list;
  },
  onNewsCopyText: function (event: any) {
    if (event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.text) {
      wx.setClipboardData({
        data: event.currentTarget.dataset.text,
        success(res) {
          wx.showToast({
            title: '已经复制~',
            icon: "none",
            duration: 2000
          })
        }
      });
    }
  },
  onNewsResend: function (event: any) {
    if (event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.text) {
      //重新发送
      this._send(event.currentTarget.dataset.text);
    }
  },
  _send: function (msg: string) {
    let flag = this;
    //进行发送
    const currentAIType = wx.getStorageSync('CurrentAIType') || "ChatGPT_Text";
    console.log(currentAIType);
    let res = socket.sendCommand(currentAIType, {
      "prompt": msg,
      "size": "1024x1024"
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
      flag.cleanInput();
      flag.bottom();
    });
  },
  onNewsCopyImage: function (event: any) {

  },
  onNewsShareImage: function (event: any) {

  },
})