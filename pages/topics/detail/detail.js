import { origin, imgOrigin } from '../../../config.js';
const appInstance = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topicDetail: null,
    commentCount: 0,
    imgOrigin
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myData = {}
    this.myData.topic_id = options._id ? options._id : '5ad1600257a5b90e58827de3'
    this.myData.user_id = appInstance.globalData.userData._id
    let sessionId = wx.getStorageSync('session_id')
    wx.request({
      url: origin + '/user/topic_detail',
      data: sessionId ? { session_id: sessionId, _id: this.myData.topic_id } : { _id: this.myData.topic_id },
      method: 'get',
      success: res => {
        if (!res.data.success) {
          return wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        this.setData({
          topicDetail: res.data.data,
          commentCount: res.data.comment_count
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

  like () {
    console.log(this.myData.topic_id)

    appInstance.showLoginModal()
  },

  collect () {
    console.log(this.myData)

    if (!this.myData.user_id) {
      return appInstance.showLoginModal()
    }

    wx.request({
      url: origin + '/user/topic_collect',
      method: 'post',
      data: this.myData,
      success: res => {
        if (!res.data.success) {
          return wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }

        console.log(res.data)
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

  comment () {
    if (this.myData.user_id) {
      wx.navigateTo({
        url: '/pages/topics/comment/comment?_id=' + this.myData.topic_id
      })
    } else {
      appInstance.showLoginModal()
    }
  }
})