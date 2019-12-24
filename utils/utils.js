import $http from '@/config/request'
import store from '@/config/store';
// #ifdef APP-PLUS
import { judgePermission } from '@/utils/permission'
// #endif
// #ifdef H5
import { getBrowser, appMutual } from '@/config/html5Utils';
import { getLocation } from '@/config/wxJsSDK';
// #endif
/**
 * json数据去重合并
 */
export const modifyJson = (json, oldJson) => {
	if (!json && !oldJson) {
		return;
	}
	if (typeof json !== "object") {
		json = JSON.parse(json);
	}
	if (typeof oldJson !== "object") {
		oldJson = JSON.parse(oldJson);
	}

	var jsonData = {};
	for (var i in oldJson) {
		jsonData[i] = oldJson[i];
	}
	for (var j in json) {
		jsonData[j] = json[j];
	}

	return jsonData;
}
/**
 * 时间转换为XX前
 */
export const clickDateDiff = function (value) {
	var result;
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var month = day * 30;
	var now = new Date().getTime();
	var diffValue = parseInt(now) - parseInt(value);
	if (diffValue < 0) {
		return;
	}
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;
	if (monthC >= 1) {
		result = "" + parseInt(monthC) + '月前';
	} else if (weekC >= 1) {
		result = "" + parseInt(weekC) + '周前';
	} else if (dayC >= 1) {
		result = "" + parseInt(dayC) + '天前';
	} else if (hourC >= 1) {
		result = "" + parseInt(hourC) + '小时前';
	} else if (minC >= 1) {
		result = "" + parseInt(minC) + '分钟前';
	} else {
		result = '刚刚';
	}
	return result;
};
/**
 * 时间戳转换为想要的时间格式
 */
//时间戳转换为时间 format('yyyy-MM-dd hh:mm:ss')
//时间格式转换
Date.prototype.format = function (fmt = 'yyyy-MM-dd hh:mm:ss') { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[
			k]).substr(("" + o[k]).length)));
	return fmt;
}

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
			payData.timeStamp = data.timestamp;
			payData.nonceStr = data.noncestr;
			// payData.package = data.package;
			payData.package = "prepay_id=" + data.prepayid;
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
// 支付分配
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
// #ifdef H5
window.getAppLatLon = function (res) {
	store.commit("setCurrentAddress", {
		longitude: res.longitude,
		latitude: res.latitude
	});
}
// #endif
// 获取地址信息
export const getLatLon = function (tip) {
	const _this = this;
	return new Promise((resolve, reject) => {
		// #ifdef MP
		uni.getSetting({
			success: res => {
				if (res.authSetting['scope.userLocation']) {
					uni.getLocation({
						type: 'gcj02',
						success: res => {
							store.commit("setCurrentAddress", {
								latitude: res.latitude,
								longitude: res.longitude
							});
							resolve(res);
						},
						fail: (err) => {
							tip && errorToast("经纬度信息获取失败");
							reject(err);
						}
					});
				} else {
					reject("“位置信息”未授权");
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
		// #endif
		// #ifdef APP-PLUS
		judgePermission("location", function (result) {
			if (result == 1) {
				uni.getLocation({
					type: 'gcj02',
					success: res => {
						store.commit("setCurrentAddress", {
							latitude: res.latitude,
							longitude: res.longitude
						});
						resolve(res);
					},
					fail: (err) => {
						console.log("位置信息错误", err);
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
				store.commit("setCurrentAddress", {
					longitude: res.longitude,
					latitude: res.latitude
				});
				resolve(res);
			}, err => {
				reject(err);
				tip && errorToast("经纬度信息获取失败");
			});
		} else {
			let clearTime = setTimeout(() => {
				reject("获取经纬度超时");
				tip && errorToast("获取经纬度超时");
			}, 5000);
			window.getAppLatLon = function (res) {
				clearTimeout(clearTime);
				store.commit("setCurrentAddress", {
					longitude: res.longitude,
					latitude: res.latitude
				});
				resolve(res);
			}
			appMutual("getAppLatLon", true);
		}
		// #endif
	});
}
