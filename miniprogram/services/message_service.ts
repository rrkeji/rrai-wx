export const messageSecCheck = async (msg: string) => {
  const app = getApp<IAppOption>();
  //进行安全检测
  let res = await wx.cloud.callContainer({
    "path": "/wx/msg/sec_check",
    "header": {
      ...getApp<IAppOption>().globalData.COMMON_HEADERS,
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
    "path": "/prompts/create",
    "header": {
      ...getApp<IAppOption>().globalData.COMMON_HEADERS,
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