<template>
	<view>
		<nav-bar title="滑动操作"></nav-bar>
		<swipe-action :options="options">
			<view class="swipe_action">
				滑动
			</view>
		</swipe-action>
	</view>
</template>

<script>
import swipeAction from '@/components/common/swipe-action';
export default {
	components: {
		swipeAction
	},
	data() {
		return {
			options: [
				{
					text: '取消',
					style: {
						backgroundColor: '#007aff'
					}
				},
				{
					text: '确认',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			]
		};
	},
	//第一次加载
	onLoad(e) {},
	//页面显示
	onShow() {},
	//方法
	methods: {
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		}
	},
	//页面隐藏
	onHide() {},
	//页面卸载
	onUnload() {},
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
.swipe_action {
	background-color: #FFFFFF;
	padding: 30rpx;
}
</style>
