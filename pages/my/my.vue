<template>
	<view>
		<nav-bar backState="2000" title="我的"></nav-bar>

		<view class="checkbox_box">
			<view v-for="(item,index) of checkboxList" :key="index" :class="{active: item.checked}" @click="onCheckboxChange(index)">{{item.name}}</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				checkboxList: [{
						checked: false,
						name: "A"
					},
					{
						checked: true,
						name: "B"
					},
					{
						checked: false,
						name: "C"
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
			onCheckboxChange(index) {
				this.checkboxList[index].checked = !this.checkboxList[index].checked;
				this.$forceUpdate();
			},
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

	.checkbox_box {
		view {
			display: flex;
			align-items: center;
			font-size: 28upx;
			padding: 20upx 30upx;
			&::before {
				content: "";
				margin-right: 20upx;
				width: 40upx;
				height: 40upx;
				background-image: url("../../static/icon/ic_gender_unselected.png");
				background-repeat: no-repeat;
				background-position: center center;
				background-size: 100% 100%;
				
			}
			&.active {
				color: #f00;
				&::before {
					background-image: url("../../static/icon/ic_agreed.png");
				}
			}
		}
	}
</style>
