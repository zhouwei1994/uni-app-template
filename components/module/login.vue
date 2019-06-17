<template>
	<view>
		<!-- 登录弹窗 -->
		<view class="loginMask" v-if="loginPopup" @click="closePopup"></view>
		<view class="loginPopup" v-if="loginPopup">
			<view class="loginBox">
				<image class="logo" src="https://qn.kemean.cn/upload/201905/29/c4f7409c1d9a499cb8eff66ae3202ea6"></image>
				<view class="platformName">{{ base.platformName }}</view>
				<view class="description">企业单身员工交友平台</view>
			</view>
			<button type="primary" hover-class="active" open-type="getUserInfo" @getuserinfo="onAuthorization">授权登录</button>
		</view>
	</view>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import base from '@/config/baseUrl';

let clear;
export default {
	props: {
		type: {
			type: String,
			default: 'login'
		}
	},
	data() {
		return {
			//登录弹窗
			loginPopup: false,
			base: base,
			//快速登录
			fastLogin: false
		};
	},
	computed: {
		...mapState(['userInfo', 'chatScenesInfo'])
	},
	onReady: function() {
		if (!this.userInfo.token) {
			this.onLogin();
		}
	},
	methods: {
		...mapMutations(['setUserInfo']),
		openLogin() {
			this.fastLogin = true;
			this.onLogin();
		},
		onLogin: function() {
			const _this = this;
			let platform;
			// #ifdef MP-WEIXIN
			platform = 'weixin';
			// #endif
			// #ifdef MP-ALIPAY
			platform = 'alipay';
			// #endif
			// #ifdef MP-BAIDU
			platform = 'baidu';
			// #endif
			uni.login({
				provider: platform,
				success: function(loginRes) {
					if (loginRes.errMsg == 'login:ok') {
						_this.code = loginRes.code;
						// 获取用户信息
						uni.getUserInfo({
							provider: platform,
							success: function(infoRes) {
								_this.getUserLogin(infoRes);
							},
							fail() {
								// 未授权将打开授权弹窗
								_this.loginPopup = true;
							}
						});
					}
				}
			});
		},
		//授权登录
		onAuthorization: function(e) {
			if (e.detail.errMsg == 'getUserInfo:ok') {
				var userInfo = e.detail;
				this.loginPopup = false;
				this.getUserLogin(userInfo);
			}
		},
		//用户登录
		getUserLogin: function(info) {
			const _this = this;
			this.$http
				.post('api/open/v1/login', {
					wxSmallCode: this.code,
					iv: info.iv,
					encryptedData: info.encryptedData
				})
				.then(res => {
					this.setUserInfo(res);
					if (res.settleStatus == 1401) {
						uni.showToast({
							title: '登录成功！'
						});
						
						this.$emit('success', res);
					} else if (res.settleStatus == 1201) {
						var title = '账号信息还在审核中！';
						if (res.userType == 1101) {
							title = '企业信息还在审核中！';
						}
						uni.showToast({
							title: title,
							icon:"none"
						});
						this.$emit('success', res);
					} else {
						var userType = this.chatScenesInfo.query.userType;
						if (userType && userType == 1101) {
							//企业管理员
							uni.reLaunch({
								url: '/pages/registered/adminRegistered'
							});
						} else if (userType && userType == 1102) {
							//企业用户
							uni.reLaunch({
								url: '/pages/registered/companySelect'
							});
						} else {
							//个体用户
							uni.reLaunch({
								url: '/pages/registered/registered'
							});
						}
					}
				});
		},
		closeLogin() {
			if (this.loginPopup && this.userInfo.token) {
				this.loginPopup = false;
			}
		},
		//关闭弹窗
		closePopup() {
			this.loginPopup = false;
		}
		// //验证码按钮文字状态
		// getCodeState() {
		// 	this.readonly = true;
		// 	this.codeText = "60S";
		// 	var s = 60;
		// 	clear = setInterval(() => {
		// 		s--;
		// 		this.codeText = s + "S";
		// 		if (s <= 0) {
		// 			clearInterval(clear);
		// 			this.codeText = "获取验证码";
		// 			this.readonly = false;
		// 		}
		// 	}, 1000);
		// },
		// //发送验证码
		// getCode() {
		// 	if (this.readonly) {
		// 		uni.showToast({
		// 			title: '验证码已发送',
		// 			icon: 'none',
		// 		})
		// 		return;
		// 	}
		// 	if (this.phone == "") {
		// 		uni.showToast({
		// 			title: "请输入手机号",
		// 			icon: 'none',
		// 		});
		// 		return;
		// 	}
		// 	if (!base.phoneRegular.test(this.phone)) {
		// 		uni.showToast({
		// 			title: "手机号格式不正确",
		// 			icon: 'none',
		// 		});
		// 		return;
		// 	}
		// 	this.$http.post("/reg/miniAppRegMsg.json", {
		// 		mobile: this.phone
		// 	}).then(res => {
		// 		//验证码获取倒计时
		// 		this.getCodeState();
		// 	});
		// },
	}
};
</script>

<style lang="scss">
@import '@/style/mixin.scss';
.loginMask {
	position: fixed;
	top: 0upx;
	left: 0upx;
	right: 0upx;
	bottom: 0upx;
	background-color: rgba(0, 0, 0, 0.4);
}
.loginPopup {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	width: 500upx;
	background-color: #fff;
	border-radius: 20upx;
	overflow: hidden;
	z-index: 2;

	.loginBox {
		padding: 30upx 15upx 40upx 15upx;
		display: flex;
		flex-direction: column;
		align-items: center;

		.logo {
			width: 160upx;
			height: 160upx;
		}

		.platformName {
			font-size: 24upx;
			color: #999;
			margin-top: 10upx;
		}

		.description {
			margin-top: 15upx;
			font-size: 30upx;
			color: #333;
		}
	}

	button {
		border-radius: 0upx;
		background-color: $mainColor;
	}
	.active {
		background-color: $mainColor;
		opacity: 0.8;
	}
}
</style>
