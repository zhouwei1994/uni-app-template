import $http from '@/config/requestConfig'
import store from '@/config/store';
// #ifdef APP-PLUS
import { judgePermission } from '@/utils/permission'
// #endif
// #ifdef H5
import { getBrowser, appMutual } from '@/config/html5Utils';
import { getLocation } from '@/config/wxJsSDK';
// #endif

//支付
export const setPay = function (payInfo, callback) {
	let httpUrl = "";
	if (payInfo.type == 'wxpay') {
		httpUrl = 'api/pay/v1/pay_sign_wx'
	} else if (payInfo.type == 'alipay') {
		httpUrl = 'api/pay/v1/pay_sign_ali'
	} else if (payInfo.type == 'smallPay') {
		httpUrl = 'api/pay/v1/small_pay_sign_wx'
	}
	$http.get(httpUrl, {
		orderNo: payInfo.orderNo
	}).then(data => {
		let payData = {
			success: function (res) {
				callback && callback({ success: true, data: res });
				console.log('success:' + JSON.stringify(res));
			},
			fail: function (err) {
				callback && callback({ success: false, data: err });
				console.log('fail:' + JSON.stringify(err));
			}
		};
		if (payInfo.type == 'smallPay') {
			// 小程序
			payData.provider = 'wxpay';
			payData.timeStamp = data.timeStamp;
			payData.nonceStr = data.nonceStr;
			payData.package = data.package;
			// payData.package = "prepay_id=" + data.prepayid;
			payData.signType = "MD5";
			payData.paySign = data.sign;
		} else if (payInfo.type == 'wxpay') {
			// app微信
			payData.provider = 'wxpay';
			payData.orderInfo = data;
		} else if (payInfo.type == 'alipay') {
			// app 支付宝
			payData.provider = 'alipay';
			payData.orderInfo = data;
		} else if (payInfo.type == 'baidu') {
			payData.provider = 'baidu';
			payData.orderInfo = data;
		}
		console.log("支付参数", payData);
		uni.requestPayment(payData);
	}, err => {
		callback && callback({ success: false, data: err });
	});
}
// 支付统一分配
export const setPayAssign = function (orderInfo, callback) {
	orderInfo.price = orderInfo.price || orderInfo.pricePay;
	orderInfo.title = orderInfo.title || orderInfo.orderTitle;
	//支付
	// #ifdef APP-PLUS
	uni.navigateTo({
		url: '/pages/home/weChatPay?orderNo=' + orderInfo.orderNo + '&price=' + orderInfo.price + '&title=' + orderInfo.title
	});
	// #endif 
	// #ifdef MP-WEIXIN
	setPay({
		...orderInfo,
		type: "smallPay"
	}, callback);
	// #endif
	// #ifdef H5
	if (getBrowser() === '微信') {
		uni.navigateTo({
			url: '/pages/home/weChatPay?orderNo=' + orderInfo.orderNo + '&price=' + orderInfo.price + '&title=' + orderInfo.title
		});
	} else {
		appMutual('setJumpPay', orderInfo);
	}
	// #endif
}
// 错误提示
export const errorToast = function (text) {
	uni.showToast({
		title: text,
		icon: "none"
	});
}
// 微信小程序获取定位权限判断
function wxAppletsLocation(successCallback,errCallback){
	uni.getSetting({
		success: res => {
			if (res.authSetting['scope.userLocation']) {
				uni.getLocation({
					type: 'gcj02',
					success: res => {
						store.commit("setCurrentAddress",{
							latitude: res.latitude,
							longitude: res.longitude
						});
						successCallback(res);
					},
					fail: (err) => {
						tip && errorToast("经纬度信息获取失败");
						errCallback(err);
					}
				});
			} else {
				errCallback("“位置信息”未授权");
				tip && errorToast("“位置信息”未授权");
				uni.showModal({
					title: '提示',
					content: '请先在设置页面打开“位置信息”使用权限',
					confirmText: '去设置',
					cancelText: '再逛会',
					success: res => {
						if (res.confirm) {
							uni.openSetting();
						}
					}
				});
			}
		}
	});
}
// 获取地址信息
let locationAuthorize = true;
export const getLatLon = function(tip){
	const _this = this;
	return new Promise((resolve, reject) => {
		// #ifdef MP
		if(locationAuthorize){
			uni.authorize({
				scope: 'scope.userLocation',
				success:() => {
					wxAppletsLocation(resolve,reject);
					locationAuthorize = false;
				},
				fail:() => {
					locationAuthorize = false;
				}
			});
		}else{
			wxAppletsLocation(resolve,reject);
		}
		// #endif
		// #ifdef APP-PLUS
		judgePermission("location",function(result){
			console.log("获取定位权限",result);
			if(result == 1){
				uni.getLocation({
					type: 'gcj02',
					success: res => {
						store.commit("setCurrentAddress",{
							latitude: res.latitude,
							longitude: res.longitude
						});
						resolve(res);
					},
					fail: (err) => {
						console.log("位置信息错误",err);
						reject(err);
						tip && errorToast("经纬度信息获取失败");
					}
				});
			}
		});
		// #endif
		// #ifdef H5
		if (getBrowser() == '微信') {
			getLocation().then(res => {
				store.commit("setCurrentAddress",{
					longitude: res.longitude,
					latitude: res.latitude
				});
				resolve(res);
			},err => {
				reject(err);
				tip && errorToast("经纬度信息获取失败");
			});
		} else {
			let clearTime = setTimeout(() => {
				reject("获取经纬度超时");
				tip && errorToast("获取经纬度超时");
			},5000);
			window.getAppLatLon = function(res){
				clearTimeout(clearTime);
			    store.commit("setCurrentAddress",{
			    	longitude: res.longitude,
			    	latitude: res.latitude
			    });
			    resolve(res);
			}
			appMutual("getAppLatLon",true);
		}
		// #endif
	});
}