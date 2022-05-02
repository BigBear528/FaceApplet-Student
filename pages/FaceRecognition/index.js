import dxRequest from "../../service/index";

Page({
	data: {
		src: '',
		base64: "",
		baidutoken: "",
		msg: null,
		item: {},
		sidList: [],
		sidListString: ''
	},

	onLoad: function (options) {

		const item = JSON.parse(options.item)
		this.setData({ item: item })

		console.log(this.data.item)
		if (this.data.item.type == 2) {
			this.getSidList()
		}

	},

	//拍照并编码
	takePhoto() {
		var that = this;
		//拍照
		const ctx = wx.createCameraContext()
		ctx.takePhoto({
			quality: 'high',
			success: (res) => {
				that.setData({
					src: res.tempImagePath
				})
				//图片base64编码
				wx.getFileSystemManager().readFile({
					filePath: that.data.src, //选择图片返回的相对路径
					encoding: 'base64', //编码格式
					success: res => { //成功的回调          
						that.setData({
							base64: res.data
						})
						that.checkPhoto();
					}
				})
			}
		})

		wx.showToast({
			title: '请稍等',
			icon: 'loading',
			duration: 500
		})
	},
	error(e) {
		console.log(e.detail)
	},
	checkPhoto() {
		var that = this;
		//acess_token获取
		wx.request({
			url: 'https://aip.baidubce.com/oauth/2.0/token', //真实的接口地址
			data: {
				grant_type: 'client_credentials',
				client_id: '8TdNaG0QIMSOcpjUSXnTwfEm', //用你创建的应用的API Key
				client_secret: 'yyaroC5dEzgmYjGD5G7lmdflGtfjUYAG' //用你创建的应用的Secret Key
			},
			header: {
				'Content-Type': 'application/json' // 默认值
			},
			success(res) {
				that.setData({
					baidutoken: res.data.access_token //获取到token
				})
				that.validPhoto();
			}
		})
	},

	validPhoto() {
		var that = this;

		const userInfo = JSON.parse(wx.getStorageSync('userInfo'))


		//上传人脸进行 比对
		if (this.data.item.type == 2) {
			wx.request({
				url: 'https://aip.baidubce.com/rest/2.0/face/v3/multi-search?access_token=' + that.data.baidutoken,
				method: 'POST',
				data: {
					image: this.data.base64,
					image_type: 'BASE64',
					group_id_list: 'student', //自己建的用户组id
					liveness_control: 'NORMAL',
					// group_id_list: this.data.sidListString,
					max_user_num: 10,
					max_face_num: 10
				},
				header: {
					'Content-Type': 'application/json' // 默认值
				},
				success: (res) => {
					that.setData({
						// msg: res.data.result.user_list[0].score
						msg: res.data.error_msg
					})

					//做成功判断
					if (that.data.msg == "pic not has face") {
						wx.showToast({
							title: '未捕获到人脸',
							icon: 'error',
						})
					}

					if (that.data.msg == 'liveness check fail') {
						wx.showToast({
							title: '活体检测失败',
							icon: 'error',
						})
					}

					if (that.data.msg == 'SUCCESS') {
						if (res.data.result.face_num > 0) {

							const faceList = res.data.result.face_list


							let timestamp = Date.parse(new Date());
							timestamp = timestamp / 1000;

							const sidList = []

							for (const faceItem of faceList) {
								if (faceItem.user_list[0].score > 80) {
									sidList.push(faceItem.user_list[0].user_id)
								}
							}

							const params = {
								aid: this.data.item.aid,
								sidList: sidList,
								time: timestamp
							}

							// console.log(params)

							dxRequest.post('/student/faceSuccessMulti', params)
								.then(res => {
									if (res.code === '200') {
										wx.switchTab({
											url: '/pages/home/index'
										})

										wx.showToast({
											title: '打卡成功',
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




							// const sid = JSON.parse(wx.getStorageSync('userInfo')).id

							// let timestamp = Date.parse(new Date());
							// timestamp = timestamp / 1000;

							// const params = {
							// 	aid: this.data.item.aid,
							// 	sid: sid,
							// 	time: timestamp
							// }

							// dxRequest.post('/student/faceSuccess', params)
							// 	.then(res => {
							// 		if (res.code === '200' && res.data == true) {
							// 			wx.switchTab({
							// 				url: '/pages/home/index'
							// 			})

							// 			wx.showToast({
							// 				title: '打卡成功',
							// 			})
							// 		} else {
							// 			wx.showToast({
							// 				title: '打卡失败',
							// 				icon: "error"
							// 			})
							// 		}
							// 	})

						} else {
							wx.showToast({
								title: '人脸识别失败',
								icon: 'error',
							})
						}
					}
				}
			});

		} else {
			// 单个人脸识别
			wx.request({
				url: 'https://aip.baidubce.com/rest/2.0/face/v3/search?access_token=' + that.data.baidutoken,
				method: 'POST',
				data: {
					image: this.data.base64,
					image_type: 'BASE64',
					group_id_list: 'student', //自己建的用户组id
					liveness_control: 'NORMAL',
					user_id: userInfo.id,
				},
				header: {
					'Content-Type': 'application/json' // 默认值
				},
				success: (res) => {
					that.setData({
						// msg: res.data.result.user_list[0].score
						msg: res.data.error_msg
					})

					//做成功判断
					if (that.data.msg == "pic not has face") {
						wx.showToast({
							title: '未捕获到人脸',
							icon: 'error',
						})
					}

					if (that.data.msg == 'liveness check fail') {
						wx.showToast({
							title: '活体检测失败',
							icon: 'error',
						})
					}

					if (that.data.msg == 'SUCCESS') {
						if (res.data.result.user_list[0].score > 80) {

							const sid = JSON.parse(wx.getStorageSync('userInfo')).id

							let timestamp = Date.parse(new Date());
							timestamp = timestamp / 1000;

							const params = {
								aid: this.data.item.aid,
								sid: sid,
								time: timestamp
							}

							dxRequest.post('/student/faceSuccess', params)
								.then(res => {
									if (res.code === '200' && res.data == true) {
										wx.switchTab({
											url: '/pages/home/index'
										})

										wx.showToast({
											title: '打卡成功',
										})
									} else {
										wx.showToast({
											title: '打卡失败',
											icon: "error"
										})
									}
								})


						} else {
							wx.showToast({
								title: '人脸识别失败',
								icon: 'error',
							})
						}
					}
				}
			});
		}

	},

	getSidList() {
		dxRequest.post('/student/getSidList', this.data.item.aid)
			.then(res => {

				if (res.code === '200') {
					// console.log(res.data)

					const sidList = res.data
					let sidListString = ''

					sidList.map(item => {
						sidListString = item + ',' + sidListString
					})

					sidListString = sidListString.substr(0, sidListString.length - 1);


					this.setData({
						sidList: sidList,
						sidListString: sidListString
					})

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
	}
})
