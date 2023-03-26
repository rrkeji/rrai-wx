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
    sysOptions: any,
    COMMON_HEADERS: { [key: string]: string },
  }
  refreshSystemConfig: () => Promise<any>,
  refreshUserConfig: () => Promise<any>,
  getRecordAuth: () => void,
}