// 每隔5秒向服务端发送消息"ping",服务端接收到消息后给我们回个话"pong"
// 如果超过5秒服务端还没回复“pong”，则认为连接断开的（将启动重连）
class HeartCheck {
  lockReconnect = false;//避免ws重复连接
  maxReconnectionDelay = 30 * 60000;//最大重连时间
  minReconnectionDelay = 10 * 1000; //最小重连时间
  reconnectionDelayGrowFactor = 1.5; //自动重连失败后重连时间倍数增长
  connectionTimeout = 10 * 1000;//重连时间
  pongTime = 30 * 1000; //30秒接收心跳
  pingTime = (30 * 1000 / 10) * 8;//30秒向服务器发送心跳
  timeoutObj = 0;//Ping定时器
  serverTimeoutObj = 0;//Pong定时器

  getSocket: () => any = () => {
    return null;
  };

  constructor(getSocketFunc: () => any) {
    this.getSocket = getSocketFunc;
  }
  PingStart() {
    var self = this;
    clearTimeout(this.timeoutObj);
    this.timeoutObj = setTimeout(function () {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      if (self.getSocket() != null && self.getSocket().readyState ==
        self.getSocket().OPEN) {
        self.getSocket().send({ data: JSON.stringify({ "cmd": "Ping" }) })
        self.PingStart();
      } else {
        console.log('----');
        self.PingStart();
      }
    }, this.pingTime) //10秒发送一次心跳
  }
  PongStart() {
    var self = this;
    clearTimeout(this.serverTimeoutObj);
    self.serverTimeoutObj = setTimeout(function () { //如果超过一定时间还没重置，说明后端主动断开了
      if (self.getSocket() != null) {
        //console.log("服务器30秒没有响应，关闭连接")
        self.getSocket().close();
      }
    }, self.pongTime)
  }
}

export class ReconnectWebsocket {
  //
  websocket: any = null;

  //
  isBusy: boolean = false;

  //
  isSending: boolean = false;

  //
  options: {
    onMessage: (cmd: string, data: any) => void;
    onOpen?: (res: any) => void;
    onError?: (res: any) => void;
    onClose?: (res: any) => void;
    userId: string;
  } = {
      onMessage: () => { },
      onOpen: () => { },
      onError: () => { },
      onClose: () => { },
      userId: '',
    }
  //
  heartCheck: HeartCheck | null = null;

  constructor(options1: {
    onMessage: (cmd: string, data: any) => void;
    onOpen?: (res: any) => void;
    onError?: (res: any) => void;
    onClose?: (res: any) => void;
    userId: string;
  }) {
    console.log(options1);
    this.options = options1;
    this.heartCheck = new HeartCheck(() => {
      return this.getSocket();
    });
    setTimeout(() => {
      this.socketInit(true);
    }, 10);
  }
  getSocket = () => {
    return this.websocket;
  }

  reconnect() {
    //避免ws重复连接
    if (this.heartCheck!.lockReconnect)
      return;
    this.heartCheck!.lockReconnect = true;

    setTimeout(() => {
      //没连接上会一直重连，设置延迟避免请求过多
      this.socketInit(true);
      this.heartCheck!.lockReconnect = false;
    }, this.heartCheck!.connectionTimeout);

    if (this.heartCheck!.connectionTimeout >= this.heartCheck!.minReconnectionDelay && this.heartCheck!.connectionTimeout < this.heartCheck!.maxReconnectionDelay) {
      this.heartCheck!.connectionTimeout = this.heartCheck!.connectionTimeout * this.heartCheck!.reconnectionDelayGrowFactor
    } else {
      this.heartCheck!.connectionTimeout = this.heartCheck!.minReconnectionDelay;
    }
  }

  isOnline(): boolean {
    return this.websocket !== null && this.websocket.readyState === this.websocket.OPEN;
  }

