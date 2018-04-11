import { origin, imgOrigin } from '../../../config.js'

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
    wx.request({
      url: origin + '/all/topic_list',
      method: 'get',
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
      }
    })
  },

  goDetail (e) {
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
  }
})