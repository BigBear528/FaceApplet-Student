import dxRequest from "../../service/index"

// pages/home/index.js
Page({


	data: {
		lat1: '',
		lng1: '',
		lat2: '',
		lng2: '',

		courseCode: '',

		attendanceList: [],

		currentList: [],
		completedList: [],
		expiredList: [],



		currentTab: 0,
		winWidth: 0,
		winHeight: 0
	},

	onLoad: function (options) {

		var page = this;
		wx.getSystemInfo({
			success: function (res) {
				console.log(res);
				page.setData({ winWidth: res.windowWidth });
				page.setData({ winHeight: res.windowHeight });
			},
		})

	},

	onShow() {
		this.getAttendanceById()
		this.getExpiredList()
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

	getAttendanceById() {

		const id = JSON.parse(wx.getStorageSync('userInfo')).id

		dxRequest.post('/student/getAttendanceById', id)
			.then(res => {
				if (res.code === '200') {

					let timestamp = Date.parse(new Date());
					timestamp = timestamp / 1000;
					const currentList = []
					const expiredList = []

					for (const item of res.data) {
						if (item.endTime > timestamp) {
							currentList.push(item)
						} else {
							expiredList.push(item)
						}
					}

					this.setData({ currentList: currentList })
					this.setData({ expiredList: expiredList })

				} else {
					wx.showToast({
						title: '系统错误',
						icon: "error"
					})
				}

			}).catch(err => {
				wx.showToast({
					title: '系统错误',
					icon: "error"
				})
			})

	},

	getExpiredList() {

		const id = JSON.parse(wx.getStorageSync('userInfo')).id

		dxRequest.post('/student/getExpiredList', id)
			.then(res => {
				if (res.code === '200') {
					this.setData({ completedList: res.data })

				} else {
					wx.showToast({
						title: '系统错误',
						icon: "error"
					})
				}

			}).catch(err => {
				wx.showToast({
					title: '系统错误',
					icon: "error"
				})
			})

	},

	itemClick(event) {
		const item = event.currentTarget.dataset.item
		wx.navigateTo({
			url: `/pages/classItem/index?item=${JSON.stringify(item)}`
		})

	},

	switchNav: function (e) {
		var page = this;
		if (this.data.currentTab == e.target.dataset.current) {
			return false;
		}
		else {
			page.setData({ currentTab: e.target.dataset.current });
		}
	},

	bindChange: function (e) {
		var that = this;
		that.setData({
			currentTab: e.detail.current
		});
	},




})