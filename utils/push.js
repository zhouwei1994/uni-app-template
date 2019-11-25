// APP推送
// #ifdef APP-PLUS
// 打开推送
export const openPush = function(){
	
	uni.getProvider({
	    service: 'push',
	    success: function (res) {
	        console.log(res.provider)
			// 打开推送
			uni.subscribePush({
				provider: res.provider,
				success: function (res) {
					console.log('推送信息:' + JSON.stringify(res));
				}
			});
			// 监听透传数据
			uni.onPush({
			    provider: res.provider,
			    success: function () {
			        console.log('监听透传成功');
			    },
			    callback: function (data) {
			        console.log("接收到透传数据：" + JSON.stringify(data));
			    }
			});
	    }
	});
}
// 关闭推送
export const closePush = function(){
	uni.getProvider({
	    service: 'push',
	    success: function (res) {
	        console.log(res.provider)
			uni.unsubscribePush({
			    provider: res.provider,
			    success: function (res) {
			        console.log('success:' + JSON.stringify(res));
			    }
			});
	    }
	});
}

// #endif
