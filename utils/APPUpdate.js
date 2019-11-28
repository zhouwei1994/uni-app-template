// #ifdef APP-PLUS  
import $http from '@/config/requestConfig'
const platform = uni.getSystemInfoSync().platform;
// 获取当前应用的版本号
export const getCurrentNo = function (callback) {
	// 获取本地应用资源版本号
	plus.runtime.getProperty(plus.runtime.appid, function (inf) {
		console.log("当前应用版本：", inf);
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
		console.log(res);
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
			console.log("下载wgt成功：" + d.filename);
			callback && callback(d.filename); // 安装wgt包  
		} else {
			console.log("下载wgt失败！");
			plus.nativeUI.alert("下载失败！");
		}
		plus.nativeUI.closeWaiting();
	}).start();
}
// 更新应用资源包（wgt文件）
export const getInstall = function (path) {
	plus.nativeUI.showWaiting("正在安装文件...");
	plus.runtime.install(path, {}, function () {
		plus.nativeUI.closeWaiting();
		console.log("安装wgt文件成功！");
		plus.nativeUI.alert("应用资源更新完成！", function () {
			plus.runtime.restart();
		});
	}, function (e) {
		plus.nativeUI.closeWaiting();
		console.log("安装wgt文件失败[" + e.code + "]：" + e.message);
		plus.nativeUI.alert("安装文件失败[" + e.code + "]：" + e.message);
	});
}
export default function (isPrompt) {
	getCurrentNo(version => {
		getServerNo(isPrompt, res => {
			console.log(version, res);
			if (version.versionCode < res.versionCode) {
				if (res.forceUpdate) {
					if (/\.wgt$/i.test(res.downloadUrl)) {
						getDownload(res.downloadUrl, path => {
							getInstall(path);
						});
					} else {
						if (platform == "android") {
							getDownload(res.downloadUrl, path => {
								getInstall(path);
							});
						} else {
							plus.runtime.openURL(res.downloadUrl);
						}
					}
				} else {
					uni.showModal({
						title: "更新提示",
						content: "有新版本，是否更新APP？",
						success: modalData => {
							if (modalData.confirm) {
								if (/\.wgt$/i.test(res.downloadUrl)) {
									getDownload(res.downloadUrl, path => {
										getInstall(path);
									});
								} else {
									if (platform == "android") {
										getDownload(res.downloadUrl, path => {
											getInstall(path);
										});
									} else {
										plus.runtime.openURL(res.downloadUrl);
									}
								}
							}
						}
					})
				}
			} else if (isPrompt) {
				uni.showToast({
					title: "当前已是最新版本了",
					icon: "none"
				});
			}
		});
	});
}
// #endif