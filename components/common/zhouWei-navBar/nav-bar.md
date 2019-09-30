## z-nav-bar 适用于 uni-app 项目的头部导航组件

> 导航栏组件，主要用于头部导航，组件名：z-nav-bar，代码块： z-nav-bar。
> 本组件目前兼容微信小程序、H5、5+APP。其他平台没试过
> 本组件支持模式：1.普通固定顶部导航  2.透明导航  3.透明固定顶部导航 4.不固定普通导航
> 本组件内置特殊功能：
> 1.fontColor字体颜色为白色的时候手机状态栏会自动显示白色，否则显示灰色
> 2.页面为第一个页面时左上角自动显示返回主页的图标(具体看组件：z-nav-bar/nav-bar.vue =>页面script)
## 使用方法
> 在main.js引入组件，并注册全局组件
```
import zNavBar from "@/components/common/z-nav-bar/nav-bar";
Vue.component("z-nav-bar", zNavBar);
```
> 或者在页面script中引入组件，并注册组件
```
import zNavBar from "@/components/common/z-nav-bar/nav-bar";
export default {
    components: {zNavBar}
}
```
> 在 template 中使用组件(案例一)
```
//默认特性：左上角有返回箭头，nav-bar导航固定在顶部、标题居中
<z-nav-bar>我的</z-nav-bar>
```
> 在 template 中使用组件(案例二)
```
//特性：无返回箭头、字体色为白色、标题左对齐、nav-bar导航透明并不固定在顶部、右边插槽有按钮
<z-nav-bar :back="false" fontColor="#FFF" :titleCenter="false" type="transparent" title="我的">
	<view class="icon_setUp" slot="right">设置</view>
</z-nav-bar>
```
> 在 template 中使用组件(案例三：透明|固定|滑动逐渐变颜色|两种状态的按钮插槽)
```
//特性：有返回箭头、nav-bar导航透明并固定在顶部、透明状态字体为白色、页面想下滑动nav-bar导航条逐渐变白色、右边插槽有按钮
<z-nav-bar transparentFixedFontColor="#FFF" type="transparentFixed" title="我的简历">
	<view class="transparent_fixed_preview" slot="transparentFixedRight" @click="onPreview">预览</view> //透明状态下的按钮
	<view class="preview" slot="right" @click="onPreview">预览</view> //不状态下的按钮
</z-nav-bar>
```
> 在 template 中使用组件(案例四：搜索框|地区选择)
```
//特性：无返回箭头、nav-bar导航固定在顶部、地区选择、搜索框
<z-nav-bar :back="false">
	<view slot="left" class="address_select">深圳市</view>
	<view slot="right" class="search_box" @click="onPageJump('/pages/home/search')">
		<text class="icon_search"></text>
		<text class="tips">搜索目的地/职位等</text>
	</view>
</z-nav-bar>
```
## 属性
| 名称                        | 类型          | 默认值          | 描述                                               |
| ----------------------------|--------------- | ------------- | ---------------------------------------------------|
| back                        | Boolean        | true          | 返回上一页面                                        |
| bgColor                     | String         | #FFF          | 导航背景颜色                                        |
| fontColor                   | String         | #000          | 导航字体颜色                                        |
| titleCenter                 | Boolean        | true          | 标题title居中                                       |
| title                       | String         | --            | 标题title值                                         |
| transparentFixedFontColor   | String         | #000          | 导航type类型为transparentFixed时透明状态下的字体颜色 |
| type                        | String         | fixed         | 导航类型，可选：1.fixed固定导航 2.ordinary不固定导航 3.transparent透明不固定导航 4.transparentFixed透明固定导航|

## 插槽
| 名称                  | 描述                                                               |
| ----------------------|-------------------------------------------------------------------|   
| left                  | 左插槽                                                             |
| default               | 中间标题插槽（type类型为transparentFixed时插槽只会穿透到实色背景下）                                                    |
| right                 | 右插槽（只有H5和5+App才有）                                         |
| transparentFixedLeft  | 导航type类型为transparentFixed时透明状态下左插槽                    |
| transparentFixedRight | 导航type类型为transparentFixed时透明状态下右插槽（只有H5和5+App才有）|

## 事件（type类型为transparentFixed时可用）
| 名称             | 参数              | 描述                      |
| -----------------|------------------| --------------------------|
| scroll           | 滚动条到顶部距离  | 代替页面的onPageScroll函数 |
