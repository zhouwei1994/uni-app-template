<template>
	<view>
		<!-- 登录弹窗 -->
		<view class="loginMask" v-if="loginPopup" @click="closePopup"></view>
		<view class="loginPopup" v-if="loginPopup">
			<view class="loginBox">
				<image class="logo" src="../../static/icon/sqaj.png"></image>
				<view class="currentCourt">{{currentCourt}}</view>
				<view class="info">网上诉讼服务中心</view>
			</view>
			<button type="primary" hover-class="active" open-type="getUserInfo" @getuserinfo="onAuthorization">授权登录</button>
		</view>
		<!--人脸识别弹出框-->
		<view class='loginMask' v-if="identifyPopup">
			<view class='identifyPopup'>
				<view class='title'>验证身份</view>
				<view class='maskContent'>
					<view class='icon'>
						<image src='../../static/icon/smLian.png'></image>
					</view>
					<view class='courtName'>请先进行人脸识别验证身份</view>
				</view>
				<view class='btnView'>
					<view class='confirm' @click='gotoVerify'>确定</view>
				</view>
				<image class='Close' src="../../static/icon/close1.png" @click='closePopup'></image>
			</view>
		</view>
		<!--绑定手机弹窗-->
		<view class='loginMask' v-if="bindPhonePopup">
			<view class='identifyPopup'>
				<view class='title'>
					<text>绑定手机号</text>
					<!-- <image src="../../static/icon/close.png"></image> -->
				</view>
				<form @submit="setBindPhone">
					<view class='maskContent'>
						<view class="inputBox">
							<input type="number" v-model="phone" name="phone" placeholder="请输入手机号码" />
							<text>|</text>
							<button type="primary" @click="getCode">{{codeText}}</button>
						</view>
						<view class="inputBox">
							<input type="number" name="code" maxlength='6' placeholder="请输入验证码" />
						</view>
					</view>
					<view class='btnView'>
						<button class='confirm' formType="submit">绑定</button>
					</view>
				</form>
				<image class='Close' src="../../static/icon/close1.png" @click='closePopup'></image>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from "vuex"
	import base from "@/config/baseUrl"
	let clear;
	export default {
		props: {
			type: {
				type: String,
				default: "login"
			}
		},
		data() {
			return {
				//登录弹窗
				loginPopup: false,
				code: "",
				//人脸识别
				identifyPopup: false,
				//绑定手机号弹窗
				bindPhonePopup: false,
				//验证码按钮
				codeText: "获取验证码",
				//手机号
				phone: "",
				//验证码是否可以发送
				readonly: false,
				//身份信息
				identityInfo: {},
				//快速登录
				fastLogin:false
			}
		},
		computed: {
			...mapState(["currentCourt", "userInfo"])
		},
		onReady: function() {
			if (!this.userInfo.openid) {
				this.onLogin();
			}
		},
		methods: {
			...mapMutations(["setUserInfo"]),
			openLogin() {
				if (this.userInfo.openid && this.userInfo.is_real != 2) {
					//查询身份信息
					uni.getStorage({
						key: 'identityInfo',
						success: (res) => {
							this.identityInfo = res.data;
							this.bindPhonePopup = true;
						},
						fail: () => {
							this.identifyPopup = true;
						}
					});
				}else{
					this.fastLogin = true;
					this.onLogin();
				}
			},
			onLogin: function() {
				const _this = this;
				let platform;
				// #ifdef MP-WEIXIN
				platform = "weixin";
				// #endif
				// #ifdef MP-ALIPAY
				platform = "alipay";
				// #endif
				// #ifdef MP-BAIDU
				platform = "baidu";
				// #endif
				uni.login({
					provider: platform,
					success: function(loginRes) {
						if (loginRes.errMsg == "login:ok") {
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
				var userInfo = e.detail;
				this.loginPopup = false;
				this.getUserLogin(userInfo);
			},
			//用户登录
			getUserLogin: function(info) {
				const _this = this;
				this.$http.post("/login/wxlogin.json", {
					code: this.code
				}, {
					isPrompt: false
				}).then(res => {
					this.setUserInfo(res);
					uni.showToast({
						title:"登录成功！"
					})
					this.$emit("success", res);
				}).catch(err => {
					this.setUserInfo({
						...err.data,
						...info.userInfo
					});
					if (err.result == 10021) {
						//查询身份信息
						if(this.fastLogin){
							uni.getStorage({
								key: 'identityInfo',
								success: function(res) {
									_this.identityInfo = res.data;
									_this.bindPhonePopup = true;
								},
								fail: () => {
									_this.identifyPopup = true;
								}
							});
						}
					}
				});
			},
			closeLogin(){
				if(this.loginPopup && (this.userInfo.openid || this.userInfo.is_real == "2")){
					this.loginPopup = false;
				}
				if(this.identifyPopup){
					if(this.identityInfo.name){
						this.identifyPopup = false;
					}else{
						uni.getStorage({
							key: 'identityInfo',
							success: (res) => {
								this.identityInfo = res.data;
								this.identifyPopup = false;
							}
						});
					}
				}
				if(this.bindPhonePopup && this.userInfo.is_real == "2"){
					this.bindPhonePopup = false;
				}
			},
			//关闭弹窗
			closePopup() {
				this.loginPopup = false;
				this.identifyPopup = false;
				this.bindPhonePopup = false;
			},
			//确定开启人脸识别
			gotoVerify() {
				const _this = this;
				this.$http.post(base.facerUrl + '/api/v3/bizToken', {
					appid: base.weiXinAppId,
					appkey: base.weiXinAppKey,
				}, {
					isFactory: false,
					apiType: "face"
				}).then(res => {
					if (res.data.errCode == 0) {
						uni.startVerify({
							// 传入的数据
							data: {
								token: res.data.data.BizToken
							},
							// 验证成功后触发
							success: function(data) {
								_this.$http.post(base.facerUrl + "/api/v3/detectInfo", {
									appid: base.weiXinAppId,
									appkey: base.weiXinAppKey,
									BizToken: data.Token,
									InfoType: '1'
								}, {
									isFactory: false,
									apiType: "face"
								}).then(childRes => {
									if (childRes.data.errCode == 0) {
										const identityInfo = {
											name: childRes.data.data.Text.Name,
											idCard: childRes.data.data.Text.IdCard,
										};
										//储存身份信息
										uni.setStorage({
											key: 'identityInfo',
											data: identityInfo
										});
										_this.identityInfo = identityInfo;
										if (_this.type == "face") {
											_this.$emit("faceSuccess", {
												...identityInfo,
												bizToken: data.Token
											});
										} else {
											//绑定身份
											_this.setBindIdentity(childRes.data.data.Text.Name, childRes.data.data.Text.IdCard, 1);
										}
									} else {
										setTimeout(function() {
											uni.showToast({
												title: childRes.data.errMsg,
												icon: "none",
												duration: 2000
											});
										}, 300);
									}
								});
							},
							// 验证失败时触发
							fail: function(err) {
								setTimeout(() => {
									uni.showModal({
										title: "提示",
										content: err.ErrorMsg,
										showCancel: false
									})
								}, 300);
							}
						});
					} else {
						setTimeout(function() {
							uni.showToast({
								title: res.data.errMsg,
								icon: "none",
								duration: 2000
							});
						}, 300)
					}
				});
			},
			//绑定身份信息
			setBindIdentity(name, idcard, state) {
				var openId = this.userInfo.openid;
				console.log("用户信息",this.userInfo);
				if (!openId) {
					uni.showToast({
						title: "openid丢失！",
						icon: 'none',
					});
					return;
				}
				this.$http.post("/reg/bindOpenidWithIdCard.json", {
					idcard: idcard,
					openid: openId
				}, {
					isPrompt: false
				}).then(res => {
					this.setUserInfo(res);
					uni.showToast({
						title: "身份信息绑定成功！",
						icon: 'none',
					});
					this.identifyPopup = false;
				}).catch((error) => {
					//未绑定手机
					if (error.result == 502) {
						//关闭人脸识别弹窗
						this.identifyPopup = false;
						//打开手机号绑定弹窗
						this.bindPhonePopup = true;
					} else {
						setTimeout(function() {
							uni.showToast({
								title: error.res_info,
								icon: "none",
								duration: 2000
							});
						}, 300);
					}
				});
			},
			//验证码按钮文字状态
			getCodeState() {
				this.readonly = true;
				this.codeText = "60S";
				var s = 60;
				clear = setInterval(() => {
					s--;
					this.codeText = s + "S";
					if (s <= 0) {
						clearInterval(clear);
						this.codeText = "获取验证码";
						this.readonly = false;
					}
				}, 1000);
			},
			//发送验证码
			getCode() {
				if (this.readonly) {
					uni.showToast({
						title: '验证码已发送',
						icon: 'none',
					})
					return;
				}
				if (this.phone == "") {
					uni.showToast({
						title: "请输入手机号",
						icon: 'none',
					});
					return;
				}
				if (!base.phoneRegular.test(this.phone)) {
					uni.showToast({
						title: "手机号格式不正确",
						icon: 'none',
					});
					return;
				}
				this.$http.post("/reg/miniAppRegMsg.json", {
					mobile: this.phone
				}).then(res => {
					//验证码获取倒计时
					this.getCodeState();
				});
			},
			//绑定手机
			setBindPhone(e) {
				const value = e.detail.value;
				if (value.phone == "") {
					uni.showToast({
						title: "请输入手机号",
						icon: 'none',
					});
					return;
				}
				if (!base.phoneRegular.test(value.phone)) {
					uni.showToast({
						title: "手机号格式不正确",
						icon: 'none',
					});
					return;
				}
				if (value.code == "") {
					uni.showToast({
						title: "请输入验证码",
						icon: 'none',
					});
					return;
				}
				this.$http.post("/reg/index.json", {
					code: value.code,
					id_card: this.identityInfo.idCard,
					real_name: this.identityInfo.name,
					mobile: value.phone,
					openid: this.userInfo.openid,
					sex: this.userInfo.gender,
					nickname: this.userInfo.nickName,
					headimgurl: this.userInfo.avatarUrl,
					city: this.userInfo.city,
					province: this.userInfo.province,
					country: this.userInfo.country,
				}).then(res => {
					this.setUserInfo({
						avatar: this.userInfo.avatarUrl,
						is_real: "2",
						nikname: this.userInfo.nickName,
						real_name: this.identityInfo.name,
						username: value.phone
					});
					this.bindPhonePopup = false;
					uni.showToast({
						title: "手机号码绑定成功！",
						icon: 'none',
					});
				});
			}
		}
	}
</script>

<style lang="scss">
	@import '@/style/mixin.scss';

	.loginPopup {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
		width: 500upx;
		background-color: #FFF;
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

			.currentCourt {
				font-size: 24upx;
				color: #999;
				margin-top: 10upx;
			}

			.info {
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
