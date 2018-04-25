import { origin, imgOrigin } from '../../../config.js';
import utils from '../../../utils.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgOrigin,
    goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myData = {}
    this.myData.shop_id = options.shop_id // || '5aab848fb07552196c2da73b'
    let categoryId = options.category_id

    wx.request({
      url: origin + '/user/goods_list',
      method: 'get',
      data: utils.filterEmptyValue({
        shop_id: this.myData.shop_id,
        category_id: categoryId
      }),
      success: res => {
        console.log(res.data.data)
        if (!res.data.success) {
          return wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }

        this.setData({
          goodsList: res.data.data
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

  goGoods (e) {
    let _id = e.currentTarget.dataset._id

    wx.navigateTo({
      url: '/pages/goods/detail/detail?goods_id=' + _id + '&shop_id=' + this.myData.shop_id
    })
  }
})