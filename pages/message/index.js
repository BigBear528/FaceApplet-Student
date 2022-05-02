import dxRequest from "../../service/index"

// pages/message/index.js
Page({


	data: {
		messageList: []

	},


	onLoad(options) {
		this.getAllMessage()

	},

	getAllMessage() {
		const id = JSON.parse(wx.getStorageSync('userInfo')).id;

		dxRequest.post("/student/getAllMessage", id)
			.then(res => {
				if (res.code === '200') {
					const messageList = res.data
					for (const item of messageList) {
						item.time = this.timestampTransform(item.time)
					}

					this.setData({ messageList: messageList })
				} else {
					wx.showToast({
						title: '系统错误',
						icon: "error"
					})
				}
			})
			.catch(err => {
				wx.showToast({
					title: '系统错误',
					icon: "error"
				})
			})
	},

	timestampTransform(timestamp) {

		var g = timestamp * 1000; //定义一个时间戳变量
		var d = new Date(g);   //创建一个指定的日期对象
		let time = `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}:${d.getMinutes()}`

		return time;

	},

})