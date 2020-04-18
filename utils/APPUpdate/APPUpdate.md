# APP版本更新、强制更新

### QQ交流群(学习干货多多) 607391225
![QQ交流群](http://qn.kemean.cn//upload/202004/14/15868301778472k7oubi6.png)

### 使用方法
``` 
// App.vue页面

// #ifdef APP-PLUS
import APPUpdate from "@/utils/APPUpdate";
// #endif

onLaunch: function(e) {
	// #ifdef APP-PLUS
	APPUpdate();
	// #endif
}
```

### `getServerNo`方法说明
```
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
});
```
