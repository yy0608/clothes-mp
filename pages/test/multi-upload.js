import { origin } from '../../config.js'

Page({

  data: {
    uploadData: [ // type: 1为文本，2为图片
      {
        type: 1,
        value: '文本内容1'
      },
      {
        type: 1,
        value: '文本内容1'
      },
      {
        type: 2,
        value: 'http://img.wsweat.cn/common/nopic.jpg'
      },
      {
        type: 1,
        value: '文本内容1'
      },
      {
        type: 2,
        value: 'http://img.wsweat.cn/common/nopic.jpg'
      },
      {
        type: 2,
        value: 'http://img.wsweat.cn/common/nopic.jpg'
      },
      {
        type: 1,
        value: '文本内容1'
      }
    ]
  },
  onLoad () {
    wx.getUserInfo({
      success: res => {
        console.log(res)
      }
    })
    console.log(origin)
    wx.request({
      // url: origin + '/employ/merchant_shops',
      url: origin + '/employ/near_shops',
      method: 'get',
      data: {
        location: '114.001432, 22.681253'
      },
      success: res => {
        console.log(res.data)
      }
    })
  }
})