import dxRequest from "../service/index";

var app = getApp()
Component({
	data: {
		selected: 0,
		color: "#ccc",
		selectedColor: "#1296db",
		list: [{
			pagePath: "/pages/home/index",
			iconPath: "../assets/images/tabbar/home_normal.png",
			text: "首页",
			selectedIconPath: "../assets/images/tabbar/home_active.png",
			id: 0
		},
		{
			// pagePath: "/pages/FaceEntry/index",
			text: "+",
			id: 1
		},
		{
			pagePath: "/pages/mine/index",
			iconPath: "../assets/images/tabbar/mine_normal.png",
			text: "我的",
			selectedIconPath: "../assets/images/tabbar/mine_active.png",
			id: 2
		}
		]
	},
	ready: function () {
		this.setData({
			selected: app.globalData.selected
		})
	},
	methods: {
		switchTab(e) {
			const data = e.currentTarget.dataset;
			const url = data.path;
			app.globalData.selected = data.index;
			if (data.index === 1) {
				// wx.navigateTo({
				// 	url: '/pages/FaceEntry/index'
				// })
				wx.showModal({
					title: '添加课程',
					// content: '这是一个模态弹窗',
					editable: true,
					placeholderText: "请输入课程编号",
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定', res)
							this.onConfirm(res.content)
						} else if (res.cancel) {
							console.log('用户点击取消', res)
						}
					}
				})

			} else {
				wx.switchTab({
					url: url
				})
			}
		},

		onConfirm(code) {
			if (code == '') {
				wx.showToast({
					title: '请输入课程编号',
					icon: 'error'
				})
			} else {
				const userInfo = JSON.parse(wx.getStorageSync('userInfo'))

				// 根据课程编号获取班级id
				dxRequest.post('/class/getClassIdByCode', code)
					.then(res => {
						if (res.code === '200') {
							const params = {
								cid: res.data,
								sid: userInfo.id
							}

							// 根据班级id添加课程
							dxRequest.post('/course/addCourse', params)
								.then(res => {
									if (res.code === '200') {
										if (res.data) {
											wx.showToast({
												title: "添加成功",
											})
										}
									} else {
										wx.showToast({
											title: res.message,
											icon: 'error'
										})
									}
								}).catch(err => {
									wx.showToast({
										title: "系统错误",
										icon: 'error'
									})
								})
						} else {
							wx.showToast({
								title: res.message,
								icon: 'error'
							})
						}
					}).catch(err => {
						wx.showToast({
							title: "系统错误",
							icon: 'error'
						})
					})
			}
		}
	}
})