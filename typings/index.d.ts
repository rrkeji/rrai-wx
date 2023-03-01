/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userId?: string,
    avatar?: string,
    nickname?: string,
    systemInfo: any,
    statusBarHeight: number,
    customBarHeight: number,
  }
  refreshUserConfig: () => Promise<any>,
  getRecordAuth: () => void,
}