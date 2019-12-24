<template>
	<view class="register_page">
		<view class="title" v-if="type == 1000">验证码登录</view>
		<view class="title" v-if="type == 2000">账号密码</view>
		<view class="input_box"><input type="number" v-model="phone" placeholder="请输入您的手机号码" maxlength="11" /></view>
		<view class="input_box" v-if="type == 1000">
			<input type="number" v-model="code" placeholder="请输入手机验证码" maxlength="6" @confirm="onSubmit" />
			<button class="active" @click="onSetCode">{{ codeText }}</button>
		</view>
		<view class="input_box" v-if="type == 2000"><input type="text" v-model="password" password placeholder="请输入密码" @confirm="onSubmit" /></view>
		<view class="btn_box"><button @click="onSubmit">登录</button></view>
		<view class="nav_box" v-if="type == 1000">
			<view class="agreement" v-if="type == 1000">
				进入即代表你已同意
				<text @click="onPageJump('/pages/user/protocol')">《用户协议》</text>
			</view>
			<text class="color" @click="onPageJump('/pages/user/register')">去注册</text>
		</view>
		<view class="nav_box" v-if="type == 2000">
			<text class="color" @click="onPageJump('/pages/user/register')">去注册</text>
			<text @click="onPageJump('/pages/user/forget')">忘记密码？</text>
		</view>
		<view class="password_register">
			<text v-if="type == 1000" @click="type = 2000">账户密码登录</text>
			<text v-if="type == 2000" @click="type = 1000">短信验证码登录</text>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="station"></view>
		<view class="third_party_login_box">
			<view class="third_party_title"><text>第三方登录</text></view>
			<view class="third_party_content"><image src="../../static/icon/wechat.png" @click="onWxAppLogin" mode="aspectFit"></image></view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
import md5 from '@/utils/md5';
var clear;
import { mapState, mapMutations } from 'vuex';
import socket from '@/config/socket';
export default {
	data() {
		return {
			type: 2000,
			code: '',
			phone: '',
			password: '',
			//验证码
			codeText: '获取验证码',
			//验证码已发
			readonly: false
		};
	},
	//第一次加载
	onLoad(e) {
	},
	//页面显示
	onShow() {},
	//方法
	methods: {
		...mapMutations(['setUserInfo']),
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		},
		//验证码按钮文字状态
		getCodeState() {
			clear && clearInterval(clear);
			const _this = this;
			this.readonly = true;
			this.codeText = '60S后重新获取';
			var s = 60;
			clear = setInterval(() => {
				s--;
				_this.codeText = s + 'S后重新获取';
				if (s <= 0) {
					clearInterval(clear);
					_this.codeText = '获取验证码';
					_this.readonly = false;
				}
			}, 1000);
		},
		// 发送验证码
		onSetCode() {
			if (!this.phone) {
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				});
				return;
			}
			if (!this.$base.phoneRegular.test(this.phone)) {
				uni.showToast({
					title: '手机号格式不正确',
					icon: 'none'
				});
				return;
			}
			this.$http
				.post('api/open/v1/send_sms', {
					phone: this.phone,
					type: 3103
				})
				.then(res => {
					this.getCodeState();
				});
		},
		onSubmit() {
			if (!this.phone) {
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				});
				return;
			}
			if (!this.$base.phoneRegular.test(this.phone)) {
				uni.showToast({
					title: '手机号格式不正确',
					icon: 'none'
				});
				return;
			}
			let httpData = {
				phone: this.phone
			};
			if (this.type == 1000) {
				if (!this.code) {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none'
					});
					return;
				}
				httpData.code = this.code;
			} else {
				if (!this.password) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					});
					return;
				}
				httpData.md5Password = md5(this.password);
			}
			this.$http.post('api/open/v1/login', httpData).then(res => {
				this.setUserInfo(res);
				socket.init();
				uni.showToast({
					title: '登录成功',
					duration: 2000
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 2000);
			});
		},
		// 微信APP登录
		onWxAppLogin() {
			uni.login({
				provider: 'weixin',
				success: res => {
					if(res.authResult.openid && res.authResult.unionid){
						this.$http
							.post('api/open/v1/login', {
								wxAppOpenId: res.authResult.openid,
								unionid: res.authResult.unionid
							})
							.then(data => {
								this.setUserInfo({
									openId: res.authResult.openid,
									unionid: res.authResult.unionid,
									...data,
								});
								if (data.thirdLoginSuccess) {
									socket.init();
									uni.showToast({
										title: '登录成功',
										duration: 2000
									});
									setTimeout(() => {
										uni.navigateBack();
									}, 2000);
								} else {
									uni.showModal({
										title: '提示',
										content: '您还未绑定手机号，请先绑定~',
										confirmText: '去绑定',
										cancelText: '再逛会',
										success: res => {
											if (res.confirm) {
												uni.redirectTo({
													url: '/pages/user/bindPhone'
												});
											}
										}
									});
								}
							});
					}else{
						uni.showToast({
							title: '数据缺失，请重新点击',
							icon:"none"
						});
					}
				}
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
.register_page {
	padding: calc(var(--status-bar-height) + 70upx) 50upx 50upx 50upx;
	background-color: #fff;
	min-height: 100vh;
	.title {
		font-size: 54upx;
		color: #333333;
		margin-bottom: 50upx;
	}
	.input_box {
		display: flex;
		align-items: center;
		border-bottom: 2upx solid #e5e5e5;
		padding: 30upx 0;
		margin-top: 20upx;
		input {
			flex: 1;
			font-size: 32upx;
			color: #333;
			height: 60upx;
		}
		button {
			height: 60upx;
			background-color: #f7f7f7;
			font-size: 24upx;
			border-radius: 8upx;
			padding: 0 14upx;
			color: #333;
			line-height: 60upx;
			margin-left: 20upx;
			&.active {
				@include theme('btn_bg');
				color: #fff;
			}
		}
	}
	.btn_box {
		margin-top: 60upx;
		button {
			@include theme('btn_bg');
			color: #fff;
			height: 92upx;
			line-height: 92upx;
			border-radius: 8upx;
		}
	}
	.agreement {
		font-size: 24upx;
		color: #999999;
		> text {
			@include theme('font');
		}
	}
	.password_register {
		margin-top: 110upx;
		text-align: center;
		text {
			font-size: 24upx;
			color: #333333;
			text-decoration: underline;
		}
	}
	.nav_box {
		margin-top: 30upx;
		display: flex;
		justify-content: space-between;
		> text {
			font-size: 24upx;
			color: #333333;
			&.color {
				@include theme('font');
			}
		}
	}
}
.station {
	height: 230upx;
}
.third_party_login_box {
	position: absolute;
	bottom: 0;
	width: 100%;
	left: 0;
	height: 230upx;
	padding: 0 30upx;
	.third_party_title {
		display: flex;
		align-items: center;
		&:before,
		&:after {
			content: '';
			flex: 1;
			height: 2upx;
			background-color: #f5f5f5;
		}
		text {
			font-size: 24upx;
			color: #999999;
			flex-shrink: 0;
			padding: 0 20upx;
		}
	}
	.third_party_content {
		height: 200upx;
		display: flex;
		justify-content: center;
		align-items: center;
		image {
			width: 60upx;
			height: 52upx;
		}
	}
}
</style>
