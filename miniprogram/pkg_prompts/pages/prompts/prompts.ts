// 获取应用实例
import { getPromptsCategories, PromptsCategory, searchPrompts, searchUserPrompts } from '../../services/prompts_service';

Page({
  data: {
    modules: [{
      id: 1,
      title: '软软趣问'
    }, {
      id: 2,
      title: '我的趣问'
    }],
    list: <Array<Array<any>>>[],
    nav: <Array<PromptsCategory>>[],
    activeModule: 0,
    active: 0,
    key: '',
  },
  //-----
  currentRenderIndex: 0,
  totalPageNum: 0,
  param: {
    page_size: 10,
    page: 0,
  },
  //-----
  onLoad() {
    // 设置当前渲染第几页
    this.currentRenderIndex = 0;
    // 设置总页数
    this.totalPageNum = 0;
    // 设置分页
    this.param = {
      page_size: 10,
      page: 0,
    };
    //获取分类
    getPromptsCategories().then((res: any) => {
      this.setData({
        nav: [{
          id: 0,
          title: '全部',
          category: '全部',
          icon: null,
          ctype: null,
        }].concat(res)
      });
    }).catch(() => {

    });
    this.getList();
  },
  /**
   * 获取数据
   */
  getList() {
    const than = this;
    let page = this.param.page;
    let pageSize = this.param.page_size;
    //获取分类
    let categoryItem = this.data.nav[this.data.active];
    //  获取远程数据可换成自己封装的请求方法
    searchPrompts(page + 1, pageSize, this.data.key, categoryItem?.category).then((res) => {
      if (res && res.data) {
        console.log(res);
        let data = res.data;
        //总数
        than.totalPageNum = Math.ceil(data.total / pageSize);

        if (data.length === 0 && page === 0) {
        } else {
          let list: Array<Array<any>> = [];
          list[page] = data;
          than.setData({
            list: list
          }, () => {
            than.param.page += 1;
          });
        }
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  /**
   * 获取数据
   */
  getUserPromptList() {
    const than = this;
    let page = this.param.page;
    let pageSize = this.param.page_size;
    //  获取远程数据可换成自己封装的请求方法
    searchUserPrompts(page + 1, pageSize, this.data.key).then((res) => {
      if (res && res.data) {
        console.log(res);
        let data = res.data;
        //总数
        than.totalPageNum = Math.ceil(data.total / pageSize);

        if (data.length === 0 && page === 0) {
        } else {
          let list: Array<Array<any>> = [];
          list[page] = data;
          than.setData({
            list: list
          }, () => {
            than.param.page += 1;
          });
        }
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  refresh() {
    // 初始化缓存数据
    const that = this;
    that.setData({
      list: [],
    });
    if (this.data.activeModule === 1) {
      //我的
      that.getUserPromptList();
    } else {
      // 重新拉取数据
      that.getList();
    }
  },
  onBtnClick({ detail }) {
    this.refresh();
  },
  confirm({ detail }) {
    this.refresh();
  },
  onChange: function (event: any) {
    this.param = {
      page_size: 10,
      page: 0,
    };
    this.currentRenderIndex = 0;
    this.refresh();
  },
  onModuleChange: function (event: any) {
    //重置分页参数
    this.param = {
      page_size: 10,
      page: 0,
    };
    this.currentRenderIndex = 0;
    this.refresh();
  },
  onShareAppMessage: function () {
    // 页面被用户分享时执行
  },
  onListItemTap(event: any) {
    console.log(event, event.detail);
    //调整到
    wx.navigateTo({
      url: '../prompt-detail/index?prompt_id=' + event.detail.prompt_id,
    });
  }
});
