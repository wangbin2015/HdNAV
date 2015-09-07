#### 一、Map
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

##### 交互选项
|Option|Type|Default|Description|
|---|:---:|---|:---:|
|dragging|Boolean|true|Whether the map be draggable with mouse/touch or not.|
|touchZoom|Boolean|true|Whether the map can be zoomed by touch-dragging with two fingers.|
|scrollWheelZoom|Boolean|true|Whether the map can be zoomed by using the mouse wheel. If passed 'center', it will zoom to the center of the view regardless of where the mouse was.|
|doubleClickZoom|Boolean|true|Whether the map can be zoomed in by double clicking on it and zoomed out by double clicking while holding shift. If passed 'center', double-click zoom will zoom to the center of the view regardless of where the mouse was.|
|boxZoom|Boolean|true|Whether the map can be zoomed to a rectangular area specified by dragging the mouse while pressing shift.|
|tap|Boolean|true|Enables mobile hacks for supporting instant taps (fixing 200ms click delay on iOS/Android) and touch holds (fired as contextmenu events).|
|tapTolerance|Number|15|The max number of pixels a user can shift his finger during touch for it to be considered a valid tap.|
|trackResize|Boolean|true|Whether the map automatically handles browser window resize to update itself.|
|worldCopyJump|Boolean|false|With this option enabled, the map tracks when you pan to another "copy" of the world and seamlessly jumps to the original one so that all overlays like markers and vector layers are still visible.|
|closePopupOnClick|Boolean|true|Set it to false if you don't want popups to close when user clicks the map.|
|bounceAtZoomLimits|Boolean|true|Set it to false if you don't want the map to zoom beyond min/max zoom and then bounce back when pinch-zooming.|
