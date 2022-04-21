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
    wx.navigateTo({
      url: '/pages/changeFaceImg/index',
    })

    // wx.navigateTo({
    //   url: '/pages/FaceEntry/index',
    // })
  }
})