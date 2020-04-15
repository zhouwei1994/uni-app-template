// #ifdef APP-PLUS 
// 请求配置说明：https://ext.dcloud.net.cn/plugin?id=822
import $http from '@/config/requestConfig';

const platform = uni.getSystemInfoSync().platform;
// 获取当前应用的版本号
export const getCurrentNo = function (callback) {
	// 获取本地应用资源版本号
	plus.runtime.getProperty(plus.runtime.appid, function (inf) {
		callback && callback({
			versionCode: inf.version.replace(/\./g, ""),
			version: inf.version
		});
	});
}
// 发起ajax请求获取服务端版本号
export const getServerNo = function (isPrompt, callback) {
	let httpData = {};
	if (platform == "android") {
		httpData.type = 1101;
	} else {
		httpData.type = 1102;
	}
	$http.get("api/kemean/aid/app_version", httpData).then(res => {
		/* res的数据说明
		* | 参数名称	     | 一定返回 	| 类型	    | 描述
		* | -------------|--------- | --------- | ------------- |
		* | versionCode	 | y	    | int	    | 版本号        |
		* | versionName	 | y	    | String	| 版本名称      |
		* | versionInfo	 | y	    | String	| 版本信息      |
		* | forceUpdate	 | y	    | boolean	| 是否强制更新  |
		* | downloadUrl	 | y	    | String	| 版本下载链接  |
		*/
		if (res && res.downloadUrl) {
			callback && callback(res);
		} else if (isPrompt) {
			uni.showToast({
				title: "暂无新版本",
				icon: "none"
			});
		}
	});
}
// 从服务器下载应用资源包（wgt文件）
export const getDownload = function (wgtUrl, callback) {
	plus.nativeUI.showWaiting("正在下载安装文件...");
	plus.downloader.createDownload(wgtUrl, { filename: "_doc/update/" }, function (d, status) {
		if (status == 200) {
			callback && callback(d.filename); // 安装wgt包  
		} else {
			plus.nativeUI.alert("下载失败！");
		}
		plus.nativeUI.closeWaiting();
	}).start();
}
// 文字换行
	function drawtext(text, maxWidth) {
		let textArr = text.split("");
		let len = textArr.length;
		// 上个节点
		let previousNode = 1;
		// 记录节点宽度
		let nodeWidth = 0;
		// 文本换行数组
		let rowText = [];
		for (let i = 0; i < len; i++) {
			if (/[\u4e00-\u9fa5]/g.test(textArr[i])) {
				nodeWidth += 24;
			} else {
				nodeWidth += 12;
			}
			if (nodeWidth >= maxWidth) {
				rowText.push(text.substring(previousNode, i));
				previousNode = i;
				nodeWidth = 0;
			}
		}
		if(previousNode < text.length){
			rowText.push(text.substring(previousNode, text.length));
		}
		return rowText.length;
	}
