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
  }
})