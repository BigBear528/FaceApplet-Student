import dxRequest from "../../service/index"

// pages/login/index.js
Page({
  data: {
    sid: "",
    spwd: "",
    tid: "",
    tpwd: ""
  },


  onLoad: function (options) {

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

  tidInput(e) {
    this.setData({
      tid: e.detail.value
    })
  },

  tpwdInput(e) {
    this.setData({
      tpwd: e.detail.value
    })
  },

  sLogin() {
    console.log(this.data.sid, this.data.spwd)
    const params = {
      id: this.data.sid,
      password: this.data.spwd
    }

    dxRequest.post('/student/login', params)
      .then(res => {
        // console.log(res)
        if (res.code === '200') {
          console.log("登录成功")
          wx.setStorageSync("userInfo", JSON.stringify(res.data))
        } else {
          console.log(res.message)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
})