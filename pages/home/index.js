import dxRequest from "../../service/index"


// pages/home/index.js
Page({


  data: {

  },


  onLoad: function (options) {
    
  },

  test() {
    console.log("点击触发")
    dxRequest.get("/user/queryUserList").then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

})