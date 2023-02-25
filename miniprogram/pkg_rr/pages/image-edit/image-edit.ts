// pkg_rr/pages/image-edit/image-edit.ts
import { FormData } from '../../../utils/form-data';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: [],
    resultList: [],
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const app = getApp<IAppOption>();
    let that = this;
    app.getMainAreaHeight(that).then(res => {
      that.setData({
        mainHeight: 'height:-webkit-calc(100vh - ' + res + 'px);height: calc(100vh - ' + res + 'px);'
      })
    })
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
  /**
   * 
   */
  bindTextAreaBlur() {

  },
  /**
   * 
   */
  bindTextAreaConfirm() {

  },
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
  // 选择图片
  chooseWxImage(type) {
    let _this = this;
    let imgs = this.data.imageList;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success(res) {
        if (imgs.length > 2) {
          return wx.showToast({
            title: '最多可上传三张图片',
            icon: 'none'
          })
        }
        _this.upload(res.tempFilePaths[0]);
      }
    })
  },
  //上传图片到服务器
  upload: function (path) {
    let _this = this;
    console.log(path);
    _this.setData({
      imageList: [path]
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
  onSubmit() {

    const app = getApp<IAppOption>();

    wx.showToast({
      icon: "loading",
      title: "正在上传"
    });
    let formData = new FormData();

    formData.append('prompt', '肖像，一名士兵，写实的面向镜头的。');
    formData.appendFile('image', this.data.imageList[0], 'image.png');

    let data = formData.getData();

    //将本地资源上传到服务器
    wx.cloud.callContainer({
      "config": {
        "env": "prod-5gwfszum5fc2702e"
      },
      "path": "/openai/images/edits",
      "header": {
        "X-WX-SERVICE": "rrai",
        "content-type": data.contentType
      },
      "method": "POST",
      "data": data.buffer
    }).then((res) => {
      console.log(res);
      if (res && res.statusCode == 200) {
        wx.hideToast(); //隐藏Toast
      } else {
        //请求失败
        wx.showToast({
          title: '提交失败',
          icon: 'none'
        });
      }
    }).catch((err) => {
      console.log(err);
      wx.showToast({
        title: '提交失败',
        icon: 'none'
      })
    });

    // wx.request({
    //   url: 'https://rrai-29154-7-1315753304.sh.run.tcloudbase.com/openai/images/edits',
    //   // url: 'http://localhost/openai/images/edits',
    //   "method": "POST",
    //   header: {
    //     "Env": "prod-5gwfszum5fc2702e",
    //     "X-WX-SERVICE": "rrai",
    //     "x-wx-openid": app.globalData.userId,
    //     'content-type': data.contentType
    //   },
    //   data: data.buffer,
    //   success: (res) => {
    //     console.log(res);
    //     if (res && res.statusCode == 200) {
    //       wx.hideToast(); //隐藏Toast
    //     } else {
    //       //请求失败
    //       wx.showToast({
    //         title: '提交失败',
    //         icon: 'none'
    //       });
    //     }
    //   },
    //   fail: (err) => {
    //     console.log(err);
    //   }
    // });
  }
})