// components/msgs/message-replicate/index.ts
import { replicateProxyQueryByPredictionId, getTempFileURLByFileId } from '../../../services/index';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    response: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        console.log(newVal);
        let fileIds = newVal.data;
        if (fileIds && fileIds.length > 0) {
          getTempFileURLByFileId(fileIds).then((res) => {
            if (res && res.length > 0) {
              this.setData({
                fileLists: res.map((item) => item.tempFileURL)
              });
            }
          });
        }

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    timeout: 0,
    fileLists: <Array<string>>[]
  },
  lifetimes: {
    attached: function () {
      let app = getApp<IAppOption>();
      // 在组件实例进入页面节点树时执行
      if (this.data.response.result == 1) {
        //启动
        this.refreshResult();
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {

    }
  },
  /**
   * 组件的方法列表
   */
  methods: { // 这里是一个自定义方法
    onImageItemTap: function (event: any) {
      if (event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.url) {
        //预览图片
        let index = event.currentTarget.dataset.index;
        let url = event.currentTarget.dataset.url;
        console.log(event.currentTarget.dataset);
        wx.previewImage({
          current: url,
          urls: this.data.fileLists
        });
      }
    },
    onError: function (event: any) {
      console.log(event);
      let errors = this.data.errors;
      errors[event.currentTarget.dataset.index] = true;
      this.setData({
        errors: errors,
      });
    },
    refreshResult() {
      //请求后台获取到进度信息
      if (this.data.response.prediction_id) {
        replicateProxyQueryByPredictionId(this.data.response.prediction_id).then((res) => {
          console.log(res);
          if (res) {
            if (res.status == 2) {
              //完成
              let output = JSON.parse(res.file_list);
              this.findIndexAndUpdate(this.data.response.prediction_id, output, res.status);
            } else if (res.status == 1) {
              //未完成
              setTimeout(this.refreshResult, 1000, this);
              return;
            } else {
              //失败
              this.findIndexAndUpdate(this.data.response.prediction_id, [], res.status);
            }
          }
        }).catch((err) => {
          console.error(err);
        });
      }
    },
    findIndexAndUpdate(prediction_id: string, data: any, status: number) {
      const messages = wx.getStorageSync('image_messages') || []

      for (let i = messages.length - 1; i >= 0; i--) {
        let item = messages[i];
        if (item.prediction_id == prediction_id && item.sender == 'response') {
          item.result = status;
          item.data = data;
          wx.setStorageSync('image_messages', messages);
          this.triggerEvent('imagestoragesync', {});
          return;
        }
      }
    },
    onImageStorageSync(e: any) {
      this.triggerEvent('imagestoragesync', e.detail);
    }
  }
})
