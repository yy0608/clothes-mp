import { origin, imgOrigin } from '../../../config.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationStatus: -1, // -1为逻辑处理前，0为第一次进来，1为获取到位置信息，2为未开启gps，3为拒绝授权
    toggeryData: [],
    getListSuccess: false,
    imgOrigin,
    qiniuQuery: '?imageView2/2/w/160/h/160'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //
  },

  onShow: function () {
    this.checkSetting()
  },

  checkSetting() {
    wx.getSetting({
      success: res => {
        let settingObj = res.authSetting
        let settingArr = Object.keys(settingObj)
        if (!settingArr.length) { // 没有任何设置信息，基本为第一次访问
          this.setData({
            locationStatus: 0
          })
        } else if (settingObj['scope.userLocation']) { // 已经允许获取位置信息
          wx.getLocation({ // 获取到位置信息，进入正常逻辑
            success: res => {
              // console.log(res)
              this.setData({
                locationStatus: 1
              })
              let location = {
                latitude: res.latitude,
                longitude: res.longitude
              }
              this.getNearbyStoreList(location)
              // this.locationToAddress(location)
              // this.setMapData(location)
            },
            fail: err => { // 基本判定为没有打开gps
              console.log(err)
              this.setData({
                locationStatus: 2
              })
            }
          })
        } else { // 之前拒绝获取位置信息
          this.setData({
            locationStatus: 3
          })
        }
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  getLocation() {
    wx.getLocation({
      success: res => {
        // console.log(res)
        let location = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        // this.locationToAddress(location)
        // this.setMapData(location)
      },
      fail: err => {
        if (err.errMsg === 'getLocation:fail auth deny') {
          this.setData({
            locationStatus: 3
          })
        } else if (err.errMsg === 'getLocation:fail 1') {
          this.setData({
            locationStatus: 2
          })
        }
      }
    })
  },

  openSetting() {
    wx.openSetting({
      success: res => {
        // console.log(res.authSetting)
        if (res.authSetting['scope.userLocation']) {
          this.data.locationStatus = 2
        } else {
          this.data.locationStatus = 3
        }
        this.setData({
          locationStatus: this.data.locationStatus
        })
      },
      fail: err => {
        appInstance.showToast({
          text: err.errMsg,
          type: 'error'
        })
      }
    })
  },

  getNearbyStoreList(location) {
    if (this.data.getListSuccess) return
    wx.request({
      url: origin + '/employ/merchant_shops',
      method: 'get',
      success: res => {
        if (!res.data.success) {
          return wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        this.setData({
          toggeryData: res.data.data,
          getListSuccess: true
        })
        console.log(res.data.data)
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