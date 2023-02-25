/**
 * 提供wx.createScrollContext进行管理功能
 */
export function observePage(pageIndex: number, that: any) {
  wx.getSystemInfo({
    success: (res) => {
      const {
        windowHeight
      } = res
      // this.windowHeight = windowHeight
      const observerObj = wx.createIntersectionObserver(that).relativeToViewport({
        top: 2 * windowHeight,
        bottom: 2 * windowHeight
      })
      observerObj.observe(`#wrp_${pageIndex}`, (res) => {
        if (res.intersectionRatio <= 0) {
          try {
            that.setData({
              ['list[' + pageIndex + ']']: [
                {
                  height: that.pageHeightArr[pageIndex]
                }
              ],
            })
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            that.setData({
              ['list[' + pageIndex + ']']: that.wholeList[pageIndex],
            })
          } catch (error) {
            console.log(error);
          }
        }
      })
    }
  })

}

export function setHeight(that: any) {
  const page = that.param.page
  wx.createSelectorQuery().select(`#wrp_${page}`).boundingClientRect().exec(function (res) {
    that.pageHeightArr[page] = res[0] && res[0].height
  })
  observePage(page, that)
}
