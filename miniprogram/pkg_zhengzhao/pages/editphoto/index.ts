

const { default: touch } = require('./touch')

import { imageComposeByItems, ImageComposeItem, getTempFileURLByFileId } from '../../../services/index';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    targetWidth: 0, // 目标图片宽度
    targetHeight: 0,
    showScale: 1, // 图片缩放比例
    filePath: '', // 普通版透明图
    guided: '', // 指引已完成
    guideStep: 1, // 指引第一步
    hideDownloadBtn: false, // 隐藏下载按钮
    bgc: '#ffffff', // 照片背景色，选项非实际颜色
    photoBg: '#ffffff', // 实际颜色
    customBg: '#ff0000',
    showColorPicker: false, // 颜色面板是否打开
    portrait: {
      initImgHeight: 0,
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      scale: 1,
    },
  },
  //选择改色时触发（在左侧色盘触摸或者切换右侧色相条）
  onChangeColor(e) {
    this.setData({
      photoBg: e.detail.colorData.pickerData.hex,
      customBg: e.detail.colorData.pickerData.hex,
    })
  },
  // 切换背景
  toggleBg(e) {
    const bgc = e.currentTarget.dataset.color;
    const showColorPicker = bgc === 'custom';
    const photoBg: any = showColorPicker ? this.data.customBg : {
      red: '#ff0000',
      blue: '#438edb',
      blue2: '#00bff3',
      white: '#ffffff',
      transparent: 'transparent'
    }[bgc]
    this.setData({
      bgc,
      showColorPicker,
      photoBg
    })
  },

  //关闭拾色器
  closeColorPicker() {
    this.setData({ showColorPicker: false })
  },

  // 图片合成
  async composeImage() {
    wx.showLoading({ title: '制作中...', })
    const { photoBg, targetWidth, targetHeight, filePath, portrait } = this.data
    // 底图
    const baseImg = { data: photoBg, data_type: 'color', x: 0, y: 0, width: Math.floor(targetWidth), height: Math.floor(targetHeight) }
    // 人像图
    const peopleImg = { data: filePath, data_type: 'url', ...this.computedXY(baseImg, portrait) }
    // 组合图片顺序
    const data: Array<ImageComposeItem> = [baseImg, peopleImg]
    let res = await imageComposeByItems(targetWidth, targetHeight, data, 'wx_file_id');
    if (res?.data) {
      //fileId
      let fileId = res.data;
      //fileId 获取临时的文件 URL
      let filelist = await getTempFileURLByFileId([fileId]);
      if (filelist && filelist.length > 0) {
        this.downloadAndToComplate(filelist[0].tempFileURL)
      }
    }
  },

  // 下载并跳转
  async downloadAndToComplate(url: string) {
    try {
      // 下载图片到本地
      const { tempFilePath, dataLength } = await this.downloadImg(url)
      // 保存图片到相册
      await this.saveImage(tempFilePath)
      wx.showToast({
        title: '保存成功!',
        icon: 'success',
        duration: 2000
      });
    } catch (error) {
      console.log(error);
      wx.showToast({
        title: '保存失败!',
        icon: 'error',
        duration: 2000
      });
    }
  },

  // 计算相对底图的 x ， y
  computedXY(baseImg, imgData) {
    const initImgWidth = this.data.targetWidth
    const left = (imgData.left - initImgWidth / 2)
    const top = (imgData.top - imgData.initImgHeight / 2)
    const noScaleImgHeight = baseImg.width * imgData.initImgHeight / initImgWidth
    const resultImgWidth = baseImg.width * imgData.scale
    const resultImgHeight = noScaleImgHeight * imgData.scale
    const scaleChangeWidth = (resultImgWidth / 2 - baseImg.width / 2)
    const scaleChangeHeight = (resultImgHeight / 2 - noScaleImgHeight / 2)
    const x = left - scaleChangeWidth
    const y = top - scaleChangeHeight
    return { x: Math.floor(x), y: Math.floor(y), width: Math.floor(resultImgWidth), height: Math.floor(resultImgHeight) }
  },

  // 将远端图片，下载到本地
  downloadImg(url) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url,
        success(res) {
          if (res.statusCode === 200) {
            resolve(res)
          } else {
            reject(res)
          }
        },
        fail(error) {
          reject(error)
        }
      })
    })
  },

  // 保存图片到相册
  saveImage(tempFilePath) {
    return new Promise((resolve, reject) => {
      wx.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: () => {
          resolve()
        },
        fail(res) {
          wx.getSetting({
            success(res) {
              if (res.authSetting['scope.writePhotosAlbum']) {
                wx.showToast({ title: '下载失败，点击帮助', icon: 'none' })
                reject(new Error('错误'))
              } else {
                wx.openSetting({
                  success() { },
                  fail(res) {
                    wx.showToast({ title: '失败，写入相册权限未授权', icon: 'none' })
                    reject(new Error('错误'))
                  }
                })
              }
            },
            fail() {
              reject(new Error('错误'))
            }
          })
        },
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.setNavigationBarTitle({ title: '免冠照制作' })
    wx.showLoading({ title: '图片加载中', })
    this.getGuide()
    this.receivingParameters()
  },

  // 接收参数
  receivingParameters() {
    const eventChannel = this.getOpenerEventChannel && this.getOpenerEventChannel()
    eventChannel && eventChannel.on('acceptDataFromOpenerPage', (data) => {
      const { width, height, imageDivision } = data;
      //通过文件ID获取一个临时的路径
      getTempFileURLByFileId([imageDivision.foreground_file_id]).then((filelist) => {
        if (!filelist || filelist.length <= 0) {
          return;
        }
        let fileUrl = filelist[0].tempFileURL;
        this.setData({
          targetWidth: width,
          targetHeight: height,
          showScale: (480 / (+width)),
          filePath: fileUrl,
        })
      }).catch((err) => {
        console.error(err);
      });
    })
  },

  // 获取引导指南是否完成
  getGuide() {
    const _this = this
    wx.getStorage({
      key: 'guided',
      success(res) {
        _this.setData({ guided: res.data })
      }
    })
  },

  // 指南下一步
  guideNext() {
    this.setData({
      guideStep: this.data.guideStep + 1
    })
  },

  // 完成指引
  completionGuide() {
    this.setData({ guided: true })
    wx.setStorage({ key: "guided", data: true })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
  },
  // 关闭上拉加载
  onReachBottom: function () {
    return
  },
  // 图片加载成功
  bindload: function (e) {
    wx.hideLoading({})
    const photoSizeObj = {
      width: this.data.targetWidth,
      height: this.data.targetHeight
    }
    const { width, height } = e.detail
    const _width = photoSizeObj.width
    const _height = _width * height / width
    const imgLoadSetData = {
      initImgHeight: _height,
      width: _width,
      height: _height,
      left: _width / 2,
      top: _height / 2 + photoSizeObj.height - _height
    }
    const outerDataName = e.currentTarget.dataset.dataname
    if (outerDataName === 'hair') {
      imgLoadSetData.top = _height / 2 + 10
    }
    this.setData({
      [outerDataName]: {
        ...this.data[outerDataName],
        ...imgLoadSetData
      }
    })
  },
  touchstart: function (e) {
    touch.touchstart(e)
  },
  touchmove(e) {
    const outerDataName = e.currentTarget.dataset.dataname
    const oldData = this.data[outerDataName]
    const newData = touch.touchmove(e, oldData)
    this.setData({
      [outerDataName]: {
        ...oldData,
        ...newData
      }
    })
  },
  touchend: function (e) {
    touch.touchend(e)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})