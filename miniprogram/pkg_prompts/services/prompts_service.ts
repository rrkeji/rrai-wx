
import { formatTime } from '../../utils/util';

export interface PromptEntity {
  id: number,
  prompts: Array<string>,
  images: Array<string>,
  ai_type: string,
  args: string,
  create_time_str: string,
  update_time_str: string,
  user_id: string,
  title: string,
  tags: Array<string>,
  recommend: boolean,
  purpose: string,
  examples: string,
}

export interface PromptsCategory {
  id: number,
  category: string,
  icon: string,
  ctype: string,
}


const convertPromptEntity = (item: any): any => {
  //tags
  let tags = item.tags.split(',');
  item.tags = tags.filter((str)=>str!='');
  //prompts
  let prompts = item.prompts;
  try {
    item.prompts = JSON.parse(prompts);
  } catch (error) {
  }
  //images
  let images = item.images;
  item.images = JSON.parse(images);
  //时间
  item.create_time_str = formatTime(new Date(item.create_time * 1000));
  item.update_time_str = formatTime(new Date(item.update_time * 1000));
  //事件
  return item;
}

export const getPromptsCategories = async (): Promise<Array<PromptsCategory>> => {
  let res = await wx.cloud.callContainer({
    "config": {
      "env": "prod-5gwfszum5fc2702e"
    },
    "path": "/prompts_category/categories",
    "header": {
      "X-WX-SERVICE": "rrai",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      "page": 1,
      "page_size": 1000
    }
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    return res.data.data.map((item: any) => {
      item.title = item.category;
      return item;
    })
  }
};

export const searchPrompts = async (page: number, pageSize: number, keywords?: string, category?: string): Promise<any> => {

  let res = await wx.cloud.callContainer({
    "config": {
      "env": "prod-5gwfszum5fc2702e"
    },
    "path": "/prompts/prompts",
    "header": {
      "X-WX-SERVICE": "rrai",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      "page": page,
      "page_size": pageSize,
      "conditions": {
        "keywords": keywords,
        "category": category
      }
    }
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    console.log(res.data);
    res.data.data = res.data.data.map((item)=>convertPromptEntity(item));
    return res.data;
  }
};

export const getPromptById = async (promptId: number): Promise<any> => {

  let res = await wx.cloud.callContainer({
    "config": {
      "env": "prod-5gwfszum5fc2702e"
    },
    "path": "/prompts/byid/" + promptId,
    "header": {
      "X-WX-SERVICE": "rrai",
      "content-type": "application/json"
    },
    "method": "GET",
    "data": {
      "page": 1,
      "page_size": 10,
    }
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    return convertPromptEntity(res.data);
  }
}