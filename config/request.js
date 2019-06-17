import request from "@/utils/request";
import store from '@/config/store';
import md5 from '@/utils/md5';
import {
	utf8
} from '@/utils/utils';
import base from '@/config/baseUrl';
let $http = new request({
	baseUrl: base.baseUrl,
	fileUrl: base.imgBaseUrl,
	headers: {
		'content-type': 'application/json;charset=UTF-8'
	}
});
let requestNum = 0;
//请求开始回调
$http.requestStart = function(options) {
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
	requestNum += 1;
	var callbackData = {};
	//请求前加入token
	if (store.state.userInfo.token) {
		options.headers['user_token'] = store.state.userInfo.token;
	};
	console.log("请求开始前", options);
	return options;
}
//请求结束
$http.requestEnd = function(options, resolve) {
	//判断当前接口是否需要加载动画
	requestNum = requestNum - 1;
	if (requestNum <= 0) {
		uni.hideLoading();
		uni.hideNavigationBarLoading();
	}
}
let loginPopupNum = 0;
//所有接口数据处理
$http.dataFactory = function(options, resolve) {
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
	} else if (resolve.data.code == "1000" || resolve.data.code == "1001") { //code == 10403 是用户未登录
		var content = '您还未登录，请先登录';
		if (resolve.data.code == "1000") {
			content = '您的登录已失效，请重新登录';
		}
		if (loginPopupNum <= 0) {
			loginPopupNum++;
			if($http.openLogin){
				uni.showModal({
					title: '提示',
					content: content,
					confirmText: "去登录",
					cancelText: "再等等",
					success: function(res) {
						loginPopupNum--;
						if (res.confirm) {
							//调取页面上的登录事件
							$http.openLogin();
						}
					}
				});
			}else{
				loginPopupNum--;
				uni.showToast({
					title: content,
					icon: "none",
					duration: 3000
				});
			}
		}
	} else { //其他错误提示
		if (options.isPrompt) {
			setTimeout(function() {
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
