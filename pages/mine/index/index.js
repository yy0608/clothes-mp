import { origin } from '../../../config.js';
const appInstance = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData: null
  },

  onShow: function (options) {
    this.setData({
      userData: appInstance.globalData.userData
    })
  },

  logout () {
    wx.request({
      url: origin + '/user/logout',
      method: 'post',
      data: {
        session_id: wx.getStorageSync('session_id')
      },
      success: res => {
        if (!res.data.success) {
          return wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }

        wx.removeStorageSync('session_id')
        appInstance.globalData.userData = {}
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })

        wx.navigateTo({
          url: '/pages/entrance/index/index?tab=signin'
        })
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

  goLogin () {
    wx.navigateTo({
      url: '/pages/entrance/index/index?tab=signin'
    })
  },

  goCollectedShops () {},

  goCollectedTopics () {
    wx.navigateTo({
      url: '/pages/topics/collected/collected?user_id' + this.data.userData._id
    })
  }
})