import { origin } from './config.js'

App({
  globalData: {
    qqMapKey: '2Y4BZ-JU7KO-INAWM-SYJWI-6ZR22-K3BWU',
    toastData: {},
    timer: null,
    userData: {}
  },

  onLaunch () {
    let sessionId = wx.getStorageSync('session_id')

    if (sessionId) {
      this.checkLogin(sessionId)
    }
  },

  checkLogin (sessionId) { // 检查登录态
    wx.request({
      url: origin + '/user/check_login',
      method: 'post',
      data: { session_id: sessionId },
      success: res => {
        console.log(res.data)
        if (!res.data.success) {
          wx.removeStorageSync('session_id')
        } else {
          this.globalData.userData = res.data.data
        }
      },
      fail: err => {
        console.log(err)
        wx.showToast({
          title: '请求出错',
          icon: 'none'
        })
      }
    })
  },

  showLoginModal () {
    wx.showModal({
      title: '需要先登录',
      content: '前往登录或注册',
      confirmText: '去登录',
      cancelText: '晚点再说',
      success: res => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/entrance/index/index'
          })
        }
      }
    })
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