// 是否更新弹窗
function updatePopup(){ 
	// 弹窗遮罩层
	let maskLayer = new plus.nativeObj.View("maskLayer", { //先创建遮罩层
		top: '0px',
		left: '0px',
		height: '100%',
		width: '100%',
		backgroundColor: 'rgba(0,0,0,0.5)'
	});
	
	let contentText =  '905美丽焕颜节9月5日10点准时开始，全场限时特价，更有666元大礼包、0元秒杀等你来抢，更有机会赢取新款iPhone手机!';
	// 以下为计算菜单的nview绘制布局，为固定算法，使用者无关关心
	const screenWidth = plus.screen.resolutionWidth;
	const screenHeight = plus.screen.resolutionHeight;
	//弹窗容器宽度
	const popupViewWidth = screenWidth * 0.7;
	// 弹窗容器的宽度
	const viewContentWidth = popupViewWidth * 0.8;
	// 弹窗容器的Padding
	const viewContentPadding = (popupViewWidth * 0.2) / 2;
	// 文本高度
	let viewContentHeight = drawtext(contentText,viewContentWidth) * 14;
	// 弹窗容器高度
	const popupViewHeight = viewContentHeight + 80 + 20 + 20;
	// 弹窗内容
	let popupView = new plus.nativeObj.View("popupView", { //创建底部图标菜单
		tag: "rect",
		top: (screenHeight - popupViewHeight)/2 + "px",
		left: '15%',
		height: popupViewHeight + "px",
		width: "70%"
	});
	popupView.draw([
		{
			tag: 'rect', //菜单顶部的分割灰线
			backgroundColor: 'rgb(255,255,255)',
			rectStyles: {
				radius: "6px"
			},
			position: {
				top: "40px",
				height: popupViewHeight - 40 + "px",
			}
		},
		{
			src: "https://qn.kemean.cn/upload/201906/19/3f3b4751f3ed4a97be804450c3ec4c79",
			id: "logo",
			tag: "img",
			position: {
				top: "0px",
				left: (popupViewWidth - 80) / 2 + "px",
				width: "80px",
				height: "80px",
			},
			rectStyles: {
				radius: "40px"
			}
		},
		{
			tag: 'font',
			id: 'content', //底部取消按钮的文字
			text: contentText,
			textStyles: {
				size: '14px',
				color:"#666",
				lineSpacing: "50%",
				whiteSpace:"normal"
			},
			position: {
				top: '100px',
				left: viewContentPadding + "px",
				width: viewContentWidth,
				height: viewContentHeight,
			}
		},
	]);
	
	// 点击遮罩层
	maskLayer.addEventListener("click", function () { //处理遮罩层点击
		// maskLayer.hide();
		// popupView.hide();
	});
	// 显示弹窗
	maskLayer.show();
	popupView.show();
}
// 更新应用资源包（wgt文件）
export const getInstall = function (path) {
	plus.nativeUI.showWaiting("正在安装文件...");
	plus.runtime.install(path, {}, function () {
		plus.nativeUI.closeWaiting();
		plus.nativeUI.alert("应用资源更新完成！", function () {
			plus.runtime.restart();
		});
	}, function (e) {
		plus.nativeUI.closeWaiting();
		plus.nativeUI.alert("安装文件失败[" + e.code + "]：" + e.message);
	});
}
export default function (isPrompt) {
	updatePopup();
	// getCurrentNo(version => {
		// getServerNo(isPrompt, res => {
		// 	if (version.versionCode < res.versionCode) {
		// 		if (res.forceUpdate) {
		// 			if (/\.wgt$/i.test(res.downloadUrl)) {
		// 				getDownload(res.downloadUrl, path => {
		// 					getInstall(path);
		// 				});
		// 			} else {
		// 				if (platform == "android") {
		// 					getDownload(res.downloadUrl, path => {
		// 						getInstall(path);
		// 					});
		// 				} else {
		// 					plus.runtime.openURL(res.downloadUrl);
		// 				}
		// 			}
		// 		} else {
		// 			uni.showModal({
		// 				title: "更新提示",
		// 				content: "有新版本，是否更新APP？",
		// 				success: modalData => {
		// 					if (modalData.confirm) {
		// 						if (/\.wgt$/i.test(res.downloadUrl)) {
		// 							getDownload(res.downloadUrl, path => {
		// 								getInstall(path);
		// 							});
		// 						} else {
		// 							if (platform == "android") {
		// 								getDownload(res.downloadUrl, path => {
		// 									getInstall(path);
		// 								});
		// 							} else {
		// 								plus.runtime.openURL(res.downloadUrl);
		// 							}
		// 						}
		// 					}
		// 				}
		// 			})
		// 		}
		// 	} else if (isPrompt) {
		// 		uni.showToast({
		// 			title: "当前已是最新版本了",
		// 			icon: "none"
		// 		});
		// 	}
		// });
	// });
}
// #endif