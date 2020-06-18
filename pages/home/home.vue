<template>
	<view>
		<nav-bar backState="2000" title="首页"></nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
	</view>
</template>

<script>
export default {
	data() {
		return {
			
		};
	},
	onLoad(e) {
		
	},
	onShow() {
		
	},
	//方法
	methods: {
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		}
	},
	//页面下来刷新
	onPullDownRefresh() {},
	//页面上拉触底
	onReachBottom() {},
	//用户点击分享
	onShareAppMessage(e) {
		return this.wxShare();
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
</style>
