#### Map
***
API各种类中的核心部分，它用来在页面创建地图并操纵它      

##### 应用实例
```javascript
// 初始化一个地图在ID为map的div元素上，并指定地图中心位置以及缩放比例
var map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 13
});
```
##### 创建

|工厂函数|描述|
|---|:---:|
|`L.map( <HTMLElement|String> id, options? )`|通过div元素和带有地图选项的描述的文字对象来实例化一个地图对象，其中文字对象是可选的|

##### 可选参数
###### 地图状态选项
|Option|Type|Default|Description|
|---|:---:|---|:---:|
|center|LatLng|null|初始化地图的地理中心|
|zoom|Number|null|初始化地图的缩放|
|layers|ILayer[]|null|初始化将要加载到地图上的图层|
|minZoom|Number|null|地图的最小视图，可以重写任何地图图层上的最小视图|
|maxZoom|Number|null|地图的最大视图，可以重写任何地图图层上的最大视图|
|maxBounds|LatLngBounds|null|当这个选项被设置后，地图被限制在给定的地理边界内，当用户平移将地图拖动到视图以外的范围时会出现弹回的效果，并且也不允许缩小视图到给定范围以外的区域（这取决于地图的尺寸），使用setMaxBounds方法可以动态地设置这种约束|
|crs|CRS|L.CRS.EPSG3857|使用的坐标系，当你不确定坐标系是什么时请不要更改|
