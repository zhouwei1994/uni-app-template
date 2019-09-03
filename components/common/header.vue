<template>
	<view>
		<view class="header" :class="{'transparent':!headBG,'line':headBG == '#FFF' || headBG == '#FFFFFF' || headBG == 'white'}" :style='{height: 46 + statusBarHeight+"px;",background: headBG+";"}'>
			<view class="left_info" v-if="back || $slots.left || firstPage && back">
				<slot name="left">
					<view class="back" v-if="back && !firstPage" @click="onBackPage"></view>
					<!-- <text></text> -->
					<view class="home" v-if="firstPage && back" @click="onBackHome"></view>
				</slot>
			</view>
			<view class="title" :style='{color: fontColor+";"}' v-if="headBG">
				<slot>{{platformName}}</slot>
			</view>
		</view>
		<view v-if="bg" :style='{height: 46 + statusBarHeight+"px;"}'></view>
	</view>
</template>
<script>
	export default {
		props: {
			//是否显示返回按钮
			back: {
				type: Boolean,
				default: function(){
					return true;
				}
			},
			//导航背景色，bg为false的时候导航通透
			bg: {
				default: function(){
					return "#FFF";
				}
			},
			//导航字体颜色，字体颜色为白色的时候会把手机状态栏设置为白色，否则为黑色
			fontColor: {
				default: function(){
					return "#000";
				}
			}
		},
		data() {
			return {
				//状态栏高度
				statusBarHeight:20,
				//当前页面是否是第一个页面
				firstPage:false,
				//当bg为空的时候页面滚动大于400将还原背景色
				headBG:"#FFF",
				platformName:""
			};
		},
		//第一次加载
		created(e) {
			const _this = this;
			//平台名称
			this.platformName = this.$base.platformName;
			// 赋值背景色
			this.headBG = this.bg;
			// #ifdef MP-WEIXIN
			//改变状态栏颜色
			if(this.fontColor == '#FFF' || this.fontColor == '#FFFFFF' || this.fontColor == 'white'){
				uni.setNavigationBarColor({
				  frontColor: '#ffffff',
				  backgroundColor: "#FFFFFF"
				});
			}else{
				uni.setNavigationBarColor({
				  frontColor: '#000000',
				  backgroundColor: "#FFFFFF"
				});
			}
			//获取手机状态栏高度
			this.statusBarHeight = wx.getSystemInfoSync()['statusBarHeight'];
			//获取微信的所有页面
			let currentPages = getCurrentPages();
			let pageLen = currentPages.length;
			//判断是否是第一个页面，如果是有设置back为true的页面，将不显示返回箭头，而现实返回首页按钮
			if(pageLen == 1){
				this.firstPage = true;
			}
			//监听页面滚动，bg为false的时候页面滚动距离大于180的时候显示默认白色
			if(!this.bg){
				currentPages[pageLen - 1].onPageScroll= function(e){
					if(e.scrollTop > 180){
						_this.headBG = "#FFF";
					} else {
						_this.headBG = _this.bg;
					}
				}
			}
			// #endif
		},
		//方法
		methods: {
			//返回页面
			onBackPage(){
				uni.navigateBack();
			},
			//返回首页
			onBackHome(){
				uni.switchTab({
					url:"/pages/home/home"
				});
			}
		},
	};
</script>
<style lang="scss" scoped>
	@import "@/style/mixin.scss";
	.header {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 99;
		display: flex;
		align-items: flex-end;
		&.line {
			// border-bottom: 2upx solid #f5f5f5;
			box-shadow: 0 0 6upx 0 #ddd;
		}
		&.transparent {
			border-bottom:0;
			background-color: initial;
			background-image: initial;
			width: auto;
			.left_info {
				background-color: rgba(255,255,255,0.7);
				margin-left: 16upx;
				border-radius: 33upx;
				border:2upx solid #eee;
				box-sizing: border-box;
			}
		}
		$height: 58upx;
		.left_info {
			display: flex;
			align-items: center;
			height: $height;
			margin-bottom: 18upx;
			transition: all 0.6s;
			.back {
				background-image: url("https://qn.kemean.cn/upload/201908/29/back.png");
				background-position: center center;
				background-repeat: no-repeat;
				background-size: auto 60%;
				width: $height;
				height: $height;
			}
			text {
				height: 30upx;
				width: 2upx;
				background-color: #999;
			}
			.home {
				background-image: url("https://qn.kemean.cn/upload/201908/29/home.png");
				background-position: center center;
				background-repeat: no-repeat;
				background-size: auto 60%;
				width: $height;
				height: $height;
			}
		}
		.title {
			height: $height;
			line-height: $height;
			font-size: 32upx;
			color: #000;
			padding-left: 30upx;
			margin-bottom: 18upx;
			max-width: 60vw;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap
		}
		view:nth-child(2){
			padding-left: 0;
		}
	}
</style>
