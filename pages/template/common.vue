<template>
  <view>
     <nav-bar backState="2000" title="通用方法示例"></nav-bar>
	 <view class="nav_list" @click="onPageJump('/pages/demo/list')">
	 	<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
	 	<text>列表</text>
	 </view>
	 <view class="nav_list" @click="onPageJump('/pages/user/login')">
	 	<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
	 	<text>登录/注册</text>
	 </view>
	 <view class="nav_list" @click="onPageJump('/pages/demo/uploadFile')">
	 	<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
	 	<text>图片上传/文件上传</text>
	 </view>
	 <view class="nav_list" @click="onPageJump('/pages/demo/areaSelect')">
	 	<image src="../../static/demo/icon_case.png" mode="aspectFit"></image>
	 	<text>地区选择</text>
	 </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
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
@import "@/style/mixin.scss";
.nav_list {
	background-color: #fff;
	padding: 30upx;
	display: flex;
	align-items: center;
	position: relative;
	margin-bottom: 10upx;
	&:active {
		background-color: #F5f5f5;
	}
	image {
		width: 40upx;
		height: 40upx;
	}
	text {
		font-size: 28upx;
		color: #333;
		margin-left: 30upx;
	}
	&::after {
		content: '';
		position: absolute;
		right: 30upx;
		top: 50%;
		transform: translateY(-50%);
		width: 40upx;
		height: 40upx;
		background-image: url('../../static/demo/icon_right.png');
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
	}
}
</style>

