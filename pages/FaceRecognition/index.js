import dxRequest from "../../service/index";

Page({
	data: {
		src: '',
		base64: "",
		baidutoken: "",
		msg: null,
		item: {},
		sidList: [],
		sidListString: '',
		pic: '',
		frame: {
			left: 0,
			top: 0,
			width: 0,
			height: 0,
		},
		windowWidth: 0,
	},

	onLoad: function (options) {
		const item = JSON.parse(options.item)
		this.setData({ item: item })

		if (this.data.item.type == 2) {
			this.getSidList()
		}

		var sysInfo = wx.getSystemInfoSync()
		this.setData({
			windowWidth: sysInfo.windowWidth,
		})


		this.autoCheckPhoto()
		// this.interval = setInterval(this.autoTakePhoto, 1500)
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
						// wx.showToast({
						// 	title: '未捕获到人脸',
						// 	icon: 'error',
						// })
						wx.showModal({
							content: `未捕获到人脸`,
							showCancel: false,
							confirmText: "重试",
							success(res) {
								if (res.confirm) {
									console.log('用户点击确定')
								}
							}
						})
					}

					if (that.data.msg == 'liveness check fail') {
						// wx.showToast({
						// 	title: '活体检测失败',
						// 	icon: 'error',
						// })
						wx.showModal({
							content: `活体检测失败`,
							showCancel: false,
							confirmText: "重试",
							success(res) {
								if (res.confirm) {
									console.log('用户点击确定')
								}
							}
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

							dxRequest.post('/student/faceSuccessMulti', params)
								.then(res => {
									if (res.code === '200') {
										// wx.switchTab({
										// 	url: '/pages/home/index'
										// })

										// wx.showToast({
										// 	title: '打卡成功',
										// })

										wx.showModal({
											// title: '人脸识别成功',
											content: `团体打卡成功`,
											showCancel: false,
											success(res) {
												if (res.confirm) {
													// console.log('用户点击确定')
													wx.switchTab({
														url: '/pages/home/index'
													})
												}
											}
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

						} else {
							// wx.showToast({
							// 	title: '人脸识别失败',
							// 	icon: 'error',
							// })
							wx.showModal({
								title: '人脸识别失败',
								content: `相似度:${res.data.result.user_list[0].score.toFixed(2)}%`,
								showCancel: false,
								confirmText: "重试",
								success(res) {
									if (res.confirm) {
										console.log('用户点击确定')
									}
								}
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
						// wx.showToast({
						// 	title: '未捕获到人脸',
						// 	icon: 'error',
						// })
						wx.showModal({
							content: `未捕获到人脸`,
							showCancel: false,
							confirmText: "重试",
							success(res) {
								if (res.confirm) {
									console.log('用户点击确定')
								}
							}
						})
					}

					if (that.data.msg == 'liveness check fail') {
						// wx.showToast({
						// 	title: '活体检测失败',
						// 	icon: 'error',
						// })
						wx.showModal({
							content: `活体检测失败`,
							showCancel: false,
							confirmText: "重试",
							success(res) {
								if (res.confirm) {
									console.log('用户点击确定')
								}
							}
						})
					}

					if (that.data.msg == 'SUCCESS') {
						if (res.data.result.user_list[0].score > 80) {
							const sid = JSON.parse(wx.getStorageSync('userInfo')).id
							let score = res.data.result.user_list[0].score.toFixed(2)

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
										// wx.switchTab({
										// 	url: '/pages/home/index'
										// })

										// wx.showToast({
										// 	title: '打卡成功',
										// })
										wx.showModal({
											title: '人脸识别成功',
											content: `相似度:${score}%`,
											showCancel: false,
											success(res) {
												if (res.confirm) {
													// console.log('用户点击确定')
													wx.switchTab({
														url: '/pages/home/index'
													})
												}
											}
										})
									} else {
										wx.showToast({
											title: '打卡失败',
											icon: "error"
										})
									}
								})


						} else {
							// wx.showToast({
							// 	title: '人脸识别失败',
							// 	icon: 'error',
							// })
							wx.showModal({
								title: '人脸识别失败',
								content: `相似度:${res.data.result.user_list[0].score.toFixed(2)}%`,
								showCancel: false,
								confirmText: "重试",
								success(res) {
									if (res.confirm) {
										console.log('用户点击确定')
									}
								}
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
	},

	autoCheckPhoto() {
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
				this.autoTakePhoto()
			}
		})
	},

	autoTakePhoto() {
		let that = this;
		var takephonewidth;
		var takephoneheight;
		const ctx = wx.createCameraContext()
		ctx.takePhoto({
			quality: "low",
			success: function (photo) {
				that.data.pic = photo.tempImagePath;
				that.setData({
					pic: that.data.pic
				})
				wx.getImageInfo({
					src: photo.tempImagePath,
					success: function (pic) {
						takephonewidth = pic.width;
						takephoneheight = pic.height;
					}
				})
				wx.getFileSystemManager().readFile({
					filePath: photo.tempImagePath, //选择图片返回的相对路径
					encoding: 'base64', //编码格式
					success: function (base64pic) {
						wx.request({
							url: `https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=` + that.data.baidutoken,
							data: {
								image: base64pic.data,
								image_type: "BASE64",
								max_face_num: 10
							},
							method: 'POST',
							dataType: "json",
							header: {
								'content-type': 'application/json'
							},
							success: function (res) {
								if (res.data.error_code === 0) {
									var ctx = wx.createContext()
									ctx.setStrokeStyle('#31859c')
									ctx.lineWidth = 3
									for (let j = 0; j < res.data.result.face_num; j++) {
										var cavansl = res.data.result.face_list[j].location.left / takephonewidth * that.data.windowWidth
										var cavanst = res.data.result.face_list[j].location.top / takephoneheight * 700
										var cavansw = res.data.result.face_list[j].location.width / takephonewidth * that.data.windowWidth
										var cavansh = res.data.result.face_list[j].location.height / takephoneheight * 700

										ctx.strokeRect(cavansl, cavanst, cavansw, cavansh)
									}
									// that.setData({
									// 	frame: that.data.frame
									// })
									wx.drawCanvas({
										canvasId: 'canvas',
										actions: ctx.getActions()
									})
								}
							}
						})
					}
				})
			}
		})
	},

})
