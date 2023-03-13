// components/prompts/create-prompt-dialog/index.ts
import { createPromptToServer, getPromptsCategories, getTagsByCategory, addPromptTag } from '../../../services/index';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    requestitem: {
      type: Object,
      value: {},
    },
    responseitem: {
      type: Object,
      value: {}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    buttons: [
      {
        text: '取消'
      },
      {
        text: '确定'
      }
    ],
    categories: <Array<any>>[],
    categorySelected: 0,
    tagsInCategory: <Array<any>>[],
    tagsCheckboxValues: [],
    title: '',
    purpose: '',
    tags: '',
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      //reward logs
      getPromptsCategories().then((res) => {
        //查询第一个分类下的标签
        getTagsByCategory(res[0].category).then((tags) => {
          //查询第一个分类下的标签
          this.setData({
            categorySelected: 0,
            tagsInCategory: tags,
            categories: res.map((item) => item.category),
          });
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onUsePrompt: function (e: any) {
      this.setData({
        title: this.data.requestitem.text
      });
    },
    bindPickerChange: function (e: any) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      //
      getTagsByCategory(this.data.categories[e.detail.value]).then((tags) => {
        //查询第一个分类下的标签
        this.setData({
          categorySelected: e.detail.value,
          tagsInCategory: tags,
          tags: ''
        });
      }).catch((err) => {
        console.log(err);
      });
    },
    onTitleChange(event: any) {
      if (event.detail.value.length > 512) {
        wx.showToast({
          title: '标题不能太长~',
          icon: "none",
          duration: 2000
        });
        return;
      }
      this.setData({
        title: event.detail.value
      });
    },
    onPurposeChange(event: any) {
      this.setData({
        purpose: event.detail.value
      });
    },
    checkboxChange(e: any) {
      console.log('checkbox发生change事件，携带value值为：', e.detail.value)

      this.setData({
        tagsCheckboxValues: e.detail.value
      });
      // const items = this.data.tagsInCategory;
      // const values = e.detail.value;
      // for (let i = 0, lenI = items.length; i < lenI; ++i) {
      //   items[i].checked = false;
      //   for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
      //     if (items[i].value === values[j]) {
      //       items[i].checked = true;
      //       break
      //     }
      //   }
      // }
    },
    onTagsChange(event: any) {
      this.setData({
        tags: event.detail.value
      });
    },
    tapDialogButton(event: any) {
      const _btn = event.detail.item.text;
      if (_btn == '确定') {
        //查看是否需要添加标签
        let tag: string = this.data.tags;
        //添加tag
        addPromptTag(tag, this.data.categories[this.data.categorySelected]).then((res) => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
        });

        console.log('=====', this.data.responseitem, this.data.requestitem);
        let title: string = this.data.title;
        let purpose: string = this.data.purpose;
        let tags: Array<string> = [].concat(this.data.tagsCheckboxValues);
        tags.push(tag);

        createPromptToServer({
          ai_type: this.data.requestitem.type,
          prompts: [this.data.requestitem.text],
          title: title,
          images: [],
          purpose: purpose,
          tags: tags,
          examples: JSON.stringify(this.data.responseitem),
        }).then((res) => {
          console.log(res);
          this.setData({
            show: false,
          });
        }).catch((err) => {
          console.log(err);
          this.setData({
            show: false,
          });
        });
      } else {
        this.setData({
          show: false,
        });
      }
    }
  }
})
