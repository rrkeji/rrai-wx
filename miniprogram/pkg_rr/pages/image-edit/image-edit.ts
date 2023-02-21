// pkg_rr/pages/image-edit/image-edit.ts
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
      imageList: [path, path],
      resultList: [path, path]
    })
    return;
    let { ossUrl } = this.data.form;
    console.log(ossUrl)
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    }),
      
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

    //将本地资源上传到服务器
    wx.uploadFile({
      url: baseUrl,    // 开发者服务器地址
      filePath: path,   // 要上传文件资源的路径 (本地路径)
      name: 'editormd-image-file',   // 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
      header: {
        // HTTP 请求 Header，Header 中不能设置 Referer
        "Content-Transfer-Encoding": "binary",
        "Content-Type": "application/octet-stream",
        "Content-Disposition": "form-data"
      },
      formData: {
        //和服务器约定的token, 一般也可以放在header中
        'token': wx.getStorageSync('userData').token,
      },
      success: function (res) {
        console.log(res)
        // 判断下
        if (res && res.data) {
          const data = JSON.parse(res.data);
          if (res.statusCode != 200) {
            wx.showToast({
              title: data.responseBody.data.message,
              icon: 'none'
            })
            return;
          } else {
            if (!!data.responseBody.data) {
              ossUrl.push(data.responseBody.data.url);
              _this.setData({
                imageList: ossUrl,
                'form.ossUrl': ossUrl
              })
            }
          }
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
      },
      complete: function () {
        wx.hideToast(); //隐藏Toast
      }
    })
  }
})