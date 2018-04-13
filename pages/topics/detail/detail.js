import { origin, imgOrigin } from '../../../config.js';
const appInstance = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topicDetail: null,
    imgOrigin
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myData = {}
    this.myData._id = options._id ? options._id : '5acd6f44474d9225907b243d'
    let sessionId = wx.getStorageSync('session_id')
    wx.request({
      url: origin + '/user/topic_detail',
      data: sessionId ? { session_id: sessionId, _id: this.myData._id } : { _id: this.myData._id },
      method: 'get',
      success: res => {
        if (!res.data.success) {
          return wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        this.setData({
          topicDetail: res.data.data
        })
      },
      fail: err => {
        console.log(err)
        return wx.showToast({
          title: '请求出错',
          icon: 'none'
        })
      }
    })
  },

  like () {
    console.log(this.myData._id)

    appInstance.showLoginModal()
  },

  comment () {
    let userData = appInstance.globalData.userData

    if (userData._id) {
      wx.navigateTo({
        url: '/pages/topics/comment/comment?_id=' + this.myData._id
      })
    } else {
      appInstance.showLoginModal()
    }
  }
})