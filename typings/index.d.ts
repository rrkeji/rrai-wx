/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    userId?: string,
    systemInfo: any,
    statusBarHeight: number,
    customBarHeight: number,
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
  getMainAreaHeight: (t: any) => Promise<number>,
}