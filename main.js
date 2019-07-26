import Vue from 'vue'
import App from './App'
//数据管理中心
import store from '@/config/store'
Vue.prototype.$store = store;
//权限配置中心
import base from '@/config/baseUrl'
Vue.prototype.$base = base;
//挂载全局http请求
import $http from '@/config/request'
Vue.prototype.$http = $http;
Vue.config.productionTip = false;
// #ifdef H5
//微信SDK
import '@/config/wxJsSDK';
import { h5Login } from '@/config/html5Utils';
// #endif
//判断是否登录
Vue.prototype.judgeLogin = function (type = "judge", callback) {
	var userInfo = store.state.userInfo;
	if (type != "force" && userInfo.token) {
		callback();
	} else if (userInfo.wxSmallOpenId && !userInfo.thirdLoginSuccess) {
		if (type = "force") {
			uni.navigateTo({
				url: '/pages/user/bindPhone'
			});
		} else {
			uni.showModal({
				title: "提示",
				content: "您还未绑定手机号，请先绑定~",
				confirmText: "去绑定",
				cancelText: "再逛会",
				success: (res) => {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/user/bindPhone'
						});
					}
				}
			});
		}
	} else {
		// #ifdef MP-WEIXIN
		if ($http.openLogin) {
			if (type == "force") {
				$http.openLogin();
			} else {
				uni.showModal({
					title: "登录提示",
					content: "此时此刻需要您登录喔~",
					confirmText: "去登录",
					cancelText: "再逛会",
					success: (res) => {
						if (res.confirm) {
							//调取页面上的登录事件
							$http.openLogin();
						}
					}
				});
			}
		} else {
			uni.switchTab({
				url: '/pages/home/home'
			});
		}
		// #endif
		// #ifdef H5
		h5Login(type, () => {
			callback();
		});
		// #endif
	}
}
//全局组件
import loadMore from "@/components/common/load_more.vue";
Vue.component("load-more", loadMore);
App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount();