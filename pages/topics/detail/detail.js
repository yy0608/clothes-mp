import { origin, imgOrigin } from '../../../config.js';

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
    let _id = options._id ? options._id : '5acd6f44474d9225907b243d'
    wx.request({
      url: origin + '/all/topic_detail',
      data: { _id },
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})