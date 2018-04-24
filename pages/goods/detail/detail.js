import { origin, imgOrigin } from '../../../config.js';
const appInstance = getApp()
import utils from '../../../utils.js'

Page({

  data: {
    imgOrigin,
    goodsDetail: {},
    collected: false,
    concerned: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myData = {}
    this.myData.goods_id = options.goods_id || '5adaab60549d0909a0a4afb6'
    this.myData.shop_id = options.shop_id || '5aab848fb07552196c2da73b'
  },

  onShow () {
    this.myData.user_id = appInstance.globalData.userData._id

    wx.request({
      url: origin + '/user/goods_detail',
      method: 'get',
      data: utils.filterEmptyValue({
        goods_id: this.myData.goods_id,
        shop_id: this.myData.shop_id,
        user_id: this.myData.user_id
      }),
      success: res => {
        if (!res.data.success) {
          return wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }

        console.log(res.data.data)
        this.setData({
          goodsDetail: res.data.data,
          collected: res.data.goods_collected,
          concerned: res.data.shop_concerned
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

  collectGoods () {
    if (!this.myData.user_id) {
      return appInstance.showLoginModal('signin')
    }
    wx.request({
      url: origin + '/user/goods_collect',
      method: 'post',
      data: utils.filterEmptyValue({
        // ...this.myData,
        user_id: this.myData.user_id,
        goods_id: this.myData.goods_id,
        // session_id: sessionId,
        collected: this.data.collected
      }),
      complete: res => {
        console.log(res)
        if (res.statusCode === 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })

          this.setData({
            collected: !this.data.collected
          })
        } else {
          wx.showToast({
            title: '请求出错',
            icon: 'none'
          })
        }
      }
    })
  },

  concernShop () {
    if (!this.myData.user_id) {
      return appInstance.showLoginModal('signin')
    }
    wx.request({
      url: origin + '/user/shop_concern',
      method: 'post',
      data: utils.filterEmptyValue({
        // ...this.myData,
        user_id: this.myData.user_id,
        shop_id: this.data.goodsDetail.shop_id._id,
        // session_id: sessionId,
        concerned: this.data.concerned
      }),
      complete: res => {
        console.log(res)
        if (res.statusCode === 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })

          this.setData({
            concerned: !this.data.concerned
          })
        } else {
          wx.showToast({
            title: '请求出错',
            icon: 'none'
          })
        }
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
      current: parsedImgArr[index]
    })
  },

  previewDetail(e) {
    let index = e.currentTarget.dataset.index
    let parsedImgArr = this.data.goodsDetail.detail_imgs.map(item => {
      return imgOrigin + item
    })

    wx.previewImage({
      urls: parsedImgArr,
      current: parsedImgArr[index]
    })
  }
})