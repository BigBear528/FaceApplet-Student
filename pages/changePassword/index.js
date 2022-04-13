import dxRequest from "../../service/index"

// pages/changePassword/index.js
Page({
	data: {
		currentPassword: "",
		newPassword: "",
		confirmPassword: ""
	},


	onLoad: function (options) {

	},


	changePassword() {
		if (this.data.currentPassword == '' || this.data.newPassword == '' || this.data.confirmPassword == '') {
			wx.showToast({
				title: '请输入密码',
				icon: 'error'
			})
			return
		}


		if (this.data.newPassword !== this.data.confirmPassword) {
			wx.showToast({
				title: '密码输入不一致',
				icon: 'error'
			})
			return
		}

		const userInfo = JSON.parse(wx.getStorageSync('userInfo'))

		const params = {
			currentPassword: this.data.currentPassword,
			id: userInfo.id,
			newPassword: this.data.newPassword
		}

		dxRequest.post('/student/changePassword', params)
			.then(res => {
				if (res.code === '200') {

					wx.removeStorageSync('userInfo')

					wx.reLaunch({
						url: '/pages/login/index',
					})

					wx.showToast({
						title: "修改成功",
					})


				} else {
					wx.showToast({
						title: res.message,
						icon: "error"
					})
				}
			})
			.catch(err => {
				wx.showToast({
					title: err,
					icon: "error"
				})
			})


	}

})