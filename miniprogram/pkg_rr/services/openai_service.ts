export const openaiImagesGenerations = async (prompt: string) => {
  //
  let res = await wx.cloud.callContainer({
    "config": {
      "env": "prod-5gwfszum5fc2702e"
    },
    "path": "/openai/images/generations",
    "header": {
      "X-WX-SERVICE": "rrai",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      prompt: prompt,
      size: '512x512',
      n: 2,
      response_format: 'url'
    }
  });
  console.log(res.data);
  return res.data;
}