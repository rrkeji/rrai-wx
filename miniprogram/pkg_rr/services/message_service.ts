export const messageSecCheck = async (msg: string) => {
  const app = getApp<IAppOption>();
  //进行安全检测
  let res = await wx.cloud.callContainer({
    "config": {
      "env": "prod-5gwfszum5fc2702e"
    },
    "path": "/wx/msg/sec_check",
    "header": {
      "X-WX-SERVICE": "rrai",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      content: msg
    }
  });
  console.log(res.data);
  return res.data;
}

/**
 * 
 * @param args 
 */
export const createPromptToServer = async (args: {
  ai_type: string,
  prompts: Array<string>,
  title: string,
  images?: Array<string>,
  purpose?: string,
  tags: Array<string>,
  examples?: string,
}) => {
  let res = await wx.cloud.callContainer({
    "config": {
      "env": "prod-5gwfszum5fc2702e"
    },
    "path": "/prompts/create",
    "header": {
      "X-WX-SERVICE": "rrai",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      ai_type: args.ai_type,
      prompts: args.prompts,
      title: args.title,
      images: args.images,
      purpose: args.purpose,
      tags: args.tags.join(','),
      examples: args.examples,
    }
  });
  console.log(res.data);
  return res.data;
}