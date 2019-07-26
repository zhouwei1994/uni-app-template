const qiniuUploader = require("./qiniuUploader");
export default class request {
	constructor(options) {
		//请求公共地址
		this.baseUrl = options.baseUrl || "";
		//公共文件上传请求地址
		this.fileUrl = options.fileUrl || "";
		//默认请求头
		this.headers = options.headers || {};
		//默认配置
		//是否提示--默认提示
		this.isPrompt = options.isPrompt || true;
		//是否显示请求动画
		this.load = options.load || true;
		//是否使用处理数据模板
		this.isFactory = options.isFactory || true;
		//列表接口是否有加载判断
		this.loadMore = options.loadMore || true;
	}
	//上传图片命名
	randomChar(l, url = "") {
		const x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
		var tmp = "";
		var time = new Date();
		for (var i = 0; i < l; i++) {
			tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
		}
		return (
			"file/" +
			url +
			time.getTime() +
			tmp
		);
	}
	//post请求
	post(url = '', data = {}, options = {}) {
		let requestInfo = this.getDefault(url, options, "data");
		requestInfo.data = data;
		return new Promise((resolve, reject) => {
			this.getRequest("POST", requestInfo, (state, response) => {
				//是否用外部的数据处理方法
				if (state && requestInfo.isFactory && this.dataFactory) {
					//数据处理
					var factoryInfo = this.dataFactory(requestInfo, response);
					factoryInfo.success ? resolve(factoryInfo.result) : reject(factoryInfo.result);
				} else {
					state ? resolve(response) : reject(response);
				}
			});
		});
	}
	//get请求
	get(url = '', data = {}, options = {}) {
		let requestInfo = this.getDefault(url, options, "data");
		requestInfo.data = data;
		return new Promise((resolve, reject) => {
			this.getRequest("GET", requestInfo, (state, response) => {
				//是否用外部的数据处理方法
				if (state && requestInfo.isFactory && this.dataFactory) {
					//数据处理
					var factoryInfo = this.dataFactory(requestInfo, response);
					factoryInfo.success ? resolve(factoryInfo.result) : reject(factoryInfo.result);
				} else {
					state ? resolve(response) : reject(response);
				}
			});
		});
	}
	jsonpGet(url = '', data = {}, options = {}) {
		let requestInfo = this.getDefault(url, options, "data");
		let dataStr = '';
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&';
		});
		//匹配最后一个&并去除
		if (dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
		}
		requestInfo.httpUrl = requestInfo.httpUrl + '?' + dataStr;
		const _this = this;
		return new Promise((resolve, reject) => {
			if (_this.requestStart) {
				requestInfo.data = data;
				var requestStart = _this.requestStart(requestInfo);
				if (typeof requestStart == "object") {
					requestInfo.data = requestStart.data;
					requestInfo.headers = requestStart.headers;
					requestInfo.isPrompt = requestStart.isPrompt;
					requestInfo.load = requestStart.load;
					requestInfo.isFactory = requestStart.isFactory;
				}
			}
			window.jsonpCallback = function (data) {
				_this.requestEnd && _this.requestEnd(requestInfo, data);
				resolve(data);
			}
			var script = document.createElement("script");
			script.src = requestInfo.httpUrl + "&callback=jsonpCallback";
			document.head.appendChild(script);
			// 及时删除，防止加载过多的JS
			document.head.removeChild(script);
		});
	}
	//七牛云文件上传
	qn(options = {}, callback) {
		const _this = this;
		return new Promise((resolve, reject) => {
			uni.chooseImage({
				count: options.count || 9, //默认9
				sizeType: options.sizeType || ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: options.sourceType || ['album', 'camera'], //从相册选择
				success: function (res) {
					var filePathList = res.tempFilePaths;
					var len = filePathList.length;
					var imageList = new Array;
					_this.get("api/open/v1/qn_upload").then(data => {
						uploadFile(0);
						function uploadFile(i) {
							// 交给七牛上传
							qiniuUploader.upload(filePathList[i], (res) => {
								imageList.push(res.imageURL);
								callback && callback(res.imageURL);
								if (len - 1 > i) {
									uploadFile(i + 1);
								} else {
									resolve(imageList);
								}
							}, (error) => {
								console.log('error: ' + error);
								reject(error)
							}, {
									region: 'SCN', //地区
									domain: data.visitPrefix, // // bucket 域名，下载资源时用到。
									key: _this.randomChar(8, data.folderPath),
									uptoken: data.token, // 由其他程序生成七牛 uptoken
									uptokenURL: 'UpTokenURL.com/uptoken' // 上传地址
								}, (res) => {
									console.log('上传进度', res.progress)
									// console.log('已经上传的数据长度', res.totalBytesSent)
									// console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
								});
						}
					});
				}
			});
		});
	}
	//文件上传
	urlFile(url = '', data = {}, options = {}) {
		let requestInfo = this.getDefault(url, options, "file");
		requestInfo.data = data;
		const _this = this;
		return new Promise((resolve, reject) => {
			uni.chooseImage({
				count: data.count || 9, //默认9
				sizeType: data.sizeType || ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: data.sourceType || ['album', 'camera'], //从相册选择
				success: function (res) {
					_this.getFileUpload(requestInfo, res.tempFiles, (state, response) => {
						state ? resolve(response) : reject(response);
					});
				}
			});
		});
	}
	// 获取默认信息
	getDefault(url, options, type) {
		//判断url是不是链接
		var urlType = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~/])+$/.test(url);
		let httpUrl;
		if (type == "file") {
			httpUrl = urlType ? url : this.fileUrl + url;
		} else {
			httpUrl = urlType ? url : this.baseUrl + url;
		}
		let config = Object.assign({
			isPrompt: this.isPrompt,
			load: this.load,
			isFactory: this.isFactory,
			loadMore: this.loadMore
		}, options);
		//请求地址
		config.httpUrl = httpUrl;
		//请求头
		config.headers = Object.assign(this.headers, options.headers);
		return config;
	}
	//接口请求方法
	getRequest(ajaxType, options, callback) {
		//请求前回调
		if (this.requestStart) {
			options.method = ajaxType;
			var requestStart = this.requestStart(options);
			if (typeof requestStart == "object") {
				options.data = requestStart.data;
				options.headers = requestStart.headers;
				options.isPrompt = requestStart.isPrompt;
				options.load = requestStart.load;
				options.isFactory = requestStart.isFactory;
			}
		}
		uni.request({
			url: options.httpUrl,
			data: options.data,
			method: ajaxType, //请求类型
			header: options.headers, //加入请求头
			success: (res) => {
				//请求完成回调
				this.requestEnd && this.requestEnd(options, res);
				callback(true, res);
			},
			fail: (err) => {
				//请求完成回调
				this.requestEnd && this.requestEnd(options, err);
				callback(false, err);
			}
		});
	}
	//文件上传请求方法
	// 	data = {
	// 		name:"后台接受文件key名称",
	//		data:"而外参数"
	// 	}
	getFileUpload(options, files, callback) {
		const _this = this;
		//请求前回调
		if (this.requestStart) {
			options.method = "FILE";
			var requestStart = this.requestStart(options);
			if (typeof requestStart == "object") {
				if (typeof requestStart == "object") {
					options.data = requestStart.data;
					options.headers = requestStart.headers;
					options.isPrompt = requestStart.isPrompt;
					options.load = requestStart.load;
					options.isFactory = requestStart.isFactory;
				}
			}
		}
		const len = files.length - 1;
		let fileList = new Array;
		fileUpload(0);

		function fileUpload(i) {
			var config = {
				url: options.httpUrl,
				filePath: files[i].path,
				header: options.headers, //加入请求头
				name: options.name || "file",
				success: (response) => {
					response.data = JSON.parse(response.data);
					//请求完成回调
					_this.requestEnd && _this.requestEnd(options, response);
					//是否用外部的数据处理方法
					if (options.isFactory && _this.dataFactory) {
						//数据处理
						var factoryInfo = _this.dataFactory(options, response);
						console.log(factoryInfo);
						if (factoryInfo.success) {
							fileList.push(factoryInfo.result);
							if (len <= i) {
								callback(true, fileList);
							} else {
								fileUpload(i + 1);
							}
						} else {
							console.log("进入了这里");
							callback(false, factoryInfo.result);
						}
					} else {
						fileList.push(response.data);
						if (len <= i) {
							callback(true, fileList);
						} else {
							fileUpload(i + 1);
						}
					}
				},
				fail: (err) => {
					//请求完成回调
					_this.requestEnd && _this.requestEnd(options, err);
					callback(false, err);
				}
			};
			if (options.data) {
				config.formData = options.data;
			}
			uni.uploadFile(config);
		}
	}
}
