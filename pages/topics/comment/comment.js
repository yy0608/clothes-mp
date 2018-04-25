import { origin, imgOrigin, defaultAvatarKey } from '../../../config.js';
const appInstance = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [],
    imgOrigin,
    defaultAvatarKey,
    qiniuQuery: '?imageView2/2/w/160/h/160'
  },

  onLoad: function (options) {
    this.myData = {}
    this.myData.topic_id = options._id || '5ad1600257a5b90e58827de3'
    this.myData.author_id = appInstance.globalData.userData._id

    this.getCommentList()
  },

  getCommentList () {
    wx.request({
      url: origin + '/user/comment_list',
      method: 'get',
      success: res => {
        if (!res.data.success) {
          return wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        this.setData({
          commentList: res.data.data
        })
        console.log(res.data.data)
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

  commentInput (e) {
    this.myData.comment = e.detail.value
  },

  comment () {
    wx.request({
      url: origin + '/user/comment',
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
        return wx.showToast({
          title: '请求出错',
          icon: 'none'
        })
      }
    })
  },

  like (e) {
    let _id = e.currentTarget.dataset._id
    console.log(_id)
    wx.request({
      url: origin + '/user/comment_like',
      method: 'post',
      data: {
        user_id: this.myData.author_id,
        comment_id: _id
      },
      complete: res => {
        if (res.statusCode === 200) {
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
        } else {
          wx.showToast({
            title: '请求出错',
            icon: 'none'
          })
        }
      }
    })
  }
})