// pkg_zhengzhao/pages/preimgedit/index.ts
import { PhotoSize, getPhotoSizeList } from '../../sevices/index';
import { uploadFileGetTempUrl, baiduImageClassifyBodySeg } from '../../../services/index';
import { formatDate, blobToFile, base64ToBlob } from '../../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: 295,
    height: 413,
    px: '295×413 px',
    size: '25 × 35 mm',
    name: '一寸',
    description: '',
    preImgInfoList: [
      "头部居中，正对镜头",
      "光线充足，不逆光",
      "站在白墙跟前"
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    const { data } = options;
    console.log(data, options);
    if (!data) {
      return;
    }
    let item = JSON.parse(decodeURIComponent(data));
    this.setData({ ...item });
    // wx.setNavigationBarTitle({ title: this.data.photoName })
    this.getPreImgInfoList()
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
 * 选择照片
 */
  chooseImagePre(e) {
    const that = this
    that.chooseImage(e.target.dataset.type)
  },
  //获取标题图片
  getPreImgInfoList() {
    wx.showLoading({ title: '加载中', })
    // const that = this
    // const db = wx.cloud.database()
    // db.collection('preImgInfoList').get().then(res => {
    //   res.data.forEach(e => {
    //     e.imgUrl = e.imgUrl.trim()
    //   });
    //   that.setData({
    //     preImgInfoList: res.data
    //   })
    //   wx.hideLoading()
    // })

    wx.hideLoading()
  },
  chooseImage(sourceType) {
    const that = this;
    wx.showLoading({ title: '选择照片' })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    if (sourceType === 'camera') {
      const { width, height, name } = this.data
      //选择相机拍照
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.camera']) {
            wx.navigateTo({
              url: '../autocamera/index',
              success: function (res) {
                res.eventChannel.emit('toAutoCamera', {
                  width,
                  height,
                  name
                })
              }
            })
          } else {
            wx.authorize({
              scope: 'scope.camera',
              success() {
              },
              fail() {
                that.openConfirm()
              }
            })
          }
        },
        fail() {

        }
      })

    } else {
      //选择打开相册
      wx.chooseMedia({
        count: 1,
        mediaType: 'image',
        sourceType: [sourceType],
        sizeType: 'original',
        camera: 'back',
        success: (res) => {
          this.imgUpload(res.tempFiles[0].tempFilePath)
        },
        fail() {
          wx.showToast({ title: '取消选择', icon: 'none', duration: 2000 })
        }
      })
    }
  },
  openConfirm() {
    wx.showModal({
      content: '检测到您没打开访问摄像头权限，是否打开？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        //点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          wx.openSetting({
            success: (res) => { }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    });
  },
  // 上传原图， 后使用百度人像分割
  imgUpload(filePath: string) {
    const app = getApp<IAppOption>();
    const openid = app.globalData.userId;
    if (!openid) return;
    wx.showLoading({ title: '正在检测图像中', })
    const fileName = filePath.split('tmp/')[1] || filePath.split('tmp_')[1];
    let cloudPath = `temp/zjz/${openid}/${formatDate(new Date())}/${fileName}`;

    uploadFileGetTempUrl(filePath, cloudPath).then(res => {
      if (res == null) {
        wx.showToast({ title: '失败,请重试', icon: 'loading' })
      } else {
        this.imageDivision(res.fileTempUrl)
      }
    }).catch(error => {
      console.log(error)
      wx.showToast({ title: '失败,请重试', icon: 'loading' })
    })
  },

  // 使用百度人像分割
  imageDivision(fileUrl: string) {
    //调用百度的人像分割
    baiduImageClassifyBodySeg(fileUrl).then((result: any) => {
      wx.hideLoading();
      console.log(result);
      //foreground
      if (result && result.person_num >= 1) {
        this.goEditPage(result, fileUrl);
      } else if (result && result.person_num <= 0) {
        wx.showToast({ title: "没有识别出人像，请重试~", icon: 'error' });
      } else {
        wx.showToast({ title: "进行图片解析失败，请重试~", icon: 'error' });
      }
    }).catch((error) => {
      wx.hideLoading();
      console.log(error);
      wx.showToast({ title: '失败，请重试', icon: 'error' });
    });
  },
  /**
 * 去编辑页面
 */
  goEditPage(imageDivision: any, tmpOriginImgSrc: string) {
    //base64 to File
    // const blob = base64ToBlob(imageData, "image/png");
    // const file = blobToFile(blob, `${new Date().getTime()}.png`);

    let data = this.data;

    wx.navigateTo({
      url: '../editphoto/index',
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          ...data,
          tmpOriginImgSrc: tmpOriginImgSrc,
          imageDivision: imageDivision,
        })
      }
    })
  },
})