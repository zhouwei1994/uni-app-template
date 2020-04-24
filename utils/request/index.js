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
		this.config = {
			isPrompt: options.isPrompt === false ? false : true,
			load: options.load === false ? false : true,
			isFactory: options.isFactory === false ? false : true,
			loadMore: options.loadMore === false ? false : true
		};
	}
	// 获取默认信息
	getDefault(url, options, type) {
		//判断url是不是链接
		let urlType = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~/])+$/.test(url);
		let httpUrl;
		if (type == "file") {
			httpUrl = urlType ? url : this.fileUrl + url;
		} else {
			httpUrl = urlType ? url : this.baseUrl + url;
		}
		let config = Object.assign({}, this.config, options);
		//请求地址
		config.httpUrl = httpUrl;
		//请求头
		config.headers = Object.assign(this.headers, options.headers);
		return config;
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
					this.dataFactory({
						...requestInfo,
						response: response,
						resolve: resolve,
						reject: reject
					});
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
					this.dataFactory({
						...requestInfo,
						response: response,
						resolve: resolve,
						reject: reject
					});
				} else {
					state ? resolve(response) : reject(response);
				}
			});
		});
	}
	//put请求
	put(url = '', data = {}, options = {}) {
		let requestInfo = this.getDefault(url, options, "data");
		requestInfo.data = data;
		return new Promise((resolve, reject) => {
			this.getRequest("PUT", requestInfo, (state, response) => {
				//是否用外部的数据处理方法
				if (state && requestInfo.isFactory && this.dataFactory) {
					//数据处理
					this.dataFactory({
						...requestInfo,
						response: response,
						resolve: resolve,
						reject: reject
					});
				} else {
					state ? resolve(response) : reject(response);
				}
			});
		});
	}
	//delete请求
	delete(url = '', data = {}, options = {}) {
		let requestInfo = this.getDefault(url, options, "data");
		requestInfo.data = data;
		return new Promise((resolve, reject) => {
			this.getRequest("DELETE", requestInfo, (state, response) => {
				//是否用外部的数据处理方法
				if (state && requestInfo.isFactory && this.dataFactory) {
					//数据处理
					this.dataFactory({
						...requestInfo,
						response: response,
						resolve: resolve,
						reject: reject
					});
				} else {
					state ? resolve(response) : reject(response);
				}
			});
		});
	}

	//接口请求方法
	getRequest(ajaxType, options, callback) {
		//请求前回调
		if (this.requestStart) {
			options.method = ajaxType;
			let requestStart = this.requestStart(options);
			if (typeof requestStart == "object") {
				options.data = requestStart.data;
				options.headers = requestStart.headers;
				options.isPrompt = requestStart.isPrompt;
				options.load = requestStart.load;
				options.isFactory = requestStart.isFactory;
			} else {
				callback(false, "请求开始拦截器未通过");
				return;
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
	//jsonp请求(只限于H5使用)
	jsonp(url = '', data = {}, options = {}) {
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
					reject("请求开始拦截器未通过");
					return;
				}
			}
			window[callbackName] = function(data) {
				resolve(data);
			}
			let script = document.createElement("script");
			script.src = requestInfo.httpUrl + "&callback=" + callbackName;
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
	//七牛云上传图片
	qnImgUpload(data = {}, options = {}) {
		const _this = this;
		return new Promise((resolve, reject) => {
			uni.chooseImage({
				count: data.count || 9, //默认9
				sizeType: data.sizeType || ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: data.sourceType || ['album', 'camera'], //从相册选择
				success: function(res) {
					_this.qnFileUpload({
						files: res.tempFiles,
						...data
					}, options).then(resolve, reject);
				}
			});
		});
	}
	//七牛云上传文件命名
	randomChar(l, url = "") {
		const x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
		let tmp = "";
		let time = new Date();
		for (let i = 0; i < l; i++) {
			tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
		}
		return (
			"file/" +
			url +
			time.getTime() +
			tmp
		);
	}
	//七牛云文件上传（支持多张上传）
	qnFileUpload(data = {}, options = {}) {
		const _this = this;
		let requestInfo = {
			...data, 
			...this.config, 
			...options,
			method: "FILE"
		};
		return new Promise((resolve, reject) => {
			//请求前回调
			if (_this.requestStart) {
				let requestStart = _this.requestStart(requestInfo);
				if (typeof requestStart == "object") {
					requestInfo.load = requestStart.load;
					requestInfo.files = requestStart.files;
				} else {
					//请求完成回调
					_this.requestEnd && _this.requestEnd(requestInfo, {
						errMsg: "请求开始拦截器未通过",
						statusCode: 0
					});
					reject({
						errMsg: "请求开始拦截器未通过",
						statusCode: 0
					});
					return;
				}
			}
			if (Array.isArray(requestInfo.files)) {
				let len = requestInfo.files.length;
				let imageList = new Array;
				//该地址需要开发者自行配置（每个后台的接口风格都不一样）
				_this.get("api/kemean/aid/qn_upload").then(data => {
					/*
					 *接口返回参数：
					 *visitPrefix:访问文件的域名
					 *token:七牛云上传token
					 *folderPath:上传的文件夹
					 */
					uploadFile(0);

					function uploadFile(i) {
						let fileData = {
							fileIndex: i,
							files: requestInfo.files,
							size: requestInfo.files[i].size
						};
						// #ifdef H5
						fileData.name = requestInfo.files[i].name;
						fileData.type = requestInfo.files[i].type;
						// #endif
						// 交给七牛上传
						qiniuUploader.upload(requestInfo.files[i].path, (res) => {
							fileData.url = res.imageURL;
							requestInfo.eachUpdate && requestInfo.eachUpdate({
								url: res.imageURL,
								...fileData
							});
							imageList.push(res.imageURL);
							if (len - 1 > i) {
								uploadFile(i + 1);
							} else {
								//请求完成回调
								_this.requestEnd && _this.requestEnd(requestInfo, {
									errMsg: "request:ok",
									statusCode: 200,
									data: imageList
								});
								resolve(imageList);
							}
						}, (error) => {
							console.log('error: ' + error);
							//请求完成回调
							_this.requestEnd && _this.requestEnd(requestInfo, error);
							reject(error)
						}, {
							region: 'SCN', //地区
							domain: data.visitPrefix, // bucket 域名，下载资源时用到。
							key: _this.randomChar(8, data.folderPath),
							uptoken: data.token, // 由其他程序生成七牛 uptoken
							uptokenURL: 'UpTokenURL.com/uptoken' // 上传地址
						}, (res) => {
							requestInfo.progressUpdate && requestInfo.progressUpdate(Object.assign({}, fileData, res));
							// console.log('上传进度', res.progress)
							// console.log('已经上传的数据长度', res.totalBytesSent)
							// console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
						});
					}
				});
			} else {
				//请求完成回调
				_this.requestEnd && _this.requestEnd(requestInfo, {
					errMsg: "files 必须是数组类型",
					statusCode: 0
				});
				reject({
					errMsg: "files 必须是数组类型",
					statusCode: 0
				});
			};
		});

	}
	//本地服务器图片上传
	urlImgUpload(url = '', data = {}, options = {}) {
		const _this = this;
		return new Promise((resolve, reject) => {
			uni.chooseImage({
				count: data.count || 9, //默认9
				sizeType: data.sizeType || ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: data.sourceType || ['album', 'camera'], //从相册选择
				success: function(res) {
					_this.urlFileUpload(url,{
						...data,
						files: res.tempFiles
					}, options).then(resolve, reject);
				}
			});
		});
	}
	//本地服务器文件上传方法
	urlFileUpload(url = '', data = {}, options = {}) {
		let requestInfo = this.getDefault(url, options, "file");
		requestInfo.method = "FILE";
		const _this = this;
		return new Promise((resolve, reject) => {
			//请求前回调
			if (_this.requestStart) {
				let requestStart = _this.requestStart({
					...requestInfo,
					...data
				});
				if (typeof requestStart == "object") {
					requestInfo.data = requestStart.data;
					requestInfo.headers = requestStart.headers;
					requestInfo.isPrompt = requestStart.isPrompt;
					requestInfo.load = requestStart.load;
					requestInfo.isFactory = requestStart.isFactory;
					requestInfo.files = requestStart.files;
				} else {
					//请求完成回调
					_this.requestEnd && _this.requestEnd(requestInfo, {
						errMsg: "请求开始拦截器未通过",
						statusCode: 0
					});
					reject({
						errMsg: "请求开始拦截器未通过",
						statusCode: 0
					});
					return;
				}
			}
			if (Array.isArray(requestInfo.files)) {
				// #ifdef APP-PLUS || H5
				let files = [];
				requestInfo.files.forEach(item => {
					files.push({
						url: item.path,
						name: requestInfo.name || "file"
					});
				});
				let config = {
					url: requestInfo.httpUrl,
					files: files,
					header: requestInfo.headers, //加入请求头
					success: (response) => {
						if (typeof(response.data) == "string") {
							response.data = JSON.parse(response.data);
						}
						//是否用外部的数据处理方法
						if (requestInfo.isFactory && _this.dataFactory) {
							//数据处理
							_this.dataFactory({
								...requestInfo,
								response: response,
								resolve: function(data) {
									requestInfo.eachUpdate && requestInfo.eachUpdate({
										data: data,
										...fileData
									});
									//请求完成回调
									_this.requestEnd && _this.requestEnd(requestInfo, {
										errMsg: "request:ok",
										statusCode: 200,
										data: data
									});
									resolve(data);
								},
								reject: function(err) {
									//请求完成回调
									_this.requestEnd && _this.requestEnd(requestInfo, {
										errMsg: "数据工厂返回错误",
										statusCode: 0,
										data: err
									});
									reject(err);
								}
							});
						} else {
							requestInfo.eachUpdate && requestInfo.eachUpdate({
								data: response,
								...fileData
							});
							//请求完成回调
							_this.requestEnd && _this.requestEnd(requestInfo, response);
							resolve(response);
						}
					},
					fail: (err) => {
						//请求完成回调
						_this.requestEnd && _this.requestEnd(requestInfo, err);
						reject(err);
					}
				};
				if (requestInfo.data) {
					config.formData = requestInfo.data;
				}
				console.log("上传文件参数", config);
				const uploadTask = uni.uploadFile(config);
				uploadTask.onProgressUpdate(res => {
					requestInfo.progressUpdate && requestInfo.progressUpdate(Object.assign({}, fileData, res));
				});
				// #endif
				// #ifdef MP
				const len = requestInfo.files.length - 1;
				let fileList = new Array;
				fileUpload(0);
				function fileUpload(i) {
					let fileData = {
						fileIndex: i,
						files: requestInfo.files,
						size: requestInfo.files[i].size
					};
					// #ifdef H5
					fileData.name = requestInfo.files[i].name;
					fileData.type = requestInfo.files[i].type;
					// #endif
					let config = {
						url: requestInfo.httpUrl,
						filePath: requestInfo.files[i].path,
						header: requestInfo.headers, //加入请求头
						name: requestInfo.name || "file",
						success: (response) => {
							if (typeof(response.data) == "string") {
								response.data = JSON.parse(response.data);
							}
							//是否用外部的数据处理方法
							if (requestInfo.isFactory && _this.dataFactory) {
								//数据处理
								_this.dataFactory({
									...requestInfo,
									response: response,
									resolve: function(data) {
										requestInfo.eachUpdate && requestInfo.eachUpdate({
											data: data,
											...fileData
										});
										fileList.push(data);
										if (len <= i) {
											//请求完成回调
											_this.requestEnd && _this.requestEnd(requestInfo, {
												errMsg: "request:ok",
												statusCode: 200,
												data: fileList
											});
											resolve(fileList);
										} else {
											fileUpload(i + 1);
										}
									},
									reject: function(err) {
										//请求完成回调
										_this.requestEnd && _this.requestEnd(requestInfo, {
											errMsg: "数据工厂返回错误",
											statusCode: 0,
											data: err
										});
										reject(err);
									}
								});
							} else {
								requestInfo.eachUpdate && requestInfo.eachUpdate({
									data: response,
									...fileData
								});
								fileList.push(response);
								if (len <= i) {
									//请求完成回调
									_this.requestEnd && _this.requestEnd(requestInfo, {
										errMsg: "request:ok",
										statusCode: 200,
										data: fileList
									});
									resolve(fileList);
								} else {
									fileUpload(i + 1);
								}
							}
						},
						fail: (err) => {
							//请求完成回调
							_this.requestEnd && _this.requestEnd(requestInfo, err);
							reject(err);
						}
					};
					if (requestInfo.data) {
						config.formData = requestInfo.data;
					}
					console.log("上传文件参数", config);
					const uploadTask = uni.uploadFile(config);
					uploadTask.onProgressUpdate(res => {
						requestInfo.progressUpdate && requestInfo.progressUpdate(Object.assign({}, fileData, res));
					});
				}
				// #endif
			} else {
				//请求完成回调
				_this.requestEnd && _this.requestEnd(requestInfo, {
					errMsg: "files 必须是数组类型",
					statusCode: 0
				});
				reject({
					errMsg: "files 必须是数组类型",
					statusCode: 0
				})
			}
		});
	}
}
