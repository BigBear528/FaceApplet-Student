// pages/mine/index.js

var app = getApp()
Page({

  data: {
    userInfo: {}
  },

  onLoad: function (options) {
    this.init()

  },

  init() {
    // 从storage中获取userInfo
    let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    this.setData({
      userInfo: userInfo
    })

  },

  logout() {
    wx.removeStorageSync('userInfo')
    app.globalData.selected = 0
    wx.reLaunch({
      url: '/pages/login/index',
    })
  },

  changePassword() {
    wx.navigateTo({
      url: '/pages/changePassword/index',
    })
  },

  changeFaceImg() {
    wx.navigateTo({
      url: '/pages/changeFaceImg/index',
    })

    // wx.navigateTo({
    //   url: '/pages/FaceEntry/index',
    // })
  }
})