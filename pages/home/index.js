import dxRequest from "../../service/index"

// pages/home/index.js
Page({


  data: {
    lat1: '',
    lng1: '',
    lat2: '',
    lng2: '',

    courseCode: ''
  },

  onLoad: function (options) {

  },

  test() {

    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        console.log('纬度1 ' + res.latitude)
        console.log('经度1 ' + res.longitude)
        this.setData({
          lat1: res.latitude
        })
        this.setData({
          lng1: res.longitude
        })
      }
    })
  },

  test2() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        console.log('纬度2 ' + res.latitude)
        console.log('经度2 ' + res.longitude)
        this.setData({
          lat2: res.latitude
        })
        this.setData({
          lng2: res.longitude
        })
      }
    })
  },

  btn() {
    const params = {
      lat1: this.data.lat1,
      lat2: this.data.lat2,
      lon1: this.data.lng1,
      lon2: this.data.lng2
    }
    dxRequest.post('/student/distance', params)
      .then(res => {
        if (res.code === "200") {
          console.log(res.data)
        } else {
          console.log('error')
        }
      }).catch(err => {
        console.log(err)
      })
  },

  Face() {
    wx.navigateTo({
      url: '/pages/FaceRecognition/index',
    })
  },



})