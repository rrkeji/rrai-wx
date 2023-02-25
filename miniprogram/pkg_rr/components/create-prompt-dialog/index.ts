// pkg_rr/components/create-prompt-dialog/index.ts
import { createPromptToServer } from '../../services/message_service';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    aiType: {
      type: String,
      value: 'ChatGPT_Text'
    },
    prompt: {
      type: String,
      value: ""
    },
    examples: {
      type: String,
      value: ""
    }
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
    title: '',
    purpose: '',
    tags: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTitleChange(event: any) {
      this.setData({
        title: event.detail.value
      });
    },
    onPurposeChange(event: any) {
      this.setData({
        purpose: event.detail.value
      });
    },
    onTagsChange(event: any) {
      this.setData({
        tags: event.detail.value
      });
    },
    tapDialogButton(event: any) {

      const _btn = event.detail.item.text;
      if (_btn == '确定') {
        console.log('=====', this.data.examples, this.data.prompt);
        let title: string = this.data.title;
        let purpose: string = this.data.purpose;
        let tag: string = this.data.tags;
        let tags: Array<string> = [];
        if (tag != '') {
          tags = tag.split(",").filter((str) => str.trim() != '');
        }
        createPromptToServer({
          ai_type: this.data.aiType,
          prompts: [this.data.prompt],
          title: title,
          images: [],
          purpose: purpose,
          tags: tags,
          examples: this.data.examples,
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
