<template>
	<view>
		<nav-bar backState="2000" title="自助服务"></nav-bar>
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
	//方法
	methods: {
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
</style>
