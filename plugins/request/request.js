export default class request {
	constructor(options) {
		//请求公共地址
		this.baseUrl = options.baseUrl || "";
		//公共文件上传请求地址
		this.fileUrl = options.fileUrl || "";
		//默认请求头
		this.headers = options.headers || {};
		//默认配置
		this.config = {
			isPrompt: options.isPrompt === false ? false : true,
			load: options.load === false ? false : true,
			isFactory: options.isFactory === false ? false : true,
			loadMore: options.loadMore === false ? false : true
		};
	}
	// 获取默认信息
	getDefault(data, options) {
		//判断url是不是链接
		let urlType = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~/])+$/.test(data.url);
		let config = Object.assign({}, this.config, options, data);
		if (data.method == "FILE") {
			config.url = urlType ? data.url : this.fileUrl + data.url;
		} else {
			config.url = urlType ? data.url : this.baseUrl + data.url;
		}
		//请求头
		config.headers = Object.assign(this.headers, options.headers);
		return config;
	}

	//post请求
	post(url = '', data = {}, options = {}) {
		return this.request({
			method: "POST",
			data: data,
			url: url,
		},options);
	}
	//get请求
	get(url = '', data = {}, options = {}) {
		return this.request({
			method: "GET",
			data: data,
			url: url,
		},options);
	}
	//put请求
	put(url = '', data = {}, options = {}) {
		return this.request({
			method: "PUT",
			data: data,
			url: url,
		},options);
	}
	//delete请求
	delete(url = '', data = {}, options = {}) {
		return this.request({
			method: "DELETE",
			data: data,
			url: url,
		},options);
	}
	//接口请求方法
	request(data, options) {
		let requestInfo = this.getDefault(data, options);
		return new Promise((resolve, reject) => {
			//请求前回调
			if (this.requestStart) {
				let requestStart = this.requestStart(requestInfo);
				if (typeof requestStart == "object") {
					requestInfo.data = requestStart.data;
					requestInfo.headers = requestStart.headers;
					requestInfo.isPrompt = requestStart.isPrompt;
					requestInfo.load = requestStart.load;
					requestInfo.isFactory = requestStart.isFactory;
				} else {
					//请求完成回调
					_this.requestEnd && _this.requestEnd(requestInfo, {
						errMsg: "请求开始拦截器未通过",
						statusCode: 0
					});
					reject({ errMsg: "请求开始拦截器未通过", statusCode: 0 });
					return;
				}
			}
			console.log();
			uni.request({
				url: requestInfo.url,
				data: requestInfo.data,
				method: requestInfo.method, //请求类型
				header: requestInfo.headers, //加入请求头
				success: (res) => {
					//请求完成回调
					this.requestEnd && this.requestEnd(requestInfo, res);
					//是否用外部的数据处理方法
					if (requestInfo.isFactory && this.dataFactory) {
						//数据处理
						this.dataFactory({
							...requestInfo,
							response: res,
							resolve: resolve,
							reject: reject
						});
					} else {
						resolve(res);
					}
				},
				fail: (err) => {
					//请求完成回调
					this.requestEnd && this.requestEnd(requestInfo, err);
					reject(err);
				}
			});
		});
	}
	//jsonp请求(只限于H5使用)
	jsonp(url = '', data = {}, options = {}) {
		let requestInfo = this.getDefault({
			method: "JSONP",
			data: data,
			url: url,
		}, options);
		let dataStr = '';
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&';
		});
		//匹配最后一个&并去除
		if (dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
		}
		requestInfo.url = requestInfo.url + '?' + dataStr;
		const _this = this;
		return new Promise((resolve, reject) => {
			let callbackName = "callback" + Math.ceil(Math.random() * 1000000);
			if (_this.requestStart) {
				requestInfo.data = data;
				let requestStart = _this.requestStart(requestInfo);
				if (typeof requestStart == "object") {
					requestInfo.data = requestStart.data;
					requestInfo.headers = requestStart.headers;
					requestInfo.isPrompt = requestStart.isPrompt;
					requestInfo.load = requestStart.load;
					requestInfo.isFactory = requestStart.isFactory;
				} else {
					//请求完成回调
					_this.requestEnd && _this.requestEnd(requestInfo, {
						errMsg: "请求开始拦截器未通过",
						statusCode: 0
					});
					reject({ errMsg: "请求开始拦截器未通过", statusCode: 0 });
					return;
				}
			}
			window[callbackName] = function(data) {
				resolve(data);
			}
			let script = document.createElement("script");
			script.src = requestInfo.url + "&callback=" + callbackName;
			document.head.appendChild(script);
			// 及时删除，防止加载过多的JS
			document.head.removeChild(script);
			//请求完成回调
			_this.requestEnd && _this.requestEnd(requestInfo, {
				errMsg: "request:ok",
				statusCode: 200
			});
		});
	}
}
