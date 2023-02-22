
export interface PromptEntity {
  prompts: Array<string>,
  aiType: string,
  args: string,
}

export interface PromptsCategory {
  id: number,
  category: string,
  icon: string,
  ctype: string,
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
    return res.data.data.map((item:any)=>{
      item.title = item.category;
      return item;
    })
  }
};

export const searchPrompts = async (page:number, pageSize:number, keywords?:string, category?:string): Promise<any> => {

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
      "conditions":{
        "keywords":keywords,
        "category":category
      }
    }
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    return res.data;
  }
};
