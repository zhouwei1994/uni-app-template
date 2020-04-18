import base from '@/config/baseUrl';
import store from '@/config/store';
// #ifdef H5
import { setShare } from '@/config/wxJsSDK';
import { getBrowser, appMutual } from '@/config/html5Utils';
// #endif

import appShare from '@/utils/share';
// APP分享
export default appShare;

// #ifdef MP-WEIXIN
// 微信小程序分享
export const wxShare = function (title,path) {
	let shareInfo = {
		title: title || base.share.title,
	};
	if(path && typeof(path) == "string"){
		shareInfo.path = path;
	}else if(path === undefined){
		shareInfo.path = base.share.path;
	}
	if (store.state.userInfo.token) {
		if (shareInfo.path.indexOf("?") >= 0) {
			shareInfo.path += "&recommendCode=" + store.state.userInfo.uid;
		} else {
			shareInfo.path += "?recommendCode=" + store.state.userInfo.uid;
		}
	}
	return shareInfo;
}
// #endif
// #ifdef H5
// 公众号
export const publicShare = function (info = {}) {
	if (getBrowser() == "微信") {
		let shareInfo = {
			title: info.shareTitle || info.title || base.share.title,
			desc: info.desc || info.shareContent || base.share.desc,
			imgUrl: info.imgUrl || info.shareImg || base.share.imgUrl,
			link: info.link || info.shareUrl || base.share.link,
		};
		if (store.state.userInfo.token) {
			if (shareInfo.link.indexOf("?") >= 0) {
				shareInfo.link += "&recommendCode=" + store.state.userInfo.uid;
			} else {
				shareInfo.link += "?recommendCode=" + store.state.userInfo.uid;
			}
		}
		setShare(shareInfo);
	}
}
// #endif

