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
  reset() {
    // clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  }
  PingStart() {
    var self = this;
    this.timeoutObj = setTimeout(function () {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      if (self.getSocket() != null && self.getSocket().readyState() ==
        self.getSocket().OPEN) {
        self.getSocket().send("PING")
        self.PingStart();
      }
    }, this.pingTime) //10秒发送一次心跳
  }
  PongStart() {
    var self = this;
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
  options: {
    onMessage: (res: any) => void;
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
    onMessage: (res: any) => void;
    onOpen?: (res: any) => void;
    onError?: (res: any) => void;
    onClose?: (res: any) => void;
    userId: string;
  }) {
    console.log(options1);
    this.options = options1;
    this.heartCheck = new HeartCheck(this.getSocket);
    this.socketInit(true);
  }
  getSocket() {
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

  socketInit(reconnection = false) {
    console.log('sssssss');
    if (this.websocket == null) {
      this.websocket = wx.connectSocket({
        url: 'wss://wsschat.idns.link',
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
      this.websocket.onOpen = (res: any) => {
        this.options.onOpen && this.options.onOpen(res);
        this.websocket.send("PING")
        this.heartCheck!.PingStart();
        //打开心跳检测
        this.heartCheck!.reset().PongStart();
      }
      this.websocket.onError = (err: any) => {
        this.options.onError && this.options.onError(err);
        //console.log(err);
        if (this.websocket != null) {
          //console.log("异常，关闭连接", err);
          this.websocket.close();
        } else {
          this.reconnect(); //打开自动重连
        }
      }
      this.websocket.onMessage = (res) => {
        try {
          this.options.onMessage(res);
          if (this.websocket != null) {
            //拿到任何消息都说明当前连接是正常的 心跳检测重置
            this.heartCheck!.reset().PongStart();
          }
        } catch (e) {
          console.log(e);
        }
      };

      this.websocket.onClose = (res) => {
        //console.log("Connection closed.");
        this.options.onClose && this.options.onClose(res);
        this.websocket.reconnect(); //打开自动重连
      };
    } else {
      //状态判断
      switch (this.websocket.readyState()) {
        case this.websocket.CONNECTING: //表示正在连接。
          //console.log("正在连接");
          break;
        case this.websocket.OPEN: //表示连接成功，可以通信了。
          //console.log("已经连接");
          break;
        case this.websocket.CLOSING: //表示连接正在关闭。
          //console.log("正在关闭,1秒后再次尝试连接");
          setTimeout(() => {
            this.websocket.socketInit();
          }, 1000);
          break;
        case this.websocket.CLOSED: //表示连接已经关闭，或者打开连接失败
          //console.log("已经关闭,再次连接");
          this.websocket = null;
          this.websocket.socketInit(true);
          break;
        default:
          // this never happens
          break;
      }
    }
  }
}