<template>
	<view>
		<nav-bar title="小程序登录"></nav-bar>
		<view class="table_box">
			<view class="table_title">使用前需要配置的参数</view>
			<view class="table_content">
				<text>登录获取的用户数据会自动储存到vuex里面config/store.js => state.userInfo</text>
			</view>
			<view class="table_head">
				<text>文件夹</text>
				<text>描述</text>
			</view>
			<view class="table_content">
				<text>config/baseUrl.js</text>
				<text>项目信息填写</text>
			</view>
			<view class="table_content">
				<text>config/login.js</text>
				<text>47行配置有弹窗登录组件的页面地址</text>
			</view>
			<view class="table_content">
				<text>config/login.js</text>
				<text>67行配置有弹窗登录组件的页面地址</text>
			</view>
			<view class="table_content">
				<text>config/login.js</text>
				<text>98配置小程序登录接口</text>
			</view>
		</view>
		<!-- 第三步 页面建立组件 -->
		<z-login></z-login>
		
		<!-- #ifdef MP-WEIXIN -->
		<button type="primary" @click="onAppletsLogin">小程序登录</button>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<button type="primary">请在微信小程序环境尝试</button>
		<!-- #endif -->
	</view>
</template>

<script>
// 第一步引入小程序登录弹窗组件
import zLogin from '@/components/module/login';
// #ifdef MP-WEIXIN
// 第四步 引入登录方法
import { onLogin } from '@/config/login';
// #endif
export default {
	components:{
		// 第二步 注册组件
		zLogin
	},
	data() {
		return {
			
		};
	},
	//方法
	methods: {
		onAppletsLogin() {
			// 第一个参数强制登录，尝试登录
			// try 为尝试登录，当第一次登录，没有用户登录权限的时候不弹出登录框
			// judge 询问登录，当第一次登录，没有用户登录权限的时候先弹出提示是否要去登录
			onLogin("judge",() => {
				console.log("登录成功");
			});
		}
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
</style>
