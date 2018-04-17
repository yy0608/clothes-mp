const appInstance = getApp()
import { origin } from '../../../config.js'

Page({

  data: {
    curSign: 'signup',
    sendCodeDisabled: true // 发送验证码按钮
  },

  onLoad: function (options) {
    this.myData = {}

    if (options.tab === 'signup' || options.tab === 'signin') {
      this.setData({
        curSign: options.tab
      })
    }
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
    let eData = e.detail.value
    let username = eData.username
    let captcha = eData.captcha
    let password = eData.password

    if (!username) {
      return appInstance.showToast({
        text: '手机号必填',
        type: 'error'
      })
    }

    if (isNaN(parseInt(username)) || username.length !== 11 || !(/^1[34578]\d{9}$/.test(username))) {
      return appInstance.showToast({
        text: '手机号不合法',
        type: 'error'
      })
    }

    if (!captcha) {
      return appInstance.showToast({
        text: '验证码必填',
        type: 'error'
      })
    }

    if (!password) {
      return appInstance.showToast({
        text: '密码必填',
        type: 'error'
      })
    }

    let data = {
      username,
      password
    }

    wx.getUserInfo({ // 获取用户信息
      complete: res => {
        if (res.rawData) {
          data.nickname = res.userInfo.nickName
          data.avatar = res.userInfo.avatarUrl
          data.user_info = res.rawData
        }

        wx.request({ // 注册
          url: origin + '/user/register',
          method: 'post',
          data,
          success: res => {
            if (!res.data.success) {
              return wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }

            wx.showToast({
              title: '注册成功，请登录',
              icon: 'none'
            })

            this.setData({
              curSign: 'signin'
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
      }
    })
  },

  signinSubmit(e) {
    console.log(e.detail.value)
    let data = e.detail.value
    let username = data.username
    let captcha = data.captcha
    let password = data.password

    if (!username) {
      return appInstance.showToast({
        text: '手机号必填',
        type: 'error'
      })
    }

    // if (isNaN(parseInt(username)) || !(/^1[34578]\d{9}$/.test(username))) {
    //   return appInstance.showToast({
    //     text: '手机号不合法',
    //     type: 'error'
    //   })
    // }

    if (!password) {
      return appInstance.showToast({
        text: '密码必填',
        type: 'error'
      })
    }

    wx.request({
      url: origin + '/user/login',
      method: 'post',
      data: {
        username,
        password
      },
      success: res => {
        console.log(res.data)
        if (!res.data.success) {
          return appInstance.showToast({
            text: res.data.msg,
            type: 'error'
          })
        }

        appInstance.showToast({
          text: res.data.msg,
          type: 'success'
        })

        appInstance.globalData.userData = res.data.data
        wx.setStorageSync('session_id', res.data.session_id)

        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      },
      fail: err => {
        appInstance.showToast({
          text: '请求出错',
          type: 'error'
        })
      }
    })
  }
})