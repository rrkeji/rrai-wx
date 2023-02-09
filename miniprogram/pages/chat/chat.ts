// chat.ts
let wxyunSocket: any = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    newslist: <any>[],
    links: <any>[],
    scrollTop: 0,
    message: "",
    currentMessage: "",
    sendLoading: false,
    checkLoading: false,
    times: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this;
    //从本地读取存储的数据
    const messages = wx.getStorageSync('messages') || []
    this.setData({
      newslist: messages
    }, () => {
      that.bottom();
    });
    this.getChatSocket();
    this.refreshTimes();

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  onShareAppMessage: function (res) {
    const app = getApp<IAppOption>();
    if (res.from === 'button') {
      //消息上的分享
      console.log(res.target);
      if (res.target && res.target.dataset && res.target.dataset.msg_id > 0) {
        //userid msgId
        return {
          title: '来软软AI,体验下智能对话!',
          // imageUrl: 'https://www.idns.link/statics/rrai/share_app.png',
          path: '/pages/docs/docs?stype=wxuser&userid=' + app.globalData.userId + '&msgid=' + res.target.dataset.text,
        };
      } else {
        return {
          title: '来软软AI,体验下智能对话!',
          // imageUrl: 'https://www.idns.link/statics/rrai/share_app.png',
          path: '/pages/docs/docs?stype=wxuser&userid=' + app.globalData.userId + '&msgid=0',
        };
      }
    }
    const promise = new Promise(resolve => {
      wx.request({
        method: 'GET',
        url: 'https://www.idns.link/rrai/wx/share/msgid',
        header: {
          'content-type': 'text/plain',
          'Authorization': app.globalData.jwtToken
        },
        success(res) {
          resolve({
            title: '来软软AI,体验下智能对话!',
            // imageUrl: 'https://www.idns.link/statics/rrai/share_app.png',
            path: '/pages/index/index?stype=wxuser&sid=' + app.globalData.userId + '&smsgid=' + res.data.msg_id,
          });
        }
      });
    });
    return {
      title: '来软软AI,体验下智能对话!',
      // imageUrl: 'https://www.idns.link/statics/rrai/share_app.png',
      path: '/pages/index/index?stype=wxuser&sid=' + app.globalData.userId,
      promise
    };
  },
  // 页面卸载
  onUnload() {
    wx.showToast({
      title: '已与软软断开连接~',
      icon: "none",
      duration: 2000
    })
  },
  //快速点击
  quickSend: function (event: any) {
    var flag = this;
    if (event.currentTarget.dataset && event.currentTarget.dataset.msg) {
      var list: any[] = []
      list = flag.addMessageAndSync({
        "sender": "client",
        "text": event.currentTarget.dataset.msg,
        "type": "text"
      });

      // socket.emit('user_uttered', { message: event.currentTarget.dataset.msg });
      flag.setData({
        newslist: list
      }, () => {
        flag.bottom();
      });
    }
  },
  //事件处理函数
  send: function () {
    var flag = this;
    if (this.data.message.trim() == "") {
      wx.showToast({
        title: '消息不能为空哦~',
        icon: "none",
        duration: 2000
      });
      return;
    } else {
      var list: any[] = []
      list = flag.addMessageAndSync({
        "sender": "client",
        "text": this.data.message,
        "type": "text"
      });
      let msg = this.data.message;
      const app = getApp<IAppOption>();

      //消息安全检测
      wx.request({
        method: 'POST',
        url: 'https://www.idns.link/rrai/wx/msg/check',
        header: {
          'content-type': 'text/plain',
          'Authorization': app.globalData.jwtToken
        },
        data: msg,
        success(res) {
          let resObj = res.data as any;
          if (resObj && resObj.code == 0) {
            //发送请求
            wxyunSocket.send({ data: msg })
            flag.setData({
              newslist: list,
              sendLoading: true,
              message: ''
            }, () => {
              flag.bottom();
            });
          } else {
            wx.showToast({
              title: '消息不符合发言的规范,请重新编辑~',
              icon: "none",
              duration: 2000
            });
          }
        }
      });
    }
  },
  //
  bindConfirm(event: any) {
    this.setData({
      message: event.detail.value
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
      message: res.detail.value
    })
  },
  cleanInput() {
    //button会自动清空，所以不能再次清空而是应该给他设置目前的input值
    this.setData({
      message: this.data.message
    })
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
    const app = getApp<IAppOption>();
    let that = this;
    //请求剩余次数等
    wx.request({
      method: 'GET',
      url: 'https://www.idns.link/rrai/wx/share/times',
      header: {
        'content-type': 'text/plain',
        'Authorization': app.globalData.jwtToken
      },
      success(res) {
        console.log(res.data)
        that.setData({
          times: res.data.times,
          links: (res.data && res.data.links) ? res.data.links : [{ message: '黄历', label: '今日黄历' }, { message: '随机头像', label: '随机头像' }]
        });
      }
    });
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
    wx.setStorageSync('messages', list);
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
  onNewsCopyImage: function (event: any) {

  },
  onNewsShareImage: function (event: any) {

  },
  getChatSocket: function () {
    const app = getApp<IAppOption>();
    let flag = this;

    if (wxyunSocket != null) {
      return wxyunSocket;
    }
    wxyunSocket = wx.connectSocket({
      url: 'wss://wsschat.idns.link',
      header: {
        "x-wx-openid": app.globalData.userId
      },
    });
    //与云端建立连接
    wxyunSocket.onMessage(function (res: any) {
      console.log(res.data)
      if (res.data === '$__rrai_ok') {
        //完成
        let list = flag.addMessageAndSync({
          "sender": "response",
          "text": flag.data.currentMessage.trim(),
          "type": "text"
        });
        flag.setData({
          newslist: list,
          sendLoading: false,
          currentMessage: "",
        }, () => {
          flag.bottom();
        });
      } else if (res.data === '$__rrai_error') {
        //错误
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
      } else {
        //追加
        flag.setData({
          currentMessage: flag.data.currentMessage + res.data
        }, () => {
          flag.bottom();
        });
      }
    })
    wxyunSocket.onOpen(function (res) {
      console.log('成功连接到服务器', res)
    })
    wxyunSocket.onClose(function (res) {
      console.log('连接已断开', res)
    })
    wxyunSocket.onError(function (res) {
      //错误
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
    });
  }
})



