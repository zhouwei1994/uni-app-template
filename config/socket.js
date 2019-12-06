import base from '@/config/baseUrl';
import store from '@/config/store';
class socket {
	constructor(options) {
		//地址
		this.socketUrl = base.socketUrl + "kemeanim_handle/user_token=";
		//当前房间Id
		this.roomId = "";
		//是否重新连接
		this.canInitSocket = true;
		this.monitorSocketError();
		this.monitorSocketClose();
		this.socketReceive();
	}
	init(callback) {
		const _this = this;
		if (base.socketUrl && this.canInitSocket) {
			this.canInitSocket = false;
			uni.connectSocket({
				url: this.socketUrl + store.state.userInfo.token,
				method: 'GET'
			});
			uni.onSocketOpen(function (res) {
				callback && callback();
				console.log('WebSocket连接已打开！');
				_this.getHeartbeat();
				setTimeout(() => {
					_this.canInitSocket = true;
				}, 5000);
			});
		}
	}
	//Socket给服务器发送消息
	send(data, callback) {
		const _this = this;
		if (store.state.userInfo.uid) {
			data.userUid = store.state.userInfo.uid;
		}
		uni.sendSocketMessage({
			data: JSON.stringify(data),
			success: () => {
				callback && callback(true);
			},
			fail: () => {
				callback && callback(false);
				if (data.messageType != "jump") {
					uni.showToast({
						title: "消息发送失败,请重新发送",
						icon: "none"
					});
					_this.canInitSocket = true;
					_this.init();
				}
			}
		});
	}
	//Socket接收服务器发送过来的消息
	socketReceive() {
		const _this = this;
		uni.onSocketMessage(function (res) {
			let data = JSON.parse(res.data);
			console.log('收到服务器内容：', data);
			if (data.messageType == "service") {
				if (data.toShopId == _this.roomId) {
					_this.getPageReceive && _this.getPageReceive(data);
				} else {
					uni.showTabBarRedDot({
						index: 2
					});
					_this.getListReceive && _this.getListReceive(data);
				}
			}
		});
	}
	//关闭Socket
	closeSocket() {
		uni.closeSocket();
	}
	//监听Socket关闭
	monitorSocketClose() {
		const _this = this;
		uni.onSocketClose(function (res) {
			console.log('WebSocket 已关闭！');
			setTimeout(function () {
				_this.init();
			}, 3000);
		});
	}
	//监听Socket错误
	monitorSocketError() {
		const _this = this;
		uni.onSocketError(function (res) {
			console.log('WebSocket连接打开失败，请检查！');
		});
	}
	//心跳
	getHeartbeat() {
		const _this = this;
		this.send({
			toShopId: 0,
			messageType: "jump",
			content: "心跳",
			contentType: "txt"
		}, (val) => {
			setTimeout(() => {
				if (val) {
					_this.getHeartbeat();
				} else {
					_this.init();
				}
			}, 10000);
		});
	}
};
var mySocket = new socket();
export default mySocket;
