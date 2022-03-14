import { test } from "../../service/test"

// pages/home/index.js
Page({

 
  data: {

  },

  
  onLoad: function (options) {
    test().then(res=>{
      console.log(res)
    }).catch(err=>{
      console.log(err)
    })
  },
  
})