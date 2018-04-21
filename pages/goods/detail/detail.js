import { origin, imgOrigin } from '../../../config.js';

Page({

  data: {
    imgOrigin,
    goodsDetail: []
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
        this.setData({
          goodsDetail: res.data.data
        })
      },
      fail: err => {
        console.log(err)

        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },

  previewFigure (e) {
    let index = e.currentTarget.dataset.index
    let parsedImgArr = this.data.goodsDetail.figure_imgs.map(item => {
      return imgOrigin + item
    })

    wx.previewImage({
      urls: parsedImgArr,
      current: parsedImgArr[index] + '?imageView2/0/w/750'
    })
  }
})