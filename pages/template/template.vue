<template>
	<view><nav-bar title="图片上传/文件上传"></nav-bar></view>
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
