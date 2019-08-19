import base from '@/config/baseUrl';
import store from '@/config/store';
class socket {
	constructor(options) {
		//地址
		this.socketUrl = base.socketUrl + "my_web_socket_endpoint/userUid=";
		//是否重新连接
		this.canInitSocket = true;
		//socket是否在连接中
		this.connecting = false;
		this.monitorSocketError();
		this.monitorSocketClose();
		this.socketReceive();
	}
	init(callback) {
		const _this = this;
		console.log("WebSocket初始化");
		if(this.canInitSocket && !this.connecting){
			this.canInitSocket = false;
			uni.connectSocket({
				url: this.socketUrl + store.state.userInfo.userUid,
				method: 'GET'
			});
			uni.onSocketOpen(function(res) {
				callback && callback();
				_this.canInitSocket = true;
				_this.connecting = true;
				console.log('WebSocket连接已打开！');
				_this.getHeartbeat();
			});
		}
	}
	//Socket给服务器发送消息
	send(data, callback) {
		const _this = this;
		console.log(data);
		uni.sendSocketMessage({
			data: JSON.stringify(data),
			success: () => {
				callback && callback(true);
			},
			fail: () => {
				callback && callback(false);
			}
		});
	}
	//Socket接收服务器发送过来的消息
	socketReceive() {
		const _this = this;
		uni.onSocketMessage(function(res) {
			let data = JSON.parse(res.data);
			console.log('收到服务器内容：', data);
			if(data.messageType == "order"){
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.volume = 1;
				innerAudioContext.src = 'https://qn.kemean.cn/upload/201908/16/c61db0ac111443da83c71583d767e184';
				innerAudioContext.onPlay(() => {
				  console.log('开始播放');
				});
				innerAudioContext.onError((res) => {
				  console.log(res.errMsg);
				  console.log(res.errCode);
				});
				uni.showTabBarRedDot({
					index:0
				});
				_this.noticeOrderModule && _this.noticeOrderModule();
			}
		});
		
	}
	//关闭Socket
	closeSocket() {
		uni.closeSocket();
		this.connecting = false;
	}
	//监听Socket关闭
	monitorSocketClose() {
		const _this = this;
		uni.onSocketClose(function(res) {
			console.log('WebSocket 已关闭！');
			_this.connecting = false;
			_this.init();
		});
	}
	//监听Socket错误
	monitorSocketError() {
		const _this = this;
		uni.onSocketError(function(res) {
			_this.connecting = false;
			console.log('WebSocket连接打开失败，请检查！');
		});
	}
	//心跳
	getHeartbeat() {
		const _this = this;
		this.send({
			toUserUid:0,
			messageType: "connect",
			messageContent: "心跳",
		}, (val) => {
			setTimeout(() => {
				if(val){
					_this.getHeartbeat();
				}else{
					_this.init();
				}
			}, 10000);
		});
	}
};
var mySocket = new socket();
export default mySocket;
