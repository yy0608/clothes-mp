const appInstance = getApp()
import { origin } from '../../../config.js'

Page({

  data: {
    curSign: 'signup',
    sendCodeDisabled: true // 发送验证码按钮
  },

  onLoad: function (options) {
    this.myData = {}
  },

  toggleSign(e) {
    var name = e.currentTarget.dataset.name

    this.setData({
      curSign: name
    })
  },

  signupUsernameInput (e) {
    let username = e.detail.value
    let signupUsername = parseInt(username)
    if (!isNaN(signupUsername) && username.length === 11) {
      this.setData({
        sendCodeDisabled: false
      })
    } else {
      this.setData({
        sendCodeDisabled: true
      })
    }
  },

  signupUsernameBlur(e) {
    this.myData.signupUsername = e.detail.value
  },

  sendCode(e) {
    console.log(this.myData.signupUsername)
  },

  signupSubmit(e) {
    console.log(e.detail.value)
    let data = e.detail.value
    let username = data.username
    let captcha = data.captcha
    let password = data.password

    if (isNaN(parseInt(username)) || username.length !== 11 || !(/^1[34578]\d{9}$/.test(username))) {
      return appInstance.showToast({
        text: '用户名不合法',
        type: 'error'
      })
    }

    if (!captcha || captcha.length < 6) {
      return appInstance.showToast({
        text: '验证码不合法',
        type: 'error'
      })
    }

    if (!password) {
      return appInstance.showToast({
        text: '密码必填',
        type: 'error'
      })
    }

    wx.request({
      url: origin + '/user/register',
      method: 'post',
      data: {
        username,
        password
      },
      success: res => {
        console.log(res.data)
      }
    })
  },

  signinSubmit(e) {
    console.log(e.detail.value)
  }
})