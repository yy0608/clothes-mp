App({
  globalData: {
    qqMapKey: '2Y4BZ-JU7KO-INAWM-SYJWI-6ZR22-K3BWU',
    toastData: {},
    timer: null
  },

  showToast(params) { // type: 'default', 'success', 'info', 'tip', 'error'
    let pages = getCurrentPages()
    let curPage = pages[pages.length - 1]
    let defaultParams = {
      text: '(请传入text)',
      duration: 2500,
      type: 'default'
    }
    let resolveParams = Object.assign(defaultParams, params)
    this.globalData.toastData = {
      text: resolveParams.text,
      type: resolveParams.type
    }
    if (this.globalData.timer) {
      clearTimeout(this.globalData.timer)
      this.globalData.timer = null
      this.globalData.toastData.show = false
      curPage.setData({
        toastData: this.globalData.toastData
      })
      setTimeout(() => {
        this.showToastHide(curPage, resolveParams.duration)
      }, 300)
    } else {
      this.showToastHide(curPage, resolveParams.duration)
    }
  },

  showToastHide(curPage, duration) {
    this.globalData.toastData.show = true
    curPage.setData({
      toastData: this.globalData.toastData
    })
    this.globalData.timer = setTimeout(() => { // 隐藏
      this.globalData.toastData.show = false
      curPage.setData({
        toastData: this.globalData.toastData
      })
      clearTimeout(this.globalData.timer)
      this.globalData.timer = null
    }, duration)
  }
})