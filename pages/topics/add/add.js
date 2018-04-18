const qiniuUploader = require('../../../libs/qiniuUploader.js')
const utils = require('../../../utils.js')
import { origin, imgOrigin } from '../../../config.js'
const appInstance = getApp()

Page({

  data: {
    imgOrigin,
    topicData: {
      title: '',
      content: [{
        type: 1,
        value: ''
      }]
    }
  },

  onLoad() {
    this.myData = {}
    this.myData.author_id = appInstance.globalData.userData._id || '5ad41cfdcb639017e89ac1e5'
  },

  addImg(e) {
    let index = e.currentTarget.dataset.index

    this.uploadImg(key => {
      this.data.topicData.content[index].value.push(key)

      this.setData({
        topicData: this.data.topicData
      })
    })
  },

  delImg(e) {
    let dataset = e.currentTarget.dataset
    let index = dataset.index
    let idx = dataset.idx

    this.data.topicData.content[index].value.splice(idx, 1)
    this.setData({
      topicData: this.data.topicData
    })
  },

  addContent(e) {
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
        this.setData({
          topicData: this.data.topicData
        })

        this.pageScrollToBottom()
        break
      case 2:
        let lastContent = this.data.topicData.content[this.data.topicData.content.length - 1]
        if (lastContent.type === 2) {
          this.uploadImg(key => {
            lastContent.value.push(key)

            this.setData({
              topicData: this.data.topicData
            })

            this.pageScrollToBottom()
          })
        } else {
          if (this.checkIsEmpty()) return

          this.uploadImg(key => {
            this.data.topicData.content.push({
              type: 2,
              value: [key]
            })

            this.setData({
              topicData: this.data.topicData
            })

            this.pageScrollToBottom()
          })
        }
        break
      default:
        console.log('type出错')
        break
    }
  },

  delContent(e) {
    let index = e.currentTarget.dataset.index

    this.data.topicData.content.splice(index, 1)

    this.setData({
      topicData: this.data.topicData
    })
  },

  titleInput(e) {
    this.data.topicData.title = e.detail.value
  },

  textInput(e) {
    let index = e.currentTarget.dataset.index

    this.data.topicData.content[index].value = e.detail.value
  },

  submit() {
    if (!this.data.topicData.title.trim()) {
      return wx.showToast({
        title: '标题不能为空',
        icon: 'none'
      })
    }

    if (this.checkIsEmpty()) return

    wx.request({
      url: origin + '/user/topic_add',
      method: 'post',
      data: {
        ...this.data.topicData,
        author_id: this.myData.author_id
      },
      success: res => {
        if (!res.data.success) {
          return wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        console.log(res.data)
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

  uploadImg: function (cb) { // 上传图片到七牛
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
          cb && cb(res.key)
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
  },

  checkIsEmpty() {
    for (let item of this.data.topicData.content) {
      switch (item.type) {
        case 1:
          if (!item.value.trim()) {
            wx.showToast({
              title: '文本内容不能为空',
              icon: 'none'
            })
            return true
          }
          break
        case 2:
          if (!item.value.length) {
            wx.showToast({
              title: '图片内容不能为空',
              icon: 'none'
            })
            return true
          }
          break
        default:
          return false
          break
      }
    }
  },

  pageScrollToBottom: () => {
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  }
})