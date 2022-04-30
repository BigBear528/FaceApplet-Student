import dxRequest from "../../service/index"

// pages/classItem/index.js
Page({

	data: {
		item: {},
		startTime: '',
		endTime: '',
		isRange: false,
		lat1: '',
		lon1: '',
	},

	onLoad: function (options) {
		const item = JSON.parse(options.item)
		this.setData({ item: item })


		const startTime = this.timestampTransform(this.data.item.startTime)
		const endTime = this.timestampTransform(this.data.item.endTime)

		this.setData({
			startTime,
			endTime
		})


		this.getLocation()
	},

	clock() {
		if (!this.data.isRange) {
			wx.showToast({
				title: "未进入打卡区域",
				icon: 'error'
			})
			return
		} else {

			const item = this.data.item
			wx.navigateTo({
				url: `/pages/FaceRecognition/index?item=${JSON.stringify(item)}`,
			})
		}
	},

	distance() {
		const params = {
			lat1: this.data.lat1,
			lon1: this.data.lon1,
			lat2: this.data.item.lat,
			lon2: this.data.item.lon
		}

		dxRequest.post('/student/distance', params)
			.then(res => {
				if (res.code === '200') {


					this.setData({
						isRange: res.data < this.data.item.radius
					})
				} else {
					wx.showToast({
						title: '系统错误',
						icon: 'error'
					})
				}
			}).catch(err => {
				wx.showToast({
					title: '系统错误',
					icon: 'error'
				})
			})

	},

	getLocation() {
		wx.getLocation({
			type: 'gcj02',
			isHighAccuracy: true,
			success: (res) => {
				this.setData({
					lat1: res.latitude
				})
				this.setData({
					lon1: res.longitude
				})

				this.distance()
			}
		})
	},


	timestampTransform(timestamp) {

		var g = timestamp * 1000; //定义一个时间戳变量
		var d = new Date(g);   //创建一个指定的日期对象
		let time = `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}:${d.getMinutes()}`

		return time;

	}

})