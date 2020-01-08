import store from '@/config/store';
import $http from '@/config/request'
import base from '@/config/baseUrl';
let code = "";
let loginStart = true;
let userInfo = {
	token: ""
};
let lastPageUrl = "";
//判断登录状态
function onLogin(type = "judge",callback) {
	if (loginStart) {
		lastPageUrl = "";
		loginStart = false;
		const _this = this;
		let platform;
		// #ifdef MP-WEIXIN
		platform = 'weixin';
		// #endif
		// #ifdef MP-ALIPAY
		platform = 'alipay';
		// #endif
		// #ifdef MP-BAIDU
		platform = 'baidu';
		// #endif
		uni.login({
			provider: platform,
			success: function(loginRes) {
				if (loginRes.errMsg == 'login:ok') {
					code = loginRes.code;
					// 获取用户信息
					uni.getUserInfo({
						provider: platform,
						success: function(infoRes) {
							getUserInfo(infoRes, "", callback);
						},
						fail() {
							if(type != "try"){
								//获取微信的所有页面
								let currentPages = getCurrentPages();
								if(["pages/home/home","pages/home/home99TC","pages/mall/home99TC","pages/mall/home","pages/mall/homeJPDD","pages/mall/shopPage/goodsDetail"].includes(currentPages[currentPages.length - 1].route)){
									store.commit('setLoginPopupShow', true);
									Object.defineProperty(userInfo, "token", {
										get: function(val) {
											return {};
										},
										set: function(newVal) {
											callback && callback();
										}
									});
								}else{
									uni.showModal({
										title:"登录提示",
										content:"此时此刻需要您登录喔~",
										confirmText: "去登录",
										cancelText: "再逛会",
										success: (res) => {
											if(res.confirm){
												store.commit('setLoginPopupShow', true);
												uni.switchTab({
													url:base.homePath
												});
											}
										}
									});
								}
								setTimeout(() => {
									loginStart = true;
								}, 2000);
							}else{
								loginStart = true;
							}
						}
					});
				}
			}
		});
	}
}
//获取用户信息
function getUserInfo(info, type, callback) {
	$http.post('api/open/v1/login', {
			wxSmallCode: code,
			iv: info.iv,
			encryptedData: info.encryptedData
		})
		.then(res => {
			loginStart = true;
			store.commit('setUserInfo', res);
			if (type == "authorized") {
				userInfo.token = res.token;
				store.commit('setLoginPopupShow', false);
			}else{
				callback && callback();
			}
			uni.showToast({
				title: "登录成功"
			});
		}, err => {
			loginStart = true;
		});
}
module.exports = {
	onLogin,
	getUserInfo
}
