import { origin, imgOrigin } from '../../../config.js';

Page({

  data: {
    imgOrigin
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _id = options._id || '5adaab60549d0909a0a4afb6'

    wx.request({
      url: origin + '/user/goods_detail',
      method: 'get',
      data: { _id },
      success: res => {
        if (!res.data.success) {
          return wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }

        console.log(res.data.data)
      },
      fail: err => {
        console.log(err)

        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  }
})