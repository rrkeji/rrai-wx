// components/prompts-input-image/index.ts
import { uploadFileGetTempUrl } from '../../services/index';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imageList: {
      type: Array,
      value: []
    },
    max: {
      type: Number,
      value: 3
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tempUrls: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 选择上传图片的方式
    chooseImageTap() {
      let _this = this;
      wx.showActionSheet({
        itemList: ['从相册中选择', '拍一张'],
        itemColor: "#f7982a",
        success(res) {
          if (!res.cancel) {
            if (res.tapIndex == 0) {
              // 从相册中选择
              _this.chooseWxImage('album')
            } else if (res.tapIndex == 1) {
              // 使用相机
              _this.chooseWxImage('camera')
            }
          }
        }
      })
    },
    chooseImageFromAlbumTap() {
      // 从相册中选择
      this.chooseWxImage('album')
    },
    chooseImageFromCameraTap() {
      // 从相册中选择
      this.chooseWxImage('camera')
    },
    // 选择图片
    chooseWxImage(type) {
      let _this = this;
      let imgs = this.data.imageList;
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: [type],
        maxDuration: 30,
        camera: 'back',
        success(res) {
          if (imgs.length >= _this.data.max) {
            return wx.showToast({
              title: '最多可上传' + _this.data.max + '张图片!',
              icon: 'none'
            })
          }
          //tempFilePath size
          _this.upload(res.tempFiles[0].tempFilePath);
        }
      })
    },
    //上传图片到服务器
    upload: function (path) {
      let _this = this;
      console.log(path);
      _this.setData({
        imageList: this.data.imageList.concat([path])
      })
      return;
    },
    // 删除图片
    removeChooseImage(e) {
      let imgs = this.data.imageList;
      let { index } = e.currentTarget.dataset;
      imgs.splice(index, 1);
      this.setData({
        imageList: imgs
      })
    },
    // 预览图片
    previewBigImage(e) {
      let imgs = this.data.imageList;
      let { index } = e.currentTarget.dataset;
      wx.previewImage({
        //当前显示图片
        current: imgs[index],
        //所有图片
        urls: imgs
      })
    },
  }
})
