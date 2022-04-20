const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    src: "", //图片的链接
    baidutoken: "",
    base64: "",
    msg: "",

  },

  //拍照
  takePhoto() {
    var that = this;
    //拍照
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath //获取图片
        })
        //图片base64编码
        wx.getFileSystemManager().readFile({
          filePath: this.data.src, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            this.setData({
              base64: res.data
            })
          }
        })

        this.getBaiduToken();
      } //拍照成功结束
    }) //调用相机结束


    //失败尝试
    wx.showToast({
      title: '请重试',
      icon: 'loading',
      duration: 500
    })
  },

  error(e) {
    console.log(e.detail)
  },

  getBaiduToken() {
    var that = this;
    //acess_token获取,qs:需要多次尝试
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token', //是真实的接口地址
      data: {
        grant_type: 'client_credentials',
        client_id: '8TdNaG0QIMSOcpjUSXnTwfEm', //用你创建的应用的API Key
        client_secret: 'yyaroC5dEzgmYjGD5G7lmdflGtfjUYAG' //用你创建的应用的Secret Key
      },
      header: {
        'Content-Type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          baidutoken: res.data.access_token //获取到token
        })
        that.uploadPhoto();
      }
    })
  },

  uploadPhoto() {
    const userInfo = JSON.parse(wx.getStorageSync('userInfo'));


    console.log(this.data.userId)

    var that = this;
    //上传人脸进行注册-----test
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/add?access_token=' + this.data.baidutoken,
      method: 'POST',
      data: {
        image: this.data.base64,
        image_type: 'BASE64',
        group_id: 'student', //自己建的用户组id
        user_id: userInfo.id //这里获取用户昵称
      },
      header: {
        'Content-Type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          msg: res.data.error_msg
        })
        //做成功判断
        if (that.data.msg == "pic not has face") {
          wx.showToast({
            title: '未捕获到人脸',
            icon: 'error',
          })
        }
        if (that.data.msg == 'SUCCESS') {
          wx.showToast({
            title: '人脸录入成功',
            icon: 'success',
          })
        }
      }
    })
  },
})