import request from "@/utils/request";
import store from '@/config/store';
// #ifdef H5
import { h5Login } from '@/config/html5Utils';
// #endif
import base from '@/config/baseUrl';
// #ifdef MP-WEIXIN
import { onLogin } from '@/config/login';
// #endif
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
			// #ifndef APP-PLUS
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			// #endif
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
		setTimeout(() => {
			uni.showToast({
				title: "网络错误，请检查一下网络",
				icon: "none"
			});
		}, 500);
	}
}
let loginPopupNum = 0;
//所有接口数据处理
$http.dataFactory = function (res) {
	console.log("接口请求数据", {
		httpUrl:res.httpUrl,
		resolve:res.response,
		headers:res.headers,
		data:res.data,
		method:res.method,
	});
	if (res.response.statusCode && res.response.statusCode == 200) {
		let httpData = res.response.data;
		//判断数据是否请求成功
		if (httpData.success) {
			if (res.data.pageNo && res.loadMore) {
				if (httpData.data.data) {
					const len = httpData.data.data.length;
					if (len < res.data.pageSize) {
						if (res.data.pageNo == 1) {
							if (len == 0) {
								store.commit("setRequestState", 1400);
							} else {
								store.commit("setRequestState", 999);
							}
						} else {
							store.commit("setRequestState", 1300);
						}
					} else if (res.data.pageNo < httpData.data.pages) {
						store.commit("setRequestState", 1000);
					} else {
						store.commit("setRequestState", 999);
					}
				}
			}
			// 返回正确的结果(then接受数据)
			res.resolve(httpData.data);
		} else if (httpData.code == "1000" || httpData.code == "1001") {
			if (options.data.pageNo && options.loadMore) {
				store.commit("setRequestState", 1200);
			}
			store.commit("emptyUserInfo");
			// #ifdef MP-WEIXIN
			onLogin();
			// #endif
			// #ifdef H5
			h5Login("force");
			// #endif
			// #ifdef APP-PLUS
			var content = '此时此刻需要您登录喔~';
			if (resolve.data.code == "1000") {
				content = '此时此刻需要您登录喔';
			}
			if (loginPopupNum <= 0) {
				loginPopupNum++;
				uni.showModal({
					title: '温馨提示',
					content: content,
					confirmText: "去登录",
					cancelText: "再逛会",
					success: function (res) {
						loginPopupNum--;
						if (res.confirm) {
							uni.navigateTo({
								url: "/pages/user/login"
							});
						}
					}
				});
			}
			// #endif
		} else { //其他错误提示
			if (res.data.pageNo && res.loadMore) {
				store.commit("setRequestState", 1200);
			}
			if (res.isPrompt) {
				setTimeout(function () {
					uni.showToast({
						title: httpData.info,
						icon: "none",
						duration: 3000
					});
				}, 500);
			}
			// 返回错误的结果(catch接受数据)
			res.reject(httpData);
		}
	}else{
		// 返回错误的结果(catch接受数据)
		res.reject(res.response);
	}
};
export default $http;
