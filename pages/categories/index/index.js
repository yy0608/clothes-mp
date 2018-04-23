import { origin, imgOrigin } from '../../../config.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgOrigin,
    leftCotegories: [],
    rightCategories: [],
    leftCurIndex: 0,
    qiniuQuery: '?imageView2/2/w/160/h/160'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myData = {}
    wx.request({
      url: origin + '/user/goods_categories',
      method: 'get',
      complete: res => {
        if (res.statusCode === 200) {
          if (!res.data.success) {
            return wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
          this.myData.categoriesData = res.data.data
          this.data.leftCategories = res.data.data.filter(item => {
            return item.level === 1
          })
          this.getRightCategories(this.data.leftCategories[0]._id)
          this.setData({
            leftCategories: this.data.leftCategories,
            rightCategories: this.data.rightCategories
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

  changeCategory (e) {
    let dataset = e.currentTarget.dataset
    let index = dataset.index
    let _id = dataset._id
    this.getRightCategories(_id)
    this.setData({
      leftCurIndex: index,
      rightCategories: this.data.rightCategories
    })
  },

  goGoods (e) {
    let _id = e.currentTarget.dataset._id

    wx.navigateTo({
      url: '/pages/goods/index/index?category_id=' + _id
    })
  },

  getRightCategories (_id) {
    this.data.rightCategories = []
    for (let i = 0; i < this.myData.categoriesData.length; i++) {
      if (this.myData.categoriesData[i].parent_id === _id) {
        let category = Object.assign({}, this.myData.categoriesData[i])
        category.children = []
        for (let j = 0; j < this.myData.categoriesData.length; j++) {
          if (this.myData.categoriesData[j].parent_id === this.myData.categoriesData[i]._id) {
            category.children.push(this.myData.categoriesData[j])
          }
        }
        this.data.rightCategories.push(category)
      }
    }
  }
})