<template>
	<view>
		<nav-bar title="弹窗输入框"></nav-bar>
		<view class="table_box">
			<view class="table_hred">
				<text>组件参数</text>
				<text>类型</text>
				<text>描述</text>
			</view>
			<view class="table_content">
				<text>v-model</text>
				<text>Boolean</text>
				<text>控制弹窗显示隐藏</text>
			</view>
			<view class="table_content">
				<text>hideOnBlur</text>
				<text>Boolean</text>
				<text>是否点击遮罩层关闭弹窗</text>
			</view>
			<view class="table_content">
				<text>type</text>
				<text>String</text>
				<text>1000（默认值）靠下，2000 居中</text>
			</view>
			<view class="table_content">
				<text>@change</text>
				<text>function</text>
				<text>窗口显示隐藏变化事件</text>
			</view>
		</view>
		<view class="input_form_box">
			<z-prompt :options="options" :value="value">
				<view class="input_box">
					<view class="name required">第一种打开弹窗</view>
					<view class="select_info">
						<text class="select">点击打开弹窗</text>
					</view>
				</view>
			</z-prompt>
			<view class="input_box">
				<view class="name required">居中弹窗，</view>
				<view class="select_info" @click="popupShow2 = true">
					<text class="select">点击打开弹窗</text>
				</view>
			</view>
			<view class="input_box">
				<view class="name required">点击遮罩层不关闭</view>
				<view class="select_info" @click="popupShow3 = true">
					<text class="select">点击打开弹窗</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import zPrompt from '@/components/common/prompt';
export default {
	components:{
		zPrompt
	},
	data() {
		return {
			popupShow: false,
			popupShow2: false,
			popupShow3: false,
			value: "默认值1",
			options: {
				title: '操作', // 标题
				tips: "请输入", // 提示
				confirmText: '确认', // 确认按钮文字
				placeholder: '',  // 输入框提示文字
				password: false,  // 是否是密码框
				inputType: 'text',  // 输入框类型
			},
		};
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
		},
		onChange(e){
			if(e){
				uni.showToast({
					title:"打开了弹窗",
					icon:"none"
				});
			}else {
				uni.showToast({
					title:"关闭了弹窗",
					icon:"none"
				});
			}
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
.popup_box {
	width: 600rpx;
}
.popup_title {
	display: flex;
	justify-content: space-between;
	height: 88upx;
	line-height: 88upx;
	border-bottom: 2upx solid #ebebeb;
	padding: 0 20upx;
	background-color: #FFF;
}
.popup_title view {
	font-size: 32upx;
}
.popup_title text {
	width: 80upx;
	flex-shrink: 0;
	text-align: center;
}
.popup_title text {
	font-size: 28upx;
	color: #999;
}
.popup_title text:last-child {
	color: $themeColor;
}
.popup_content {
	padding: 80rpx 30rpx;
	background-color: #FFFFFF;
	text-align: center;
}
</style>
