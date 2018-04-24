import { origin, imgOrigin } from '../../../config.js'
const appInstance = getApp()
import utils from '../../../utils.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topicDetail: {},
    commentCount: 0,
    collected: false,
    collectedCount: 0,
    liked: false,
    likedCount: 0,
    imgOrigin
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myData = {}
    this.myData.topic_id = options._id || '5ad1600257a5b90e58827de3'
  },

  onShow () {
    this.myData.user_id = appInstance.globalData.userData._id
    let sessionId = wx.getStorageSync('session_id')
    wx.request({
      url: origin + '/user/topic_detail',
      data: utils.filterEmptyValue({
        ...this.myData,
        session_id: sessionId
      }),
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
          commentCount: res.data.comment_count,
          collected: res.data.collected,
          collectedCount: res.data.collected_count,
          liked: res.data.liked,
          likedCount: res.data.liked_count
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
    if (!this.myData.user_id) {
      return appInstance.showLoginModal('signin')
    }

    wx.request({
      url: origin + '/user/topic_like',
      method: 'post',
      data: utils.filterEmptyValue({
        ...this.myData,
        session_id: sessionId,
        liked: this.data.liked
      }),
      // data: {
      //   ...this.myData,
      //   liked: this.data.liked
      // },
      success: res => {
        if (!res.data.success) {
          return wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }

        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })

        this.setData({
          liked: !this.data.liked,
          likedCount: this.data.liked ? this.data.likedCount - 1 : this.data.likedCount + 1
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

  collect () {
    if (!this.myData.user_id) {
      return appInstance.showLoginModal('signin')
    }

    wx.request({
      url: origin + '/user/topic_collect',
      method: 'post',
      data: {
        ...this.myData,
        collected: this.data.collected
      },
      success: res => {
        if (!res.data.success) {
          return wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }

        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })

        if (this.data.collected) {
          this.setData({
            collected: false,
            collectedCount: this.data.collectedCount - 1
          })
        } else {
          this.setData({
            collected: true,
            collectedCount: this.data.collectedCount + 1
          })
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

  comment () {
    if (this.myData.user_id) {
      wx.navigateTo({
        url: '/pages/topics/comment/comment?_id=' + this.myData.topic_id
      })
    } else {
      appInstance.showLoginModal('signin')
    }
  }
})