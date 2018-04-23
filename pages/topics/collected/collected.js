import { origin, imgOrigin } from '../../../config.js'
const appInstance = getApp()

// pages/topics/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topicList: [],
    imgOrigin
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let sessionId = wx.getStorageSync('session_id')
    wx.request({
      url: origin + '/user/topic_list',
      method: 'get',
      data: sessionId ? { session_id: sessionId } : {},
      success: (res) => {
        if (!res.data.success) {
          return wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        this.setData({
          topicList: res.data.data
        })
        console.log(res.data.data)
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

  goDetail(e) {
    var _id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/topics/detail/detail?_id=' + _id,
      fail: () => {
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        })
      }
    })
  },

  topicAdd() {
    if (appInstance.globalData.userData._id) {
      wx.navigateTo({
        url: '/pages/topics/add/add'
      })
    } else {
      appInstance.showLoginModal('signin')
    }
  }
})