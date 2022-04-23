import dxRequest from "../../service/index"

// pages/home/index.js
Page({


  data: {
    lat1: '',
    lng1: '',
    lat2: '',
    lng2: '',
    show: false,
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

  addCourse() {
    this.setData({ courseCode: '' })
    this.setData({ show: true })
  },

  onClose() {
    this.setData({ show: false });
  },

  onConfirm() {
    // console.log(this.data.courseCode)
    if (this.data.courseCode == '') {
      wx.showToast({
        title: '请输入课程编号',
        icon: 'error'
      })
    } else {
      const userInfo = JSON.parse(wx.getStorageSync('userInfo'))

      // 根据课程编号获取班级id
      dxRequest.post('/class/getClassIdByCode', this.data.courseCode)
        .then(res => {
          if (res.code === '200') {
            const params = {
              cid: res.data,
              sid: userInfo.id
            }

            // 根据班级id添加课程
            dxRequest.post('/course/addCourse', params)
              .then(res => {
                if (res.code === '200') {
                  if (res.data) {
                    wx.showToast({
                      title: "添加成功",
                    })
                  }

                } else {
                  wx.showToast({
                    title: res.message,
                    icon: 'error'
                  })
                }
              }).catch(err => {
                wx.showToast({
                  title: "系统错误",
                  icon: 'error'
                })
              })



          } else {
            wx.showToast({
              title: res.message,
              icon: 'error'
            })
          }
        }).catch(err => {
          wx.showToast({
            title: "系统错误",
            icon: 'error'
          })
        })
    }



  }


})