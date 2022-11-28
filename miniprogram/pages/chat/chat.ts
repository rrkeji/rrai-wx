// chat.ts
// 获取应用实例
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
    scrollTop: 0,
    test: `<div class="rich_message" style="width:100%;">
    <h2 style="color:red;">11月26日</h2>
    <h2 style="color:red;border:2rpx solid #000000">十一月初三</h2>
    <div class="row">
      <div class="border col6">
      <p class="title">
        宜
      </p>
        <p>
        乔迁 签合同 安灶 签约 交房 出差 进宅 领证 出门 搬家 迁居 出行 交易 安床 买房 买车 养殖 剃胎发 投资 入学 耕种 入宅 搬公司 安橱柜 
        </p>
      </div>
      <div class="border  col6">
      <p class="title">
        忌
      </p>
        <p>
        乔迁 签合同 安灶 签约 交房 出差 进宅 领证 出门 搬家 迁居 出行 交易 安床 买房 买车 养殖 剃胎发 投资 入学 耕种 入宅 搬公司 安橱柜 
        </p>
      </div>
    </div>
    <div  class="row">
      <div class="border col6">
      <p class="title">彭祖百忌</p>
      <p>癸不词讼，理弱敌强  未不服药，毒气入肠 </p>
      </div>
      <div class="border col6">
      <p class="title">凶煞宜忌</p>
      <p>月火 月杀 勾陈黑道 五鬼 重丧 重复 月煞 月害 触水龙 土王用事 四击 复日 </p>
      </div>
    </div>
    <div   class="row">
      <div colspan="4" class="border col12">
      <p class="title">吉神方位</p>
      <p>喜神东南 财神正南 福神东北   阳贵东南  阴贵正东  </p>
      </div>
    </div>
    <div   class="row">
      <div class="border col6">
        <p class="title">今日吉神</p>
        <p>"月德", "四相", "大葬", "鸣吠", "不守塚", "母仓", "除神", </p>
      </div>
      <div class="border col6">
        <p class="title">今日凶煞</p>
        <p>"岁破", "天罡", "月害", "劫煞", "独火", "受死", "八座", "五离", "蚩尤", "伐日",</p>
      </div>
    </div>
    <div  class="row">
      <div class="border col3">
        <p class="title">今日胎神</p>
        <p>房床厕外西北</p>
      </div>
      <div class="border col3">
        <p class="title">生肖冲煞</p>
        <p>猴日冲虎</p>
      </div>
      <div class="border col3">
      <p class="title">今日五行</p>
      <p>"天干", "甲", "属木", "地支", "申"</p>
      </div>
    </div>
    <div  class="row">
      <div class="border col3">
      <p class="title">八字</p>
      <p>壬寅 辛亥 甲申 戊辰</p>
      </div>
      <div class="border col3">
      <p class="title">星座</p>
      <p>射手座</p>
      </div>
      <div class="border col3">
      <p class="title">纳音</p>
      <p>井泉水</p>
      </div>
    </div>
  </div>
  `,
    message: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this
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

    //为给定事件注册新的处理程序。
    //socket.on 接收的一些东西
    //news 可以作为后端通过 socket.emit 发的事件名 ，d 为发送的数据
    socket.on('bot_uttered', (d: { text: string }) => {
      console.log('received news: ', d)
      let item: any = {
        "hidden": false,
        "nextMessageIsTooltip": false,
        "sender": "response",
        "showAvatar": false,
        "text": d.text,
        "content": `<div class="rich_message"></div>`,
        "url": "https://www.idns.link/#/./download",
        "format": d.text,
        "mediaId": d.text,
        // 缩略图的媒体id
        "thumbMediaId": d.text,
        "locationX": d.text,
        "locationY": d.text,
        "scale": d.text,
        "title": '标题',
        "thumbPicUrl": 'https://img2.woyaogexing.com/2022/11/25/8374eb28f670c4c85c0d1104253a6b83.jpeg',
        "description": d.text,
        "timestamp": 1667436405268,
        // text richtext image voice video shortvideo location link
        "type": "richtext"
      };
      if (d.text && d.text.indexOf("{") == 0) {
        let jsonItem = JSON.parse(d.text);
        item = { ...item, ...jsonItem };
      } else {
        item['content'] = d.text;
        item['type'] = 'text';
      }
      var list: any[] = []
      list = that.data.newslist
      list.push(item);
      that.setData({
        newslist: list
      });
      that.bottom();
    })
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
  //事件处理函数
  send: function () {
    var flag = this
    if (this.data.message.trim() == "") {
      wx.showToast({
        title: '消息不能为空哦~',
        icon: "none",
        duration: 2000
      })
    } else {
      var list: any[] = []
      list = flag.data.newslist
      list.push({
        "hidden": false,
        "nextMessageIsTooltip": false,
        "sender": "client",
        "showAvatar": false,
        "text": this.data.message,
        "timestamp": 1667436405268,
        "type": "text"
      });
      let msg = this.data.message;
      const app = getApp<IAppOption>();

      wx.request({
        method: 'POST',
        url: 'https://www.idns.link/rrai/wx/msg/check',
        header: {
          'content-type': 'text/plain',
          'Authorization': app.globalData.jwtToken
        },
        data: msg,
        success(res) {
          console.log(res.data)
          let resObj = res.data as any;
          if (resObj && resObj.code == 0) {
            //socket.emit 发送一些东西   
            //news 为事件名  后边是你要发送的数据
            socket.emit('user_uttered', { message: msg });
            flag.setData({
              newslist: list,
              message: ''
            });
          } else {
            wx.showToast({
              title: '消息不符合发言的规范,请重新编辑~',
              icon: "none",
              duration: 2000
            })
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
        scrollTop: res[0] && res[0].bottom  // #the-id节点的下边界坐标  
      })
      res[1] && res[1].scrollTop // 显示区域的竖直滚动位置  
    })
  },
  //链接的跳转
  linkGoTo: function (event: any) {
    if (event.currentTarget && event.currentTarget.dataset &&
      event.currentTarget.dataset.url) {
      let url = event.currentTarget.dataset.url;
      console.log(url);
      wx.navigateTo({
        url: `../webview/webview?url=${url}`,
      })
    }
  },
})



