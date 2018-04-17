const qiniuUploader = require('../../libs/qiniuUploader.js')
const utils = require('../../utils.js')
import { origin, imgOrigin } from '../../config.js'

Page({

  data: {
    uploadSrc: '',
    topicData: {
      title: '',
      content: [{
        type: 1,
        value: '创造性'
      }, {
        type: 2,
        value: ['https://img.wsweat.cn/common/nopic.jpg', 'https://img.wsweat.cn/common/nopic.jpg', 'https://img.wsweat.cn/common/nopic.jpg', 'https://img.wsweat.cn/common/nopic.jpg', 'https://img.wsweat.cn/common/nopic.jpg']
      }]
    }
  },
  onLoad() {
    // wx.request({
    //   // url: origin + '/employ/merchant_shops',
    //   url: origin + '/employ/near_shops',
    //   method: 'get',
    //   data: {
    //     location: '114.001432, 22.681253'
    //   },
    //   success: res => {
    //     console.log(res.data)
    //   }
    // })
  },

  addContent (e) {
    for (let item of this.data.topicData.content) {
      if (!item.value) {
        return wx.showToast({
          title: '请填充内容，或删除输入项',
          icon: 'none'
        })
      }
    }

    let type = e.currentTarget.dataset.type

    switch (type) {
      case 1:
        this.data.topicData.content.push({
          type: 1,
          value: ''
        })
        break
      case 2:
        let lastContent = this.data.topicData.content[this.data.topicData.content.length - 1]
        if (lastContent.type === 2) {
          lastContent.value.push('https://img.wsweat.cn/common/nopic.jpg')
        } else {
          if (!lastContent.value) {
            return wx.showToast({
              title: '请填充内容，或删除输入项',
              icon: 'none'
            })
          }
          this.data.topicData.content.push({
            type: 2,
            value: ['https://img.wsweat.cn/common/nopic.jpg']
          })
        }
        break
      default:
        console.log('type出错')
        break
    }
    this.setData({
      topicData: this.data.topicData
    })
  },

  textInput (e) {
    let index = e.currentTarget.dataset.index

    this.data.topicData.content[index].value = e.detail.value
  },

  didPressChooseImage: function () {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var filePath = res.tempFilePaths[0];
        var uploadKey = 'cache/' + utils.generateGuid() + '.' + filePath.split('.')[filePath.split('.').length - 1]
        // 交给七牛上传
        qiniuUploader.upload(filePath, res => { // res的值hash, key, imageURL
          console.log(res)
        }, err => { // err的值error, imageURL(imgOrigin + undefined)
          console.log('error: ' + err);
        }, {
            region: 'SCN', // 华南SCN
            key: uploadKey,
            domain: imgOrigin,
            // uptoken: '[yourTokenString]',
            uptokenURL: origin + '/qiniu/generate_token'
          }, res => {
            console.log('上传进度', res.progress)
            // console.log('已经上传的数据长度', res.totalBytesSent)
            // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
          });
      }
    })
  }
})