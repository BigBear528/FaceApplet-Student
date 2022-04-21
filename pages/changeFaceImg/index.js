import dxRequest from "../../service/index"

// pages/changeFaceImg/index.js
Page({
  data: {
    userInfo: {}
  },

  onLoad: function (options) {
    // 从storage中获取userInfo
    let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
    this.setData({
      userInfo: userInfo
    })
  },

  changeFaceImg() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const img = res.tempFilePaths[0]
        let base64Img = ''

        // 将图片转换为base64编码
        wx.getImageInfo({
          src: img,
          success: (imageInfo) => {
            let imgType = imageInfo.type

            wx.getFileSystemManager().readFile({
              filePath: img, //选择图片返回的相对路径
              encoding: "base64", //这个是很重要的
              success: (res) => { //成功的回调
                //返回base64格式
                base64Img = 'data:image/' + imgType + ';base64,' + res.data


                // 发送请求修改头像
                const params = {
                  face: base64Img,
                  id: this.data.userInfo.id
                }


                dxRequest.post('/student/faceUpload', params).
                  then(res => {
                    if (res.code === '200') {
                      if (res.data) {
                        this.data.userInfo.face = base64Img
                        wx.setStorageSync('userInfo', JSON.stringify(this.data.userInfo))

                        wx.reLaunch({
                          url: '/pages/mine/index',
                        })

                        wx.showToast({
                          title: '修改成功',
                        })
                      }
                    } else {
                      wx.showToast({
                        title: '修改失败',
                        icon: "error"
                      })
                    }
                  })
                  .catch(err => {
                    wx.showToast({
                      title: '修改失败',
                      icon: err
                    })
                  })
              },
              fail: err => {
                wx.showToast({
                  title: '上传失败',
                  icon: 'error'
                })
                reject(err)
              }
            })
          }
        })


      }
    })
  }


})