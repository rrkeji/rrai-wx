// 获取应用实例
import { getPromptsCategories, PromptsCategory, searchPrompts, searchUserPrompts } from '../../../services/prompts_service';
import { setHeight } from '../../../utils/scroller-util';
const PAGE_SIZE: number = 5;
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
    baseConfig: {
      shake: true, // 是否开启下拉震动
      height: 70,
      text: {
        color: "#fff", // 文字颜色
        shadow: 5, // 是否开启shadow阴影,0为不开启,数值越大阴影范围越大
      },
      background: {
        color: "#000000",
        height: 200,
        img: "/images/list-top.jpg",
      },
    },
    loadMoreSetting: {
      status: "more",
      more: {
        text: '上拉加载更多',
        color: '#999',
      },
      loading: {
        text: '加载中...',
        color: '#999',
      },
      noMore: {
        text: '-- 到底啦 --',
        color: '#999',
      },
      color: "#999",
    },
    emptySetting: {
      img: "/images/empty.png",
      text: "暂无内容",
    },
    nav: <Array<PromptsCategory>>[],
    activeModule: 0,
    active: 0,
    key: '',
  },
  //-----
  wholeList: <Array<any>>[],
  pageHeightArr: <Array<any>>[],
  currentRenderIndex: 0,
  totalPageNum: 0,
  param: {
    page: 0,
    page_size: PAGE_SIZE,
  },
  //-----
  onLoad() {
    // 设置缓存全部数据
    this.wholeList = [];
    // 设置当前渲染第几页
    this.currentRenderIndex = 0;
    // 设置缓存每一页页面高度
    this.pageHeightArr = [];
    // 设置总页数
    this.totalPageNum = 0;
    // 设置分页
    this.param = {
      page_size: PAGE_SIZE,
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
    const loadMoreSetting = than.data.loadMoreSetting;
    // 判断当前是否为加载状态 防止页面重复添加数据
    if (loadMoreSetting.status !== "loading") {
      loadMoreSetting.status = "loading";
      than.setData({
        loadMoreSetting,
      });
      //加载数据
      const page = this.param.page;
      this.currentRenderIndex = page;
      if (than.totalPageNum > 0 && page == than.totalPageNum) {
        //没有更多
        const loadMoreSetting = than.data.loadMoreSetting;
        loadMoreSetting.status = "noMore";
        than.setData({
          loadMoreSetting,
        });
      } else {
        //请求下一页数据
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
              //没有更多的数据
              const loadMoreSetting = than.data.loadMoreSetting;
              loadMoreSetting.status = "noMore";
              than.setData({
                isEmpty: true,
                loadMoreSetting,
              });
            } else {
              than.wholeList[page] = data;
              const datas: { [key: string]: any } = {
                isEmpty: false
              };
              datas["list[" + page + "]"] = data;
              than.setData(datas, () => {
                setHeight(than);
                const loadMoreSetting = than.data.loadMoreSetting;
                loadMoreSetting.status = "more";
                than.setData({
                  loadMoreSetting,
                });
                than.param.page += 1;
              });
              //
              // setTimeout(() => {},500);
            }
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    } else {

    }
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
    this.wholeList = [];
    this.currentRenderIndex = 0;
    this.pageHeightArr = [];
    that.setData({
      list: [],
    });
    this.param = {
      page: 0,
      page_size: 10,
    };
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
    this.refresh();
  },
  onModuleChange: function (event: any) {
    this.refresh();
  },
  onShareAppMessage: function () {
    // 页面被用户分享时执行
  },

  TouchStart(e) {
    let that = this;
    that.setData({
      touchx: e.changedTouches[0].clientX,
      touchy: e.changedTouches[0].clientY,
    });
  },
  TouchEnd(e) {
    // console.log(e)
    let that = this;
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    let turn = "";
    if (x - that.data.touchx > 50 && Math.abs(y - that.data.touchy) < 50) {
      //右滑
      // console.log(r);
      turn = "right";
    } else if (
      x - that.data.touchx < -50 &&
      Math.abs(y - that.data.touchy) < 50
    ) {
      //左滑
      // console.log(l);
      turn = "left";
    }
    //根据方向进行操作
    if (turn == "right") {
      //从左往右
      if (that.data.active != 0) {
        that.setData({
          active: that.data.active - 1,
        });
      }
    }
    if (turn == "left") {
      //从右往左
      if (that.data.active < that.data.nav.length - 1) {
        that.setData({
          active: that.data.active + 1,
        });
      }
    }
  },
  onListItemTap(event: any) {
    console.log(event, event.detail);
    //调整到
    wx.navigateTo({
      url: '../prompt-detail/index?prompt_id=' + event.detail.prompt_id,
    });
  }
});
