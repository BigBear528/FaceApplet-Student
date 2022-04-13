import dxRequest from "../../service/index"

// pages/login/index.js


Page({
  data: {
    sid: "",
    spwd: "",
  },


  onLoad: function (options) {
    // 判断时候有token,如果有token跳转到首页
    let token = ''
    if (wx.getStorageSync('userInfo').length > 0) {
      token = JSON.parse(wx.getStorageSync('userInfo')).token;
    }
    if (token.length > 0) {

      wx.reLaunch({
        url: '/pages/home/index',
      })
    }
  },

  sidInput(e) {
    this.setData({
      sid: e.detail.value
    })
  },

  spwdInput(e) {
    this.setData({
      spwd: e.detail.value
    })
  },

  sLogin() {
    const params = {
      id: this.data.sid,
      password: this.data.spwd
    }

    dxRequest.post('/student/login', params)
      .then(res => {
        // console.log(res)
        if (res.code === '200') {
          wx.setStorageSync("userInfo", JSON.stringify(res.data))
          wx.reLaunch({
            url: '/pages/home/index',
          })
        } else {
          wx.showToast({
            title: res.message, // 标题
            icon: 'error',  // 图标类型，默认success
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
})