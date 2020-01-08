<template>
	<view>
		<nav-bar backState="2000" title="首页"></nav-bar>
		<!-- banner -->
		<view class="banner_swiper_box">
			<swiper class="banner_swiper" :autoplay="true" :interval="3000" circular previous-margin="30px" next-margin="30px" :duration="1000" @change="onSwiperChange">
				<swiper-item v-for="(item, index) of bannerList" :key="index">
					<view class="banner_img" :class="{ active: swiperIndex == index }"><image src="../../static/images/1.jpg" mode="aspectFill" @click="onBanner(item)"></image></view>
				</swiper-item>
			</swiper>
		</view>
		<view class="video_box" v-if="videoShow" @click="onCloseVideo"><video :src="videoUrl" autoplay="true" controls></video></view>
		<z-login ref="login"></z-login>
	</view>
</template>

<script>
import zLogin from '@/components/module/login';
import { mapState, mapMutations } from 'vuex';
// #ifdef MP-WEIXIN
import {onLogin} from '@/config/login';
// #endif
export default {
	components: {
		zLogin
	},
	data() {
		return {
			videoUrl: '',
			videoShow: false,
			swiperIndex: 0,
			bannerList: [1, 1, 1, 1]
		};
	},
	computed: {
		...mapState(['userInfo'])
	},
	//第一次加载
	onLoad(e) {
		// #ifdef MP-WEIXIN
		onLogin(() => {
			this.getCoupon();
		});
		// #endif
	},
	//页面显示
	onShow() {},
	//方法
	methods: {
		...mapMutations(['setWebViewUrl']),
		pageData() {},
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		},
		// 轮播图点击
		onBanner(item) {
			if (item.jumpType == 1201) {
				this.setWebViewUrl(item.jumpRecord.webViewUrl);
				uni.navigateTo({
					url: '/pages/home/webView'
				});
			} else if (item.jumpType == 1301) {
				this.videoUrl = item.jumpRecord.videoUrl;
				this.videoShow = true;
			}
		},
		// 轮播图变化
		onSwiperChange(e){
			this.swiperIndex = e.detail.current;
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
.video_box {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #000;
	display: flex;
	align-items: center;
	justify-content: center;
	video {
		width: 100%;
	}
}
.banner_swiper_box {
	padding-top: 15upx;
	background-color: #fff;
	.banner_swiper {
		height: 315upx;
		
		swiper-item {
			box-sizing: border-box;
			display: flex;
			align-items: center;
			.banner_img {
				width: 100%;
				height: 100%;
				transform: scale(0.9);
				transition: all 0.4s;
				&.active {
					transform: scale(1);
				}
				image {
					width: 100%;
					height: 100%;
					box-shadow: 0upx 20upx 30upx 0upx rgba(0, 0, 0, 0.1);
					border-radius: 20upx;
				}
			}
		}
	}
}
</style>
