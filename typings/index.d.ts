/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userId?: string,
    avatar?: string,
    nickname?: string,
  }
  refreshUserConfig: () => Promise<any>,
  getRecordAuth: () => void,
}