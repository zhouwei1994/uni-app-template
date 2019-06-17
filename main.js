import Vue from 'vue'
import App from './App'
//数据管理中心
import store from '@/config/store'
Vue.prototype.$store = store;
//法院权限配置中心
import base from '@/config/baseUrl'
Vue.prototype.$base = base;
//挂载全局http请求
import $http from '@/config/request'
Vue.prototype.$http = $http;
//判断是否登录
Vue.prototype.judgeLogin = function(type = "force",callback) {
	var userInfo = store.state.userInfo;
	if (userInfo.token) {
		callback();
	} else if ($http.openLogin) {
		//调取页面上的登录事件
		$http.openLogin();
	}
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount();