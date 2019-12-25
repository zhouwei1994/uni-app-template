<template>
	<view class="protocol_page">
		<nav-bar title="协议"></nav-bar>
		<view class="title">{{title}}</view>
		<u-parse :content="protocol" />
	</view>
</template>

<script>
import uParse from '@/components/common/u-parse/parse.vue';
export default {
	components: { uParse },
	data() {
		return {
			type:1202,
			title:"用户协议",
			protocol: '<b/>'
		};
	},
	//第一次加载
	onLoad(e) {
		if(e.type){
			this.type = parseInt(e.type);
			let title;
			switch (this.type) {
				case 1101:
					title = "帮我买的【预估费】";
					break;
				case 1102:
					title = "帮我买价格说明";
					break;
				case 1103:
					title = "取送价格说明";
					break;
				case 1104:
					title = "帮忙价格说明";
					break;
				case 1201:
					title = "跑腿帮我买服务协议";
					break;
				case 1202:
					title = "登录注册用户协议";
					break;
				case 1203:
					title = "跑腿取送服务协议";
					break;
				case 1204:
					title = "跑腿帮忙服务协议";
					break;
				case 1205:
					title = "跑腿服务协议";
					break;
				case 1401:
					title = "分销、分润介绍";
					break;
				case 1501:
					title = "社区服务商协议";
					break;
				case 1502:
					title = "社区合伙人协议";
					break;
				case 1503:
					title = "社区运营商协议";
					break;
				case 1504:
					title = "商家入驻协议";
					break;
				case 1505:
					title = "合作协议";
					break;
			}
			this.title = title;
		}
		this.pageData();
	},
	//页面显示
	onShow() {},
	//方法
	methods: {
		pageData() {
			this.$http
				.get('api/open/v1/rich_text', {
					type: this.type
				})
				.then(res => {
					this.protocol = res;
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
.protocol_page {
	background-color: #fff;
	padding: 30upx;
	font-size: 30upx;
	line-height: 180%;
	.title {
		font-size: 50upx;
		padding-bottom: 30upx;
	}
}
</style>
