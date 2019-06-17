// 当前环境
const court = "开发";
const courtConfig = {
	/****************开发环境****************/
	"开发": {
		//微信小程序appid=wx04df1c9c5679b134
		//请求接口
		baseUrl: "https://dev.kemean.net/make_friends/",
		//图片路径
		imgBaseUrl: "https://dev.kemean.net/make_friends/",
		//webSocket地址
		socketUrl:"wss://dev.kemean.net/make_friends/",
		//平台名称
		platformName:"青缘福田",
		//页面分享配置
		share: function () {
			return {
				title: '青缘福田',
				path: '/pages/home/home'
			}
		}
	},
	"交友": {
		//微信小程序appid=
		//请求接口
		baseUrl: "",
		//图片路径
		imgBaseUrl: "",
		//webSocket地址
		socketUrl:"ws://dev.kemean.net",
		//平台名称
		platformName:"青缘福田",
		//页面分享配置
		share: function () {
			return {
				title: '青缘福田',
				path: '/pages/home/home'
			}
		}
	},
};
//手机号验证正则表达式
const phoneRegular = /^1\d{10}$/;
//邮箱验证正则表达式
const mailRegular = /^\w+@\w+(\.[a-zA-Z]{2,3}){1,2}$/;
//密码验证正则表达式
const passwordRegular = /^[a-zA-Z0-9]{4,10}$/;
export default Object.assign({
	phoneRegular,
	mailRegular,
	passwordRegular
}, courtConfig[court]);
