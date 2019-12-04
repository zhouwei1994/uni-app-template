// APP推送

// #ifdef APP-PLUS
// 打开推送
export const openPush = function (callback) {
	uni.getProvider({
		service: 'push',
		success: function (res) {
			console.log(res.provider)
			// 打开推送
			uni.subscribePush({
				provider: res.provider,
				success: function (res) {
					callback && callback(res);
					uni.showModal({
						title: "clientid",
						content: res.clientid,
						showCancel: false
					});
					console.log('推送信息:', res);
				}
			});
			// 监听透传数据
			uni.onPush({
				provider: res.provider,
				success: function () {
					console.log('监听透传成功');
				},
				callback: function (data) {
					console.log("接收到透传数据：", data);
					uni.showModal({
						title: "透传数据",
						content: JSON.stringify(data),
						showCancel: false
					});
				}
			});
		}
	});
}
// 关闭推送
export const closePush = function () {
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
