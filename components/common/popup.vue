<template>
	<view @touchmove="onTouchMove">
		<!-- 遮罩层动画 -->
		<view class="mask" @click="hideOnBlur && (currentValue = false)" v-if="currentValue"></view>
		<!-- 显示信息层 -->
		<view class="popup_box" :class="{'bottom': type == 1000 ,'center':type == 2000}" :animation="animationData"><slot></slot></view>
	</view>
</template>

<script>
	let animation;
export default {
	props: {
		//是否显示
		value: {
			type: Boolean,
			default: function() {
				return false;
			}
		},
		//点击遮罩层关闭弹窗
		hideOnBlur: {
			default: function() {
				return true;
			}
		},
		//禁止页面滚动
		scroll: {
			type: Boolean,
			default: true
		},
		// 类型 
		//  1000 靠下
		//  2000 居中
		type: {
			type: String,
			default: function() {
				return '1000';
			}
		}
	},
	created() {
		// 弹出层动画创建
		animation = uni.createAnimation({
			duration: 400, // 整个动画过程花费的时间，单位为毫秒
			timingFunction: 'ease', // 动画的类型
			delay: 0 // 动画延迟参数
		});
		if (typeof this.value !== 'undefined') {
			this.currentValue = this.value;
			this.setAnimation(this.value);
		}
	},
	watch: {
		value(val) {
			this.currentValue = val;
			this.setAnimation(val);
		},
		currentValue(val) {
			this.$emit(val ? 'on-show' : 'on-hide');
			this.$emit('input', val);
		}
	},
	data() {
		return {
			// 传进来的值
			currentValue: false,
			animationData:{}
		};
	},
	methods: {
		onTouchMove: function(event) {
			!this.scroll && event.preventDefault();
		},
		setAnimation(val){
			if(this.type == 1000){
				if(val){
					animation.opacity(1).translateY('0%');
				}else{
					animation.opacity(0).translateY('100%');
				}
			}else if(this.type == 2000){
				if(val){
					animation.opacity(1).translateX("-50%").translateY("-50%").scale(1);
				}else{
					animation.opacity(0).translateX("-50%").translateY("-50%").scale(0);
				}
			}
			animation.step();
			this.animationData = animation.export();
		}
	}
};
</script>

<style lang="scss" scoped>
/*遮罩层*/
.mask {
	position: fixed;
	z-index: 500;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
}
.popup_box {
	position: fixed;
	max-width: 100%;
	max-height: 100%;
	min-height: 50upx;
	z-index: 501;
	opacity: 0;
	font-size: 28upx;
	&.bottom {
		left: 0upx;
		bottom: 0upx;
		min-width: 100%;
		transform: translateY(100%);
	}
	&.center {
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
	}
}
</style>
