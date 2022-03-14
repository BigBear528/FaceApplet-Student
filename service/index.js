const BASE_URL = 'http://127.0.0.1:9000'

class DXRequest {
	request(url, method, params) {
		return new Promise((resolve, reject) => {
			wx.request({
				url: BASE_URL + url,
				method: method,
				data: params,
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