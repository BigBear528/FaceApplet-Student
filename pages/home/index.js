import dxRequest from "../../service/index"

// pages/home/index.js
Page({


  data: {
    lat1: '',
    lng1: '',
    lat2: '',
    lng2: ''
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
  }

  // getDistance(lat1, lng1, lat2, lng2) {
  //   lat1 = lat1 || 0;
  //   lng1 = lng1 || 0;
  //   lat2 = lat2 || 0;
  //   lng2 = lng2 || 0;

  //   var rad1 = lat1 * Math.PI / 180.0;
  //   var rad2 = lat2 * Math.PI / 180.0;
  //   var a = rad1 - rad2;
  //   var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  //   var r = 6378137;
  //   var distance = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)));

  //   return distance;
  // }

  // rad(d) {
  //   return d * Math.PI / 180.0;
  // },


  // // 根据经纬度计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
  // getDistances(lat1, lng1, lat2, lng2) {

  //   var radLat1 = this.rad(lat1);
  //   var radLat2 = this.rad(lat2);
  //   var a = radLat1 - radLat2;
  //   var b = this.rad(lng1) - this.rad(lng2);
  //   var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
  //     Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  //   s = s * 6378.137; // EARTH_RADIUS;
  //   // 输出为公里
  //   s = Math.round(s * 10000) / 10000;

  //   var distance = s;
  //   var distance_str = "";

  //   if (parseInt(distance) >= 1) {
  //     // distance_str = distance.toFixed(1) + "km";
  //     distance_str = distance.toFixed(2) + "km";
  //   } else {
  //     // distance_str = distance * 1000 + "m";
  //     distance_str = (distance * 1000).toFixed(2) + "m";
  //   }

  //   //s=s.toFixed(4);

  //   // console.info('距离是', s);
  //   // console.info('距离是', distance_str);
  //   // return s;

  //   //小小修改，这里返回对象
  //   let objData = {
  //     distance: distance,
  //     distance_str: distance_str
  //   }
  //   return objData
  // }


})