import dxRequest from "../../service/index"

// pages/course/index.js
Page({

	data: {
		courseList: []
	},


	onLoad(options) {
		this.getAllCourse()
	},

	getAllCourse() {
		const id = JSON.parse(wx.getStorageSync('userInfo')).id

		dxRequest.post("/student/getAllCourse", id)
			.then(res => {
				if (res.code === '200') {
					this.setData({ courseList: res.data })
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
	}
})