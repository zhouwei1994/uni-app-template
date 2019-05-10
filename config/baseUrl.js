// 当前环境
const court = "开发";
const courtConfig = {
	/****************开发环境****************/
	"开发": {
		//微信小程序appid=wx24f5b4156f6de485
		//请求接口
		baseUrl: "http://t.3672api.86court.com",
		//图片路径
		imgBaseUrl: "http://t.3672api.86court.com",
		//页面分享配置
		share: function () {
			return {
				title: '交友小程序',
				path: '/pages/index/index'
			}
		}
	},
	"交友": {
		//微信小程序appid=wx91a38ef0b01ee2a3
		//请求接口
		baseUrl: "https://gzapi.86court.com",
		//图片路径
		imgBaseUrl: "https://gzapi.86court.com",
		//页面分享配置
		share: function () {
			return {
				title: '交友小程序',
				path: '/pages/index/index'
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
