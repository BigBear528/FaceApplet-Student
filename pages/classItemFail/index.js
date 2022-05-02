import dxRequest from "../../service/index"

// pages/classItem/index.js
Page({

	data: {
		item: {},
		startTime: '',
		endTime: '',
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
	},


	timestampTransform(timestamp) {

		var g = timestamp * 1000; //定义一个时间戳变量
		var d = new Date(g);   //创建一个指定的日期对象
		let time = `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}:${d.getMinutes()}`

		return time;

	},
})