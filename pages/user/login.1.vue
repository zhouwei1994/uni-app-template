<template>
	<view class="login_page">
		<!-- #ifndef H5 -->
		<nav-bar type="transparent">登录</nav-bar>
		<!-- #endif -->
		<view class="login_view_box">
			<view class="title">手机号登录</view>
			<view class="input_box"><input type="number" v-model="phone" placeholder="请输入手机号" /></view>
			<view class="input_box"><input type="password" v-model="password" placeholder="请输入密码" @confirm="onLogin" /></view>
			<view class="register_box">
				<text @click="onJumpPage('/pages/user/forget')">忘记密码？</text>
				<text @click="onJumpPage('/pages/user/register')">注册</text>
			</view>
			<view class="btn_box"><button @click="onLogin">登录</button></view>
			<view class="protocol">
				登录注册代表您已同意
				<text  @click="onJumpPage('/pages/user/protocol')">《用户协议》</text>
			</view>
		</view>
	</view>
</template>
<script>
import md5 from '@/utils/md5';
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			//手机号
			phone: '',
			// 密码
			password: ''
		};
	},
	//第一次加载
	onLoad(e) {},
	//页面显示
	onShow() {},
	//方法
	methods: {
		...mapMutations(['setUserInfo']),
		onJumpPage(url) {
			uni.navigateTo({
				url: url
			});
		},
		//登录
		onLogin() {
			if (!this.phone) {
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				});
				return;
			}
			if (!this.$base.phoneRegular.test(this.phone)) {
				uni.showToast({
					title: '请输入正确的手机号',
					icon: 'none'
				});
				return;
			}
			if (!this.password) {
				uni.showToast({
					title: '请输入密码',
					icon: 'none'
				});
				return;
			}
			this.$http
				.post('api/open/v1/login', {
					phone: this.phone,
					md5Password: md5(this.password)
				})
				.then(res => {
					this.setUserInfo(res);
					setTimeout(() => {
						uni.navigateBack();
					},1000)
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
.login_page {
	height: 100vh;
	width: 100vw;
	background-image: url('https://qn.kemean.cn/upload/201904/28/d811086494b54290a078e211ddc68f84');
	background-repeat: no-repeat;
	background-size: 100vw 100vh;
	background-position: center;
	padding-right: 30upx;
	position: relative;
	.login_view_box {
		width: 90%;
		height: 640upx;
		background-color: #ffffff;
		box-shadow: 0 10upx 30upx 0 rgba(0, 155, 255, 0.2);
		border-radius: 40upx;
		position: absolute;
		left: 5%;
		top: 40%;
		transform: translateY(-50%);
		padding: 0 65upx;
		.title {
			padding: 60upx 0 40upx 0;
			font-size: 60upx;
			color: #333333;
		}
		.input_box {
			display: flex;
			justify-content: space-between;
			height: 100upx;
			padding-top: 20upx;
			border-bottom: 1upx solid #eeeeee;
			input {
				flex: 1;
				height: 80upx;
				line-height: 80upx;
				font-size: 30upx;
			}
			button {
				height: 78upx;
				line-height: 78upx;
				font-size: 30upx;
				@include theme("font");
				&:active {
					background-color: transparent;
				}
			}
		}
		.register_box {
			display: flex;
			justify-content: space-between;
			margin-top: 20upx;
			font-size: 26upx;
			@include theme("font");
		}
		.btn_box {
			margin-top: 40upx;
			button {
				height: 86upx;
				@include theme("btn_bg");
				border-radius: 43upx;
				font-size: 36upx;
				color: #ffffff;
			}
		}
		.protocol {
			font-size: 24upx;
			color: #999999;
			text-align: center;
			margin-top: 20upx;
			text {
				@include theme("font");
			}
		}
	}
}
</style>
