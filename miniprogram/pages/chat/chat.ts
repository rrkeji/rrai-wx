// chat.ts
// 获取应用实例

// 展示本地存储能力
// const logs = wx.getStorageSync('logs') || []
// logs.unshift(Date.now());
// wx.setStorageSync('logs', logs);

const io = require('../../utils/weapp.socket.io');
// const socket = io('https://www.idns.link')
const utils = require('../../utils/util');

const socket = io('https://www.idns.link', {
  path: '/rrai/rasa/socket.io/',
  transports: ['websocket'], // 此项必须设置
});

Page({
  /**
   * 页面的初始数据
   */
  data: {
    newslist: <any>[],
    links: <any>[],
    scrollTop: 0,
    message: "",
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

    this.refreshTimes();

    socket.off("bot_uttered");
    socket.off("connect");
    wx.closeSocket();
    //是否链接到服务器
    socket.on('connect', () => {
      console.log(socket.connected); // true
    });
    // //链接超时触发
    // socket.on('connect_timeout', (timeout) => {
    //   // ...
    // });

    // //重新尝试链接   错误时触发
    // socket.on('reconnect_error', (error) => {
    //   // ...
    // });

    // //无法在内部重新链接时触发
    // socket.on('reconnect_failed', () => {
    //   // ...
    // });
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    //为给定事件注册新的处理程序。
    //socket.on 接收的一些东西
    //news 可以作为后端通过 socket.emit 发的事件名 ，d 为发送的数据
    socket.on('bot_uttered', (d: { text: string }) => {
      let item: any = {
        "sender": "response",
        "text": d.text,
        "type": "richtext"
      };
      if (d.text && d.text.indexOf("{") == 0) {
        let jsonItem = JSON.parse(d.text);
        item = { ...item, ...jsonItem };
      } else {
        item['text'] = d.text;
        item['type'] = 'text';
      }
      console.log('sssss', item);
      var list: any[] = []
      list = that.addMessageAndSync(item);
      that.setData({
        newslist: list
      }, () => {
        that.bottom();
      });
    })
  },
  onShareAppMessage: function (res) {
    console.log('33333', res.from);
    if (res.from === 'button') {
      console.log(res.target);
      return;
    }

    const app = getApp<IAppOption>();
    const promise = new Promise(resolve => {
      wx.request({
        method: 'GET',
        url: 'https://www.idns.link/rrai/wx/share/msgid',
        header: {
          'content-type': 'text/plain',
          'Authorization': app.globalData.jwtToken
        },
        success(res) {
          console.log(res.data);
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
    socket.off("bot_uttered");
    socket.off("connect");
    wx.closeSocket();
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

      socket.emit('user_uttered', { message: event.currentTarget.dataset.msg });
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
            //socket.emit 发送一些东西   
            //news 为事件名  后边是你要发送的数据
            // socket.emit('user_uttered', { message: msg });
            wx.request({
              method: 'POST',
              url: 'https://www.idns.link/rrai/chatGPT/message',
              data: {
                message: msg
              },
              header: {
                'content-type': 'application/json',
                'Authorization': app.globalData.jwtToken
              },
              success: function (res) {
                // 成功后的逻辑处理
                console.log(res);
                if (res && res.data && res.data.code > 0) {
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
                  return;
                }
                flag.refreshTimes();
                let text = "没有找到答案!我马上再学习学习，你再问问！";
                if (res && res.data && res.data.data) {
                  text = "";
                  for (let i = 0; i < res.data.data.length; i++) {
                    let item = res.data.data[i];
                    if (item && item.text) {
                      text += item.text && item.text.trim();
                    }
                  }
                }
                let list = flag.addMessageAndSync({
                  "sender": "response",
                  "text": text,
                  "type": "text"
                });
                flag.setData({
                  newslist: list,
                  sendLoading: false,
                }, () => {
                  flag.bottom();
                });
              },
              fail: function (res) {
                let list = flag.addMessageAndSync({
                  "sender": "response",
                  "text": '抱歉,软软大脑反应不过来了，请重新问我!',
                  "type": "text"
                });
                flag.setData({
                  newslist: list,
                  sendLoading: false,
                  message: ''
                }, () => {
                  flag.bottom();
                });
              }
            });
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

  }

})



