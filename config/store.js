import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
import {
	modifyJson
} from '@/utils/utils';
//变量
const state = {
	//用户数据
	userInfo: {},
};
//缓存浏览器的数据名称
const cacheNameList = [];
const mutations = {
	//取出缓存数据
	setCacheData(state) {
		for (let name of cacheNameList) {
			let data = uni.getStorageSync(name);
			if (data) {
				state[name] = data;
			}
		}
	},
	//储存用户信息
	setUserInfo(state, data) {
		if (data) {
			state.userInfo = modifyJson(data, state.userInfo);
		}
	},
};
//异步处理
const actions = {};
export default new Vuex.Store({
	state,
	mutations,
	actions
});
