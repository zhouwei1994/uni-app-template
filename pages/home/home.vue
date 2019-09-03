<template>
  <view>
	  	<z-header :back="false"></z-header>
		<z-login ref="login" @success="pageData"></z-login>
	</view>
</template>

<script>
	import zLogin from '@/components/module/login';
	import { mapState, mapMutations } from 'vuex';
export default {
	components:{
		zLogin
	},
  data() {
    return {};
  },
	computed: {
		...mapState(['userInfo'])
	},
  //第一次加载
  onLoad(e) {
		const _this = this;
		// 页面植入打开登录方法
		this.$http.openLogin = function() {
			//跳转到首页
			uni.switchTab({
				url: '/pages/home/home'
			});
			//打开人脸识别
			_this.$refs.login.openLogin();
		};
	},
	//页面显示
	onShow() {},
  //方法
  methods: {
	  pageData(){
		  
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
    return this.$base.share();
  }
};
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";
</style>

