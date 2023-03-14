/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userId?: string,
    avatar?: string,
    nickname?: string,
    checkin: string,
    times: number,
    vip: number,
    recharge: number,
    COMMON_HEADERS: { [key: string]: string },
  }
  refreshUserConfig: () => Promise<any>,
  getRecordAuth: () => void,
}