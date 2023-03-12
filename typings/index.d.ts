/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userId?: string,
    avatar?: string,
    nickname?: string,
    COMMON_HEADERS: { [key: string]: string },
  }
  refreshUserConfig: () => Promise<any>,
  getRecordAuth: () => void,
}