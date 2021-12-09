<template>
	<view>
		<!-- 加载动画组件 -->
		<z-loading></z-loading>
		<!-- #ifdef MP-WEIXIN -->
		<!-- 小程序登录弹窗组件 -->
		<applets-bind-userInfo></applets-bind-userInfo>
		<!-- #endif -->
	</view>
</template>