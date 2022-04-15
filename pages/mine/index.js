// pages/mine/index.js
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
    console.log(123)
    wx.navigateTo({
      url: '/pages/changeFaceImg/index',
    })
  }
})