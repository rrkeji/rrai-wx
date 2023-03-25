// pkg_pexels/pages/index/index.ts
import { proxyPexelsImageSearch, proxyPexelsImageCurated } from '../../../services/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 列表数据
    list: [],
    // 数据列表加载中
    listDataLoading: false,
    // 瀑布流加载中
    waterfallLoading: false,
    // 数据加载完毕
    loaded: false,
    //检索关键字
    keywords: '',
    //
    perPage: 20,
    page: 1,
    total: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.update()
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
    this.update()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 加载更多
  loadMore() {
    console.log('loadMoreData:', this.data.page)
    this.getSearchData().then((more) => {
      let { list } = this.data
      list = [...list, ...more]
      // console.log('loadMoreData:', list)
      this.setData({ list })
    }).catch((err) => {
      console.log(err);
    });
  },

  // 刷新新瀑布流
  update() {
    this.data.page = 1;
    this.data.total = 0;
    // 重置瀑布流组件
    this.setData({ loaded: false });
    this.selectComponent('#waterfall').reset();

    this.getSearchData().then((list) => {
      this.setData({ list })
      wx.stopPullDownRefresh()
    }).catch((err) => {
      console.log(err);
    });
  },

  onLoadingChange(e) {
    this.setData({
      waterfallLoading: e.detail
    })
  },

  /**
   * 获取模拟数据
   */
  async getSearchData() {
    let { page, perPage, listDataLoading, loaded, keywords } = this.data;
    if (listDataLoading || loaded) return [];
    this.setData({
      listDataLoading: true
    });
    let list = [];
    let res: any;
    if (keywords && keywords.trim() !== '') {
      //关键字为空
      res = await proxyPexelsImageSearch(keywords, page, perPage);
    } else {
      //
      res = await proxyPexelsImageCurated(page, perPage);
    }
    console.log(res);
    if (res && res.photos) {
      let total = res.total_results;
      list = res.photos.map((item: any, index: number) => {
        return {
          id: item.id,
          text: item.photographer,
          imgUrl: item.src.tiny,
          ...item,
        }
      });
      this.setData({
        listDataLoading: false
      })
      if (page * perPage >= total) {
        this.setData({ loaded: true })
      }
      this.data.page = this.data.page + 1;
      this.data.total = total;
      return list;
    } else {

      return list;
    }
  },

  //检索
  onSearchTap(e: any) {
    let keywords = e.detail.keywords;
    this.setData({
      keywords: keywords
    }, () => {
      this.update();
    });
  },
  onItemClick(e: any) {
    console.log(e.detail);
    wx.navigateTo({
      url: `../detail/index?id=${e.detail.id}&large=${encodeURIComponent(e.detail.src.large)}&original=${encodeURIComponent(e.detail.src.original)}`
    });
  }
})