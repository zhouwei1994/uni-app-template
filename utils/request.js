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
			//是否提示--默认提示
			isPrompt:true,
			//是否显示请求动画
			load:true,
			//是否使用处理数据模板
			isFactory:true
		};
	}
	//post请求
	post(url = '', data = {}, options = {}) {
		let requestInfo = this.getDefault(url, options, "data");
		return new Promise((resolve, reject) => {
			this.getRequest("POST", requestInfo, data, (state, response) => {
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
		return new Promise((resolve, reject) => {
			this.getRequest("GET", requestInfo, data, (state, response) => {
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
	//文件上传
	file(url = '', data = {}, options = {}) {
		let requestInfo = this.getDefault(url, options, "file");
		const _this = this;
		return new Promise((resolve, reject) => {
			uni.chooseImage({
				count: data.count || 9, //默认9
				sizeType: data.sizeType || ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: data.sourceType || ['album','camera'], //从相册选择
				success: function (res) {
					_this.getFileUpload(requestInfo,res.tempFiles,data,(state, response) => {
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
		let config = Object.assign({},this.config,options);
		//请求地址
		config.httpUrl = httpUrl;
		//请求头
		config.headers = Object.assign(this.headers, options.headers);
		return config;
	}
	//接口请求方法
	getRequest(ajaxType, options, data, callback) {
		//请求前回调
		if (this.requestStart) {
			options.method = ajaxType;
			var requestStart = this.requestStart(options,data);
			if (typeof requestStart == "object") {
				if(requestStart.options){
					options = Object.assign(options, requestStart.options);
				}
				if(requestStart.data){
					data = requestStart.data;
				}
			}
		}
		uni.request({
			url: options.httpUrl,
			data: data,
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
	getFileUpload(options, files,data,callback) {
		const _this = this;
		//请求前回调
		if (this.requestStart) {
			options.method = "FILE";
			var requestStart = this.requestStart(options,data);
			if (typeof requestStart == "object") {
				if(requestStart.options){
					options = Object.assign(options, requestStart.options);
				}
// 				if(requestStart.data){
// 					data = requestStart.data;
// 				}
			}
		}
		const len = files.length - 1;
		let fileList = new Array;
		fileUpload(0);
		function fileUpload(i){
			console.log(files[i]);
			var config = {
				url: options.httpUrl,
				filePath: files[i].path,
				header: options.headers, //加入请求头
				name: data.name || "file",
				success: (response) => {
					response.data = JSON.parse(response.data);
					//请求完成回调
					_this.requestEnd && _this.requestEnd(options, response);
					//是否用外部的数据处理方法
					if (options.isFactory && _this.dataFactory) {
						//数据处理
						var factoryInfo = _this.dataFactory(options, response);
						console.log(factoryInfo);
						if(factoryInfo.success){
							fileList.push(factoryInfo.result);
							if(len <= i){
								callback(true, fileList);
							}else{
								fileUpload(i + 1);
							}
						}else{
							console.log("进入了这里");
							callback(false, factoryInfo.result);
						}
					} else {
						fileList.push(response.data);
						if(len <= i){
							callback(true, fileList);
						}else{
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
			if (data.data) {
				config.formData = data.data;
			}
			uni.uploadFile(config);
		}
	}
}
