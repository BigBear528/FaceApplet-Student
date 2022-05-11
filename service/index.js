// const BASE_URL = 'http://192.168.31.247:9000'
// const BASE_URL = 'http://192.168.31.183:9000'
const BASE_URL = 'http://47.109.34.96:9000'


class DXRequest {
	request(url, method, params) {
		let token = ''
		if (wx.getStorageSync('userInfo').length > 0) {
			token = JSON.parse(wx.getStorageSync('userInfo')).token;
		}
		return new Promise((resolve, reject) => {
			wx.request({
				url: BASE_URL + url,
				method: method,
				data: params,
				header: {
					token: token
				},
				success: function (res) {
					if (res.data.code === '401') {
						wx.removeStorageSync('userInfo')

						wx.reLaunch({
							url: '/pages/login/index',
						})
						wx.showToast({
							title: '请重新登录', // 标题
							icon: 'error', // 图标类型，默认success
							duration: 1500 // 提示窗停留时间，默认1500ms
						})
					} else {
						resolve(res.data)
					}

				},
				fail: function (err) {
					reject(err)
				}
			})
		})
	}

	get(url, params) {
		return this.request(url, 'GET', params)
	}

	post(url, params) {
		return this.request(url, 'POST', params)
	}
}

const dxRequest = new DXRequest()
export default dxRequest