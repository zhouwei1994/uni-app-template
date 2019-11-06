# request请求、配置简单、源码清晰注释多、超强的适应性（很方便的支持多域名请求）
1. 配置简单、源码清晰注释多、适用于一项目多域名请求、第三方请求、七牛云图片上传、本地服务器图片上传等等
2. 支持请求`get`、`post`、`put`、`delete`
3. 自动显示请求加载动画（可单个接口关闭）
4. 全局`api`数据处理函数，只回调请求正确的数据（可单个接口关闭）
5. 未登录或登录失效自动拦截并调用登录方法（可单个接口关闭）
6. 全局自动提示接口抛出的错误信息（可单个接口关闭）
7. 支持 Promise
8. 支持拦截器

# 文件说明
1. `request.js` 源码文件
2. `requestConfig.js` 请求配置文件（具体看代码）
3. `qiniuUploader.js` 七牛云官方上传文件

# 在main.js引入并挂在Vue上
```
import $http from '@/config/requestConfig';
Vue.prototype.$http = $http;
```

# get请求 正常写法 
```
this.$http.get('aid/region',{pid:0}).
then(function (response) {
	//这里只会在接口是成功状态返回
}).catch(function (error) {
	//这里只会在接口是失败状态返回，不需要去处理错误提示
	console.log(error);
});
```

# post请求 async写法 
```
let data = await this.$http.post('aid/region',{pid:0});
console.log(data);
```

# 其他功能配置项
```
let data = await this.$http.post(
	'http://www.aaa.com/aid/region', //可以直接放链接(将不启用全局定义域名)
	{
		pid:0
	}, 
	{
		isPrompt: true,//（默认 true 说明：本接口抛出的错误是否提示）
		load: true,//（默认 true 说明：本接口是否提示加载动画）
		headers: { //默认 无 说明：请求头
			'Content-Type': 'application/json'
		},
		isFactory: true //（默认 true 说明：本接口是否调用公共的数据处理方法，设置false后isPrompt参数奖失去作用）
	}
);
```

# 本地服务器图片上传（支持多张上传）
```
let data = await this.$http.urlImgUpload('flie/upload',{
	name:"后台接受文件key名称", //默认 file
	count:"最大选择数",//默认 9
	sizeType:"选择压缩图原图，默认两个都选",//默认 ['original', 'compressed']
	sourceType:"选择相机拍照或相册上传 默认两个都选",//默认 ['album','camera']
	data:"而外参数" //可不填
});
```
# 本地服务器文件上传（支持多张上传）
```
this.$http.urlFileUpload({
		data:"向服务器传递的参数", //可不填
		name:"后台接受文件key名称", //默认 file
	},
	[], // 必填 临时文件路径
	(res) => {
		//这里是上传完成了数据数组
	}
);
```

# 七牛云图片上传（支持多张上传）
```
let data = await this.$http.qnImgUpload({ 
		count:"最大选择数",//默认 9
		sizeType:"选择压缩图原图，默认两个都选",//默认 ['original', 'compressed']
		sourceType:"选择相机拍照或相册上传 默认两个都选",//默认 ['album','camera']
	},
	(res) => {
		//这里是每上传一张都返回一张图片地址
	}
);
```

# 七牛云文件上传（支持多张上传）
```
let data = await this.$http.qnFileUpload(
	[], // 必填 临时文件路径
	(res) => {
		//这里是每上传一张都返回一张图片地址
	}
);
```
# jsonp 跨域请求（只支持H5）
```
let data = await this.$http.jsonp('http://www.aaa.com/aid/region',{pid:0});
```
