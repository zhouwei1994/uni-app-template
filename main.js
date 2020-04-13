import Vue from 'vue'
import App from './App'
//数据管理中心
import store from '@/config/store'
Vue.prototype.$store = store;
//权限配置中心
import base from '@/config/baseUrl'
Vue.prototype.$base = base;
//挂载全局http请求
import $http from '@/config/requestConfig'
Vue.prototype.$http = $http;
// #ifdef MP-WEIXIN
//挂载全局微信分享
import { wxShare } from '@/config/share'
Vue.prototype.wxShare = wxShare;
// #endif
//判断是否登录
import { judgeLogin } from '@/config/login';
Vue.prototype.judgeLogin = judgeLogin;
Vue.config.productionTip = false;
// #ifdef H5
//微信SDK
import '@/config/wxJsSDK';
// #endif

//全局组件
import loadMore from "@/components/common/load_more.vue";
Vue.component("load-more", loadMore);
import zhouWeiNavBar from "@/components/common/zhouWei-navBar";
Vue.component("nav-bar", zhouWeiNavBar);
App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount();