const BASE_URL = 'http://127.0.0.1:9000'

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
					resolve(res.data)
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