  async socketInit(reconnection = false) {
    if (this.websocket == null) {
      // const { socketTask } = await wx.cloud.connectContainer({
      //   "config": {
      //     "env": "prod-5gwfszum5fc2702e"
      //   },
      //   "service": "chat",
      //   "path": "/"
      // })
      // this.websocket = socketTask;
      this.websocket = wx.connectSocket({
        // url: 'wss://wsschat.idns.link',
        url: 'ws://127.0.0.1:3000',
        header: {
          "x-wx-openid": this.options.userId,
        },
        success: (res) => {
          console.log('success', res);
        },
        fail: (res) => {
          console.log('fail', res);
        },
        complete: (res) => {
          console.log('complete', res);
        },
      });
      this.websocket.onOpen((res: any) => {
        console.log('onOpen', res);
        this.options.onOpen && this.options.onOpen(res);
        this.websocket.send({ data: JSON.stringify({ "cmd": "Ping" }) })
        this.heartCheck!.PingStart();
        //打开心跳检测
        this.heartCheck!.PongStart();
      });
      this.websocket.onError((err: any) => {
        this.options.onError && this.options.onError(err);
        console.log(err);
      });
      this.websocket.onMessage((res: any) => {
        try {
          let messageStr = res.data;
          console.log('接收到的数据:', messageStr, typeof (messageStr));
          if (!messageStr) {
            console.error("messageStr为空");
            return;
          }
          let messageObj: any = {};
          try {
            messageObj = JSON.parse(messageStr);
          } catch (error) {
            console.error("解析json失败");
            return;
          }
          if (messageObj.src === 'Ping') {
            //心跳报文不处理
          } else if (messageObj.cmd === 'Error') {
            //错误
            this.isBusy = false;
            this.options.onError && this.options.onError(messageStr);
          } else if (messageObj.cmd === 'Response' && messageObj.src !== '') {
            //普通的命令返回
            try {
              //调用处理函数
              this.isBusy = false;
              this.options.onMessage(messageObj.src, messageObj.message);
            } catch (error) {
              console.log(error);
            }
          } else if (messageObj.cmd === 'Stream' && messageObj.message !== '') {
            //Stream
            try {
              //调用处理函数
              this.options.onMessage('Stream', messageObj.message);
            } catch (error) {
              console.log(error);
            }
          }

          if (this.websocket != null) {
            //拿到任何消息都说明当前连接是正常的 心跳检测重置
            this.heartCheck!.PingStart();
            this.heartCheck!.PongStart();
          }
        } catch (e) {
          console.log(e);
          this.options.onError && this.options.onError(e);
        }
      });

      this.websocket.onClose((res: any) => {
        //console.log("Connection closed.");
        this.options.onClose && this.options.onClose(res);
        this.reconnect(); //打开自动重连
      });
    } else {
      //状态判断
      switch (this.websocket.readyState) {
        case this.websocket.CONNECTING: //表示正在连接。
          //console.log("正在连接");
          break;
        case this.websocket.OPEN: //表示连接成功，可以通信了。
          //console.log("已经连接");
          break;
        case this.websocket.CLOSING: //表示连接正在关闭。
          //console.log("正在关闭,1秒后再次尝试连接");
          setTimeout(() => {
            this.socketInit();
          }, 1000);
          break;
        case this.websocket.CLOSED: //表示连接已经关闭，或者打开连接失败
          //console.log("已经关闭,再次连接");
          this.websocket = null;
          this.socketInit(true);
          break;
        default:
          // this never happens
          break;
      }
    }
  }

  /**
   * 
   * @param command 
   * @param data 
   */
  sendCommand = (command: string, data: any): number => {

    console.log(this.websocket.readyState, this.websocket.OPEN);
    if (this.websocket.readyState === this.websocket.OPEN) {
      if (this.isSending) {
        return 1;
      }
      this.isSending = true;
      try {
        this.websocket.send({
          data: JSON.stringify({
            cmd: command,
            args: data
          })
        });
      } catch (e) {
        console.log(e);
        //发送失败
        return 2;
      }
      this.isSending = false;
      this.isBusy = true;
      return 0;
    } else {
      return 3;
    }
  }
}