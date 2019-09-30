import request from "@/utils/request";
import store from '@/config/store';
import { h5Login } from '@/config/html5Utils';
import base from '@/config/baseUrl';
//可以new多个request来支持多个域名请求
let $http = new request({
	//接口请求地址
	baseUrl: base.baseUrl,
	//服务器本地上传文件地址
	fileUrl: base.baseUrl,
	//设置请求头
	headers: {
		'content-type': 'application/json;charset=UTF-8',
		'project_token': base.projectToken,
	}
});
//当前接口请求数
let requestNum = 0;
//请求开始拦截器
$http.requestStart = function (options) {
	if (requestNum <= 0) {
		uni.showNavigationBarLoading();
		if (options.load) {
			//打开加载动画
			uni.showLoading({
				title: '加载中',
				mask: true
			});
		}
	}
	if (options.data.pageNo && options.loadMore) {
		store.commit("setRequestState", 1100);
	}
	requestNum += 1;
	//请求前加入token
	if (store.state.userInfo.token) {
		options.headers['user_token'] = store.state.userInfo.token;
	};
	console.log("请求开始前", options);
	return options;
}
//请求结束
$http.requestEnd = function (options, resolve) {
	if (resolve.statusCode !== 200 && options.data.pageNo && options.loadMore) {
		store.commit("setRequestState", 1200);
	}
	//判断当前接口是否需要加载动画
	requestNum = requestNum - 1;
	if (requestNum <= 0) {
		uni.hideLoading();
		uni.hideNavigationBarLoading();
	}
	if (resolve.errMsg && (resolve.errMsg != "request:ok" || resolve.statusCode && resolve.statusCode != 200)) { 
		uni.showToast({
			title: "网络错误，请检查一下网络",
			icon: "none"
		});
	}
}
let loginPopupNum = 0;
//所有接口数据处理
$http.dataFactory = function (options, resolve) {
	console.log("接口返回结果", resolve);
	//设置回调默认值
	var callback = {
		success: false,
		result: ""
	};
	//判断数据是否请求成功
	if (resolve.data.success) {
		callback.success = true;
		callback.result = resolve.data.data;
		if (options.data.pageNo && options.loadMore) {
			if (resolve.data.data.data) {
				const len = resolve.data.data.data.length;
				if (len < options.data.pageSize) {
					if (options.data.pageNo == 1) {
						if (len == 0) {
							store.commit("setRequestState", 1400);
						} else {
							store.commit("setRequestState", 999);
						}
					} else {
						store.commit("setRequestState", 1300);
					}
				} else if (options.data.pageNo < resolve.data.data.pages) {
					store.commit("setRequestState", 1000);
				} else {
					store.commit("setRequestState", 999);
				}
			}
		}
	} else if (resolve.data.code == "1000" || resolve.data.code == "1001") {
		if (options.data.pageNo && options.loadMore) {
			store.commit("setRequestState", 1200);
		}
		var content = '此时此刻需要您登录喔~';
		if (resolve.data.code == "1000") {
			content = '此时此刻需要您登录喔';
		}
		if (loginPopupNum <= 0) {
			// #ifdef MP-WEIXIN
			loginPopupNum++;
			uni.showModal({
				title: '温馨提示',
				content: content,
				confirmText: "去登录",
				cancelText: "再逛会",
				success: function (res) {
					loginPopupNum--;
					if (res.confirm) {
						if ($http.openLogin) {
							//调取页面上的登录事件
							$http.openLogin();
						} else {
							uni.switchTab({
								url: '/pages/home/home'
							});
						}
					}
				}
			});
			// #endif
			// #ifdef H5
			h5Login("force");
			// #endif
		}
	} else { //其他错误提示
		if (options.data.pageNo && options.loadMore) {
			store.commit("setRequestState", 1200);
		}
		if (options.isPrompt) {
			setTimeout(function () {
				uni.showToast({
					title: resolve.data.info,
					icon: "none",
					duration: 3000
				});
			}, 500);
		}
		callback.result = resolve.data;
	}
	return callback;
};
export default $http;
