
import { formatTime } from '../../utils/util';

export interface RewardLogEntity {
  id: number,
  user_id: string,
  amount: number,
  is_reward: boolean,
  reason: string,
  ref_id: number,
  ref_str_id: string,
  create_time: number,
  update_time: number,
  create_time_str: string,
  update_time_str: string,
}
const convertRewardLogEntity = (item: any): any => {
  //时间
  item.create_time_str = formatTime(new Date(item.create_time * 1000));
  item.update_time_str = formatTime(new Date(item.update_time * 1000));
  //事件
  return item;
}

export const searchRewardLogs = async (page: number, pageSize: number, keywords?: string, startDate?: string, endDate?: string): Promise<any> => {

  let res = await wx.cloud.callContainer({
    "config": {
      "env": "prod-5gwfszum5fc2702e"
    },
    "path": "/reward/logs",
    "header": {
      "X-WX-SERVICE": "rrai",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": {
      "page": page,
      "page_size": pageSize,
      "conditions": {
        "keywords": (!keywords || keywords.trim() == '') ? undefined : keywords,
      }
    }
  });
  console.log(res);
  if (res && res.statusCode == 200) {
    console.log(res.data);
    res.data.data = res.data.data.map((item) => convertRewardLogEntity(item));
    return res.data;
  }
};

export const updateUserConfig = async (config: { avatar?: string, nickname?: string }): Promise<any> => {
  //请求剩余次数等
  let res = await wx.cloud.callContainer({
    "config": {
      "env": "prod-5gwfszum5fc2702e"
    },
    "path": "/user/config",
    "header": {
      "X-WX-SERVICE": "rrai",
      "content-type": "application/json"
    },
    "method": "POST",
    "data": config
  });
  const app = getApp<IAppOption>();
  if (app) {
    app.refreshUserConfig();
  }
  console.log(res.data);
  return res.data;
}
