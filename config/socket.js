import base from '@/config/baseUrl';
import store from '@/config/store';
class socket {
	constructor(options) {
		//地址
		this.socketUrl = base.socketUrl + "kemeanim_handle/im_token=";
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
		if(this.canInitSocket){
			this.canInitSocket = false;
			uni.connectSocket({
				url: this.socketUrl + store.state.userInfo.imToken,
				method: 'GET'
			});
			uni.onSocketOpen(function(res) {
				callback && callback();
				_this.canInitSocket = true;
				console.log('WebSocket连接已打开！');
				_this.getHeartbeat();
			});
		}
	}
	//Socket给服务器发送消息
	send(data, callback) {
		const _this = this;
		if (store.state.userInfo.imToken) {
			data.imToken = store.state.userInfo.imToken;
		}
		uni.sendSocketMessage({
			data: JSON.stringify(data),
			success: () => {
				callback && callback();
			}
		});
	}
	//Socket接收服务器发送过来的消息
	socketReceive() {
		const _this = this;
		uni.onSocketMessage(function(res) {
			let data = JSON.parse(res.data);
			console.log('收到服务器内容：', data);
			if (data.targetUid == _this.roomId && data.messageType !== "jump") {
				_this.getPageReceive && _this.getPageReceive(data);
			} else {
				uni.showToast({
					title: data.userNickName + "发生了一条新消息",
					icon: "none"
				});
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
		uni.onSocketClose(function(res) {
			console.log('WebSocket 已关闭！');
			_this.init();
		});
	}
	//监听Socket错误
	monitorSocketError() {
		const _this = this;
		uni.onSocketError(function(res) {
			console.log('WebSocket连接打开失败，请检查！');
		});
	}
	//心跳
	getHeartbeat() {
		this.send({
			toUid: 0,
			messageType: "jump",
			content: "心跳",
			contentType: "txt"
		}, () => {
			setTimeout(() => {
				this.getHeartbeat();
			}, 10000);
		});
	}
};
var mySocket = new socket();
export default mySocket;
