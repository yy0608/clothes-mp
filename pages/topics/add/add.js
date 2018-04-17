import { origin } from '../../../config.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topicData: {}
  },

  onLoad: function (options) {
    wx.request({
      url: origin + '/user/topic_edit_detail',
      method: 'get',
      data: {
        topic_id: '5ad1600257a5b90e58827de3'
      },
      success: res => {
        console.log(res.data)
        this.setData({
          topicData: res.data.data
        })
      }
    })
  }
})